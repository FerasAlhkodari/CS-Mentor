from fastapi.testclient import TestClient
import pytest
from app import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_ask_question_success():
    """Test successful question answering"""
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
    """Test handling of questions with low confidence"""
    question = {"question": "What is the meaning of life?"}
    response = client.post("/ask", json=question)
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "low_confidence"
    assert "message" in data
    assert data["data"]["answer"] == \
        "The model is not confident enough to provide an accurate answer."

def test_empty_question():
    """Test handling of empty questions"""
    question = {"question": ""}
    response = client.post("/ask", json=question)
    assert response.status_code == 400
    assert "detail" in response.json()

@pytest.mark.parametrize("invalid_input", [
    {"wrong_field": "question"},
    {},
    {"question": None},
])
def test_invalid_input(invalid_input):
    """Test handling of invalid input data"""
    response = client.post("/ask", json=invalid_input)
    assert response.status_code in [400, 500]