from flask import Blueprint, jsonify, session
from db import get_connection

my_games_bp = Blueprint('my_games', __name__)

"""
@api {GET} /api/my-games
@description Retrieves the logged-in user's game history for Trivia, Scoredle, and WordSeries.
@access Private (requires user to be logged in)
@returns {JSON} An object containing three lists:
    - triviaGames: [{ id, number_correct, played_at }]
    - scoredleGames: [{ id, correctWord, attemptCount, guessedWord, timestamp }]
    - wordseriesGames: [{ id, attemptsLeft, gameCompleted, playedAt }]
"""
@my_games_bp.route('/api/my-games', methods=['GET'])
def get_my_games():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email = %s", (session['email'],))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "User not found"}), 404

    userId = user['id']

    cursor.execute("""
        SELECT id, number_correct, played_at
        FROM trivia_game_results
        WHERE userId = %s
        ORDER BY played_at DESC
    """, (userId,))
    trivia_games = cursor.fetchall()

    cursor.execute("""
        SELECT id, correctWord, attemptCount, guessedWord, timestamp
        FROM scoredle_games
        WHERE userId = %s
        ORDER BY timestamp DESC
    """, (userId,))
    scoredle_games = cursor.fetchall()
    
    cursor.execute("""
        SELECT id, attemptsLeft, gameCompleted, playedAt
        FROM wordseries_games
        WHERE userId = %s
        ORDER BY playedAt DESC
    """, (userId,))
    wordseries_games = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "triviaGames": trivia_games,
        "scoredleGames": scoredle_games,
        "wordseriesGames": wordseries_games
    })
