from fastapi.testclient import TestClient
import sys
import os
from pathlib import Path

# Add root directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app import app
import pytest

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_ask_question_success():
    question = {"question": "What are algorithms?"}
    response = client.post("/ask", json=question)
    assert response.status_code == 200

    data = response.json()
    assert data["status"] in ["success", "low_confidence"], \
        f"Unexpected status: {data['status']}"
    
    if data["status"] == "success":
        assert "answer" in data["data"] and data["data"]["answer"], \
            "Response should include a valid answer."
    elif data["status"] == "low_confidence":
        assert data["data"]["answer"] == \
            "The model is not confident enough to provide an accurate answer."

def test_low_confidence_response():
    question = {"question": "What is the meaning of life?"}
    response = client.post("/ask", json=question)
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "low_confidence"
    assert "message" in data
    assert data["data"]["answer"] == \
        "The model is not confident enough to provide an accurate answer."

def test_empty_question():
    question = {"question": ""}
    response = client.post("/ask", json=question)
    assert response.status_code == 500
    assert "detail" in response.json()

@pytest.mark.parametrize("invalid_input", [
    {"wrong_field": "question"},
    {},
    {"question": None},
])
def test_invalid_input(invalid_input):
    response = client.post("/ask", json=invalid_input)
    assert response.status_code in [422, 500]