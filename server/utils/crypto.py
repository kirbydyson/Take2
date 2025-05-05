from cryptography.fernet import Fernet
import os

FERNET_KEY = os.getenv("FERNET_SECRET_KEY")
fernet = Fernet(FERNET_KEY)

def encrypt_user_id(user_id):
    return fernet.encrypt(str(user_id).encode()).decode()

def decrypt_token(token):
    return fernet.decrypt(token.encode()).decode()
