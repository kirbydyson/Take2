
from flask import Blueprint, jsonify, session, request
from enum import Enum
import random
from db import get_connection

wordseries_bp = Blueprint('wordseries', __name__)

class WordSeriesCategory(Enum):
    FIRST_BASEMEN = "WordSeriesFirstBasemen"
    SECOND_BASEMEN = "WordSeriesSecondBasemen"
    THIRD_BASEMEN = "WordSeriesThirdBasemen"
    SHORTSTOPS = "WordSeriesShortstops"
    OUTFIELDERS = "WordSeriesOutfielders"
    PITCHERS = "WordSeriesPitchers"
    CATCHERS = "WordSeriesCatchers"
    MVP_WINNERS = "WordSeriesMVPWinners"
    YANKEES_PLAYERS = "WordSeriesYankeesPlayers"
    RED_SOX_PLAYERS = "WordSeriesRedSoxPlayers"
    DODGERS_PLAYERS = "WordSeriesDodgersPlayers"
    GIANTS_PLAYERS = "WordSeriesGiantsPlayers"
    CARDINALS_PLAYERS = "WordSeriesCardinalsPlayers"
    CUBS_PLAYERS = "WordSeriesCubsPlayers"
    ATHLETICS_PLAYERS = "WordSeriesAthleticsPlayers"
    BRAVES_PLAYERS = "WordSeriesBravesPlayers"
    HALL_OF_FAME = "WordSeriesHallOfFamePlayers"
    ALL_STAR_PLAYERS = "WordSeriesAllStarPlayers"


# GET /api/wordseries/get-words
#
# Selects 4 random WordSeries categories from the Enum list.
# Each category maps to a SQL query stored in the 'queries' table.
# Executes each query to fetch a unique list of player names.
# Ensures players are not repeated across categories.
#
# Returns:
# {
#   "groups": [
#     { "category": "First Basemen", "players": ["Player A", "Player B", ...] },
#     ...
#   ]
# }
@wordseries_bp.route('/api/wordseries/get-words', methods=['GET'])
def get_wordseries_groups():
    db = get_connection()
    cursor = db.cursor()

    selected_categories = random.sample(list(WordSeriesCategory), 4)
    groups = []
    seen_players = set()  # To track already returned player names

    for category in selected_categories:
        category_name = category.value
        cursor.execute("SELECT query FROM queries WHERE name = %s", (category_name,))
        result = cursor.fetchone()

        if result:
            dynamic_query = result[0]
            cursor.execute(dynamic_query)
            players = [row[0] for row in cursor.fetchall()]
            unique_players = [p for p in players if p not in seen_players]
            
            # Add to the seen set
            seen_players.update(unique_players)

            if unique_players:
                groups.append({
                    "category": category.name.replace('_', ' ').title(),
                    "players": unique_players
                })

    return jsonify({"groups": groups})


# POST /api/wordseries/save-game
#
# Saves a user's WordSeries game result to the database.
# Requires an authenticated session (session['email'] must exist).
# Retrieves the user's ID from their email.
#
# Request JSON Body:
# {
#   "attemptsLeft": int,      # Remaining attempts (0–3)
#   "gameCompleted": bool     # True if user found all groups
# }
#
# Response: success message or relevant error status.
@wordseries_bp.route('/api/wordseries/save-game', methods=['POST'])
def save_wordseries_game():
    if session.get('email') is None:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    attempts_left = data.get('attemptsLeft')
    game_completed = data.get('gameCompleted')

    if attempts_left is None or game_completed is None:
        return jsonify({"error": "Missing attemptsLeft or gameCompleted"}), 400

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
        "INSERT INTO wordseries_games (userId, attemptsLeft, gameCompleted) VALUES (%s, %s, %s)",
        (userId, attempts_left, game_completed)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "WordSeries game saved successfully"})