import mysql.connector
from csi3335s2025 import mysql

def get_connection():
    return mysql.connector.connect(
        host=mysql['location'],
        user=mysql['user'],
        password=mysql['password'],
        database=mysql['database']
    )
