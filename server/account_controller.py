# account_controller.py
from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

account_bp = Blueprint('account', __name__)

@account_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user') 

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", (email, hashed_password, role))
    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201

@account_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    session['email'] = user['email']
    session['role'] = user['role']
    return jsonify({"message": "Login successful", "email": user['email']})

@account_bp.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('email', None)
    return jsonify({"message": "Logged out successfully"})

@account_bp.route('/auth/session', methods=['GET'])
def get_session():
    if 'email' in session:
        return jsonify({"loggedIn": True, "email": session['email'], "role": session['role']})
    return jsonify({"loggedIn": False})
