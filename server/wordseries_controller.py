from flask import Blueprint, jsonify, session, request
from db import get_connection
import random

wordseries_bp = Blueprint('wodseries', __name__)

@wordseries_bp.route('/api/wordseries/get-players', methods=['GET'])
def get_random_player():


@wordseries_bp.route('/api/wordseries/validate-group', methods=['POST'])
def validate_group():


@wordseries_bp.route('/api/wordseries/save-game', methods=['POST'])
def save_wordseries_game():


@wordseries_bp.route('/api/wordseries/stats', methods=['GET'])
def get_user_stats():

