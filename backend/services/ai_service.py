import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

URL = "https://integrate.api.nvidia.com/v1/chat/completions"

MODEL = "mistralai/mistral-medium-3.5-128b"


# ----------------------------------------------------
# Generate Interview Questions
# ----------------------------------------------------
def generate_questions(role, experience, difficulty, mode):

    prompt = f"""
Generate 10 interview questions.

Role:
{role}

Experience:
{experience}

Difficulty:
{difficulty}

Interview Type:
{mode}

Return only the questions.
"""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 1024
    }

    response = requests.post(
        URL,
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        print(response.text)
        return []

    data = response.json()

    questions = data["choices"][0]["message"]["content"]

    questions_list = []

    for line in questions.split("\n"):

        line = line.strip()

        if line:

            if ". " in line:
                line = line.split(". ", 1)[1]

            questions_list.append(line)

    return questions_list


# ----------------------------------------------------
# Evaluate Interview Answers
# ----------------------------------------------------
def evaluate_answers(role, questions, answers):

    qa_text = ""

    for i in range(len(questions)):
        qa_text += f"""

Question {i+1}:
{questions[i]}

Answer:
{answers[i]}

"""

    prompt = f"""
You are an expert technical interviewer.

Evaluate the following interview.

Role:
{role}

{qa_text}

Give ONLY ONE overall interview score from 0 to 100.

Return ONLY valid JSON in this exact format:

{{
    "score": 85
}}

Do not return markdown.
Do not return explanations.
Only return the JSON object.
"""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 512
    }

    response = requests.post(
        URL,
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        print(response.text)
        return {"score": 0}

    data = response.json()

    result = data["choices"][0]["message"]["content"]

    print("AI Response:")
    print(result)

    try:
        return json.loads(result)

    except Exception:

        # Remove markdown if AI returns ```json ... ```
        result = result.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(result)
        except Exception:
            print("JSON Parse Error")
            return {"score": 0}