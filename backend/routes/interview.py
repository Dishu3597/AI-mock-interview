from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from models import db, Interview
from services.ai_service import (
    generate_questions,
    evaluate_answers
)

interview = Blueprint("interview", __name__)


# ---------------------------------------
# Create Interview
# ---------------------------------------
@interview.route("/interview", methods=["POST"])
@jwt_required()
def create_interview():

    data = request.get_json()

    role = data.get("role")
    experience = data.get("experience")
    difficulty = data.get("difficulty")
    mode = data.get("mode")

    if not role or not experience or not difficulty or not mode:
        return jsonify({
            "message": "All fields are required"
        }), 400

    user_id = get_jwt_identity()

    new_interview = Interview(
        user_id=user_id,
        role=role,
        experience=experience,
        difficulty=difficulty,
        mode=mode,
        status="In Progress",
        score=0
    )

    db.session.add(new_interview)
    db.session.commit()

    questions = generate_questions(
        role,
        experience,
        difficulty,
        mode
    )

    return jsonify({
        "message": "Interview Created Successfully",
        "interview_id": new_interview.id,
        "questions": questions
    }), 201

# ---------------------------------------
# Evaluate Interview
# ---------------------------------------
@interview.route("/interview/evaluate", methods=["POST"])
@jwt_required()
def evaluate_interview():

    data = request.get_json()

    interview_id = data.get("interview_id")
    role = data.get("role")
    questions = data.get("questions")
    answers = data.get("answers")

    if not interview_id or not questions or not answers:
        return jsonify({
            "message": "Missing data"
        }), 400

    interview = Interview.query.get(interview_id)

    if interview is None:
        return jsonify({
            "message": "Interview not found"
        }), 404

    result = evaluate_answers(
        role,
        questions,
        answers
    )

    interview.score = result["score"]
    interview.status = "Completed"

    db.session.commit()

    return jsonify({
        "message": "Interview evaluated successfully",
        "score": result["score"]
    }), 200
# ---------------------------------------
# Get All Interviews
# ---------------------------------------
@interview.route("/interviews", methods=["GET"])
@jwt_required()
def get_interviews():

    user_id = get_jwt_identity()

    interviews = Interview.query.filter_by(
        user_id=user_id
    ).order_by(
        Interview.created_at.desc()
    ).all()

    data = []

    for interview in interviews:
        data.append({
            "id": interview.id,
            "role": interview.role,
            "experience": interview.experience,
            "difficulty": interview.difficulty,
            "mode": interview.mode,
            "score": interview.score,
            "status": interview.status,
            "created_at": interview.created_at.strftime("%d %b %Y")
        })

    return jsonify(data), 200