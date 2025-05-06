from flask import Blueprint, jsonify, session, request
from db import get_connection
import random

scoredle_bp = Blueprint('scoredle', __name__)

"""
@api {GET} /api/scoredle/get-word
@description Returns a random 5-character word selected from first names, last names, and baseball terms.
@access Private (requires user to be logged in)
@returns {JSON} { "randomName": "<selected_word>" }
"""
@scoredle_bp.route('/api/scoredle/get-word', methods=['GET'])
def get_random_5char_name():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query_names = [
        'DistinctFirstNames5CharLimit',
        'DistinctLastNames5CharLimit',
        'DistinctBaseballTerms5CharLimit'
    ]

    word_pool = []

    for query_name in query_names:
        cursor.execute("SELECT query FROM queries WHERE name = %s", (query_name,))
        row = cursor.fetchone()
        if row:
            try:
                cursor.execute(row['query'])
                results = cursor.fetchall()
                for r in results:
                    word_pool.extend(r.values())
            except Exception as e:
                print(f"Error executing query {query_name}: {e}")

    cursor.close()
    conn.close()

    if not word_pool:
        return jsonify({"error": "No words found from queries"}), 404

    selected_name = random.choice(word_pool)
    return jsonify({"randomName": selected_name})

"""
@api {POST} /api/scoredle/save-game
@description Saves the results of a completed Scoredle game to the database.
@access Private (requires user to be logged in)
@param {String} correctWord - The target word for the game
@param {Number} attemptCount - Number of attempts the player used
@param {Boolean} guessedWord - Whether the word was successfully guessed
@returns {JSON} { "message": "Game saved successfully" }
"""
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