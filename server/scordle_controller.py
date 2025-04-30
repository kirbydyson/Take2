from flask import Blueprint, jsonify, session
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
