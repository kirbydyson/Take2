# account_controller.py
from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection
import os

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
        cursor.execute("SELECT nameFirst, nameLast, email, role, isBanned FROM users")
        rows = cursor.fetchall()
        cursor.close()
        connection.close()

        users = [
            {
                "firstName": row[0],
                "lastName": row[1],
                "email": row[2],
                "role": row[3],
                "isBanned": row[4]
            }
            for row in rows
        ]

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

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

@admin_bp.route('/api/admin/verify', methods=['POST'])
def verify_admin_answer():
    try:
        data = request.get_json()
        answer = data.get('answer', '').strip()

        # Get the correct answer from env variable
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
    
@admin_bp.route('/api/admin/verify-status', methods=['GET'])
def check_admin_verified():
    if session.get('admin_verified'):
        return jsonify({"verified": True}), 200
    else:
        return jsonify({"verified": False}), 403
