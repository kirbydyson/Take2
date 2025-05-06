from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet
from utils.crypto import encrypt_user_id, decrypt_token
from db import get_connection
import os

FERNET_KEY = os.getenv('FERNET_SECRET_KEY')
fernet = Fernet(FERNET_KEY)

"""
@api {GET} /api/users
@description Retrieves a list of all users. Only accessible by admin users.
@access Admin
@returns {JSON[]} Array of user objects including id, name, email, role, and ban status
"""
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        user_role = session.get('role')
        if not user_role:
            return jsonify({"error": "Unauthorized: Not logged in"}), 401
        if user_role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT id, nameFirst, nameLast, email, role, isBanned FROM users")
        rows = cursor.fetchall()
        cursor.close()
        connection.close()

        users = [
            {
                "id": row[0],
                "firstName": row[1],
                "lastName": row[2],
                "email": row[3],
                "role": row[4],
                "isBanned": row[5]
            }
            for row in rows
        ]

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

"""
@api {POST} /api/users/ban
@description Bans a user by setting isBanned to TRUE in the database.
@access Admin
@param {String} email - The email address of the user to ban
@returns {JSON} Confirmation message or error
"""
@admin_bp.route('/api/users/ban', methods=['POST'])
def ban_user():
    try:
        user_role = session.get('role')
        if not user_role:
            return jsonify({"error": "Unauthorized: Not logged in"}), 401
        if user_role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        data = request.get_json()
        email_to_ban = data.get('email')
        if not email_to_ban:
            return jsonify({"error": "Missing email in request"}), 400

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET isBanned = TRUE WHERE email = %s", (email_to_ban,))
        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"error": "User not found"}), 404

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": f"User '{email_to_ban}' has been banned."}), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

"""
@api {POST} /api/users/unban
@description Unbans a user by setting isBanned to FALSE in the database.
@access Admin
@param {String} email - The email address of the user to unban
@returns {JSON} Confirmation message or error
"""
@admin_bp.route('/api/users/unban', methods=['POST'])
def unban_user():
    try:
        user_role = session.get('role')
        if not user_role:
            return jsonify({"error": "Unauthorized: Not logged in"}), 401
        if user_role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        data = request.get_json()
        email_to_unban = data.get('email')
        if not email_to_unban:
            return jsonify({"error": "Missing email in request"}), 400

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET isBanned = FALSE WHERE email = %s", (email_to_unban,))
        if cursor.rowcount == 0:
            connection.close()
            return jsonify({"error": "User not found"}), 404

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": f"User '{email_to_unban}' has been unbanned."}), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

"""
@api {POST} /api/admin/verify
@description Verifies the admin user by checking a shared secret answer.
@access Admin (implicit)
@param {String} answer - The secret answer to verify admin status
@returns {JSON} Success or error message
"""
@admin_bp.route('/api/admin/verify', methods=['POST'])
def verify_admin_answer():
    try:
        data = request.get_json()
        answer = data.get('answer', '').strip()

        correct_answer = os.getenv('ADMIN_SECRET_ANSWER')

        if not correct_answer:
            return jsonify({"error": "Server misconfiguration: No secret answer set"}), 500

        if answer == correct_answer:
            session['admin_verified'] = True
            return jsonify({"message": "Verification successful"}), 200
        else:
            return jsonify({"error": "Incorrect answer"}), 401

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

"""
@api {GET} /api/admin/verify-status
@description Returns whether the current session is admin-verified.
@access Admin
@returns {JSON} { verified: Boolean }
"""
@admin_bp.route('/api/admin/verify-status', methods=['GET'])
def check_admin_verified():
    if session.get('admin_verified'):
        return jsonify({"verified": True}), 200
    else:
        return jsonify({"verified": False}), 403

"""
@api {GET} /api/users/:user_id/token
@description Generates and returns a secure token for the given user ID.
@access Admin
@param {Int} user_id - The user ID to generate the token for
@returns {JSON} { token: String }
"""
@admin_bp.route('/api/users/<int:user_id>/token', methods=['GET'])
def get_user_token(user_id):
    try:
        user_role = session.get('role')
        if not user_role:
            return jsonify({"error": "Unauthorized: Not logged in"}), 401
        if user_role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        token = encrypt_user_id(user_id)
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


"""
@api {GET} /api/admin/user/:token
@description Decrypts a token to retrieve user information by ID.
@access Admin
@param {String} token - Encrypted user ID token
@returns {JSON} User data or error message
"""
@admin_bp.route('/api/admin/user/<token>', methods=['GET'])
def get_user_from_token(token):
    try:
        user_role = session.get('role')
        if not user_role:
            return jsonify({"error": "Unauthorized: Not logged in"}), 401
        if user_role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        user_id = decrypt_token(token)

        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT nameFirst, nameLast, email, role, isBanned FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        cursor.close()
        connection.close()

        if not row:
            return jsonify({"error": "User not found"}), 404

        user = {
            "firstName": row[0],
            "lastName": row[1],
            "email": row[2],
            "role": row[3],
            "isBanned": row[4]
        }
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": f"Invalid token or server error: {str(e)}"}), 403

"""
@api {GET} /api/admin/my-games
@description Retrieves all game history for a user identified by email.
@access Admin
@param {String} email - The email of the user whose games should be retrieved
@returns {JSON} Object containing arrays of triviaGames, scoredleGames, and wordseriesGames
"""
@admin_bp.route('/api/admin/my-games', methods=['GET'])
def get_user_games_by_email():
    user_role = session.get('role')
    if not user_role:
        return jsonify({"error": "Unauthorized: Not logged in"}), 401
    if user_role != 'admin':
        return jsonify({"error": "Forbidden: Admin access required"}), 403

    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Missing email parameter"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
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
