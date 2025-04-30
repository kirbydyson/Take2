from flask import Blueprint, jsonify, session, request
from db import get_connection
import random

scoredle_bp = Blueprint('scoredle', __name__)

@scoredle_bp.route('/api/scoredle/random-name', methods=['GET'])
def get_random_5char_lastname():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT nameLast FROM people WHERE CHAR_LENGTH(nameLast) = 5")
    results = cursor.fetchall()
    conn.close()

    names = [row[0] for row in results]
    
    if not names:
        return jsonify({"error": "No 5-character last names found"}), 404

    selected_name = random.choice(names)
    return jsonify({"randomName": selected_name})

@scoredle_bp.route('/api/scoredle/save-game', methods=['POST'])
def save_scoredle_game():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    correctWord = data.get('correctWord')
    attemptCount = data.get('attemptCount')
    guessedWord = data.get('guessedWord')

    if not correctWord or attemptCount is None or guessedWord is None:
        return jsonify({"error": "Missing correctWord or attemptCount or guessedWord"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Get user ID from email
    cursor.execute("SELECT id FROM users WHERE email = %s", (session['email'],))
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    userId = user['id']

    cursor.execute(
        "INSERT INTO scoredle_games (userId, correctWord, attemptCount, guessedWord) VALUES (%s, %s, %s, %s)",
        (userId, correctWord, attemptCount, guessedWord)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Game saved successfully"})