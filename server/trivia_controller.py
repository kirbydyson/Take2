from flask import Blueprint, jsonify, session
from utils.db_context import get_db_context
from db import get_connection
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime
import os
import json
import decimal
from flask import request

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
trivia_bp = Blueprint('trivia', __name__)
CACHE_FILE = 'trivia_cache.json'

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    return {}

def convert_for_json(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: convert_for_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_for_json(i) for i in obj]
    return obj

def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(convert_for_json(cache), f, indent=2)

def generate_question():
    prompt = "Generate a trivia question based on Major League Baseball. The question will be fed back into you to generate a query so make it easy to generate an SQL query for. Provide the question only, do not include any other filler text. The categories are: 'Hall of Fame, 'Teams' 'Pitching, 'Batting', 'People', and 'Awards'. The question should be in the format: 'What is the name of the player who...?' or 'Which team won the...?' or 'Who was the first player to...?'."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

def generate_sql_query(question, db_context):
    prompt = f"""You are a SQL expert. Given the question below and the database schema context, generate a SQL query that can help answer it and return only one item. Do not include any other text or explanation. The SQL query should be in standard SQL format and should not include any comments or explanations. Return only nameFirst and nameLast, OR team_name. If needed, use JOINs to get the data. Always return only one row.

QUESTION:
{question}

DATABASE CONTEXT:
{db_context}

SQL:"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

def run_query(cursor, sql):
    try:
        cursor.execute(sql)
        return cursor.fetchall()
    except Exception as e:
        print(f"Query execution failed: {e}")
        return None

@trivia_bp.route('/api/trivia/get-questions', methods=['GET'])
def get_trivia_questions():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    db_context = get_db_context()
    cache = load_cache()

    qa_pairs = []
    seen_questions = set()
    attempts = 0
    max_attempts = 25  # Allow retries

    while len(qa_pairs) < 5 and attempts < max_attempts:
        question = generate_question()
        if question in seen_questions:
            attempts += 1
            continue  # Avoid duplicate question in same response

        seen_questions.add(question)

        if question in cache:
            qa_pairs.append(cache[question])
        else:
            sql = generate_sql_query(question, db_context)
            result = run_query(cursor, sql)
            if result:
                pair = {
                    "question": question,
                    "result": result
                }
                cache[question] = pair
                qa_pairs.append(pair)
        attempts += 1

    cursor.close()
    conn.close()
    save_cache(cache)

    return jsonify({"questions": qa_pairs})

@trivia_bp.route('/api/trivia/random-players', methods=['GET'])
def get_random_players():
    exclude_name = request.args.get('exclude', '').strip()
    first, last = exclude_name.split(' ') if ' ' in exclude_name else ('', '')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT CONCAT(nameFirst, ' ', nameLast) AS fullName
        FROM people
        WHERE nameFirst IS NOT NULL AND nameLast IS NOT NULL
            AND CONCAT(nameFirst, ' ', nameLast) != %s
        ORDER BY RAND()
        LIMIT 3;
    """
    cursor.execute(query, (exclude_name,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"players": [row["fullName"] for row in rows]})

@trivia_bp.route('/api/trivia/random-teams', methods=['GET'])
def get_random_teams():
    exclude = request.args.get('exclude', '').strip()

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT DISTINCT team_name AS teamName
        FROM teams
        WHERE team_name != %s
        ORDER BY RAND()
        LIMIT 3;
    """
    cursor.execute(query, (exclude,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"teams": [row["teamName"] for row in rows]})

@trivia_bp.route('/api/trivia/save-game', methods=['POST'])
def save_trivia_game():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    number_correct = data.get('number_correct')

    if number_correct is None or not isinstance(number_correct, int):
        return jsonify({"error": "Invalid number_correct"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    # Get user_id based on session email
    cursor.execute("SELECT id FROM users WHERE email = %s", (session['email'],))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "User not found"}), 404

    user_id = user[0]

    # Insert game result
    cursor.execute(
        """
        INSERT INTO trivia_game_results (userId, number_correct)
        VALUES (%s, %s)
        """,
        (user_id, number_correct)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Game saved successfully"}), 200