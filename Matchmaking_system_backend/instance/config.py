import os

SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///data/mydatabase.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False