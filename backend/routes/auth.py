from flask import Blueprint, request, jsonify
from models import db, User
from extensions import bcrypt
from flask_jwt_extended import create_access_token

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return jsonify({
            "message": "Email already registered"
        }), 409

    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User Registered Successfully"
    }), 201



@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({
            "message": "Email and Password are required"
        }), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({
            "message": "User Not Found"
        }), 404

    if not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({
            "message": "Invalid Credentials"
        }), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login Successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200