from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

account_bp = Blueprint('account', __name__)


# POST /api/register
# Registers a new user by collecting first name, last name, email, and password.
# Checks for duplicate email and hashes the password before storing.
# Returns 201 on success or 400 if email already exists or fields are missing.
@account_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    session.clear()
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO users (email, password, role, nameFirst, nameLast) VALUES (%s, %s, %s, %s, %s)", (email, hashed_password, role, firstName, lastName))
    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201


# POST /auth/login
# Authenticates a user using their email and password.
# Verifies the password hash and stores session information.
# Returns user info on success, or 401 for invalid credentials.
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
    session['isBanned'] = user['isBanned']
    return jsonify({"message": "Login successful", "email": user['email'], "role": user['role'], "isBanned": user['isBanned']})


# POST /auth/logout
# Logs out the currently authenticated user by clearing the session.
# Returns a simple success message.
@account_bp.route('/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


# GET /auth/session
# Returns the current user's session information if logged in.
# Includes email, role, and ban status.
# Returns {"loggedIn": False} if no session is active.
@account_bp.route('/auth/session', methods=['GET'])
def get_session():
    if 'email' in session:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT role, isBanned, team FROM users WHERE email = %s", (session['email'],))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['role'] = user['role']
            session['isBanned'] = user['isBanned']

            return jsonify({
                "loggedIn": True,
                "email": session['email'],
                "role": user['role'],
                "isBanned": user['isBanned'],
                "team": user['team']
            })

    return jsonify({"loggedIn": False})

@account_bp.route('/api/users/select-team', methods=['POST'])
def select_team():
    if 'email' not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    selected_team = data.get('team')

    if not selected_team:
        return jsonify({"error": "Team ID is required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT teamID FROM no_hitters WHERE teamID = %s", (selected_team,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({"error": "Invalid team ID"}), 400

    cursor.execute("UPDATE users SET team = %s WHERE email = %s", (selected_team, session['email']))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Team '{selected_team}' selected successfully"})

@account_bp.route('/api/users/team-no-hitters', methods=['GET'])
def get_team_no_hitters():
    if 'email' not in session:
        return jsonify({"error": "User not logged in"}), 401

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT team FROM users WHERE email = %s", (session['email'],))
    user = cursor.fetchone()

    if not user or not user['team']:
        conn.close()
        return jsonify({"error": "No team selected for user"}), 400

    selected_team = user['team']

    cursor.execute(
        "SELECT *, 'by_team' as type FROM no_hitters WHERE teamID = %s",
        (selected_team,)
    )
    thrown = cursor.fetchall()

    cursor.execute("""
        SELECT nh.*, 'against_team' as type
        FROM no_hitters nh
        JOIN teams t ON nh.yearID = t.yearID AND nh.Gtm = t.team_G
        WHERE t.teamID = %s
    """, (selected_team,))

    against = cursor.fetchall()

    conn.close()

    return jsonify({
        "team": selected_team,
        "thrown": thrown,
        "against": against
    })
