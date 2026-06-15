from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from extensions import bcrypt, jwt

# Import Blueprints
from routes.auth import auth
from routes.interview import interview

app = Flask(__name__)

# Load Configuration
app.config.from_object(Config)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Create Database
with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(interview, url_prefix="/api")


@app.route("/")
def home():
    return {
        "message": "AI Mock Interview Backend Running 🚀"
    }


if __name__ == "__main__":
    app.run(debug=True)