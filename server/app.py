# app.py
from flask import Flask
from flask_cors import CORS
from account_controller import account_bp
from scordle_controller import scoredle_bp
from trivia_controller import trivia_bp
from wordseries_controller import wordseries_bp
from my_games_controller import my_games_bp
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
app.secret_key = os.environ.get('FLASK_SECRET_KEY')
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.config.update({
    'SESSION_COOKIE_SAMESITE': 'Lax',
    'SESSION_COOKIE_SECURE': False
})

# Register blueprint
app.register_blueprint(account_bp)
app.register_blueprint(scoredle_bp)
app.register_blueprint(trivia_bp)
app.register_blueprint(wordseries_bp)
app.register_blueprint(my_games_bp)

@app.route('/health-check', methods=['GET'])
def test():
    return {'message': 'I am healthy!'}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
