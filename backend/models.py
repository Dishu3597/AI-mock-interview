from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    interviews = db.relationship(
        "Interview",
        backref="user",
        lazy=True
    )


class Interview(db.Model):
    __tablename__ = "interviews"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    role = db.Column(
        db.String(100),
        nullable=False
    )

    experience = db.Column(
        db.String(50),
        nullable=False
    )

    difficulty = db.Column(
        db.String(30),
        nullable=False
    )

    mode = db.Column(
        db.String(30),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="In Progress"
    )

    score = db.Column(
        db.Integer,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    responses = db.relationship(
        "Response",
        backref="interview",
        lazy=True,
        cascade="all, delete"
    )

    feedback = db.relationship(
        "Feedback",
        backref="interview",
        uselist=False,
        cascade="all, delete"
    )


class Response(db.Model):
    __tablename__ = "responses"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    interview_id = db.Column(
        db.Integer,
        db.ForeignKey("interviews.id"),
        nullable=False
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    answer = db.Column(
        db.Text,
        nullable=False
    )


class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    interview_id = db.Column(
        db.Integer,
        db.ForeignKey("interviews.id"),
        nullable=False
    )

    score = db.Column(
        db.Integer
    )

    strengths = db.Column(
        db.Text
    )

    weaknesses = db.Column(
        db.Text
    )

    suggestions = db.Column(
        db.Text
    )