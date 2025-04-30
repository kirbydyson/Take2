import mysql.connector
from csi3335s2025 import mysql as mysql_config  # Rename the dict to avoid conflict

def get_connection():
    return mysql.connector.connect(
        host=mysql_config['location'],
        user=mysql_config['user'],
        password=mysql_config['password'],
        database=mysql_config['database']
    )
