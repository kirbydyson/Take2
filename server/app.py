# app.py
from flask import Flask
from flask_cors import CORS
from account_controller import account_bp
from scordle_controller import scoredle_bp
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
app.secret_key = os.environ.get('FLASK_SECRET_KEY')
CORS(app)

# Register blueprint
app.register_blueprint(account_bp)
app.register_blueprint(scoredle_bp)

@app.route('/health-check', methods=['GET'])
def test():
    return {'message': 'I am healthy!'}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
