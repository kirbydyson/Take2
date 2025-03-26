from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import csi3335_config as cfg

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
