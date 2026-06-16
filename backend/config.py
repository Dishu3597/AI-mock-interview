import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")