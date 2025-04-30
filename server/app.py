# app.py
from flask import Flask
from flask_cors import CORS
from account_controller import account_bp
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
app.secret_key = os.environ.get('FLASK_SECRET_KEY')
CORS(app)

# Register blueprint
app.register_blueprint(account_bp)

@app.route('/test', methods=['GET'])
def test():
    return {'message': 'API is working!'}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
