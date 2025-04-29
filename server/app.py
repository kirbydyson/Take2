from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET'])
def test():
    return {'message': 'API is working!'}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
 