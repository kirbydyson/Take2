from flask import Blueprint, jsonify

wordseries_bp = Blueprint('wordseries', __name__)

@wordseries_bp.route('/api/wordseries/get-words', methods=['GET'])
def get_wordseries_groups():
    groups = [
        {
            "category": "Yankees Legends",
            "players": ["Derek Jeter", "Babe Ruth", "Lou Gehrig", "Mickey Mantle"]
        },
        {
            "category": "Modern MVPs",
            "players": ["Aaron Judge", "Shohei Ohtani", "Mike Trout", "Freddie Freeman"]
        },
        {
            "category": "Hall of Famers",
            "players": ["Willie Mays", "Hank Aaron", "Ken Griffey Jr.", "Jackie Robinson"]
        },
        {
            "category": "Pitching Aces",
            "players": ["Clayton Kershaw", "Justin Verlander", "Max Scherzer", "Ronald Acuña Jr."]
        }
    ]
    return jsonify({"groups": groups})
