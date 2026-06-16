from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from extensions import bcrypt, jwt

from routes.auth import auth
from routes.interview import interview

app = Flask(__name__)

app.config.from_object(Config)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "https://your-app.vercel.app",
            ]
        }
    },
)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(interview, url_prefix="/api")


@app.route("/")
def home():
    return {
        "message": "AI Mock Interview Backend Running 🚀"
    }


import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True,
    )