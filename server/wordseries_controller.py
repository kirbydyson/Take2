from flask import Blueprint, jsonify
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
