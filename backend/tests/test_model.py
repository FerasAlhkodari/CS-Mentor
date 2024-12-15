import pytest
import sys
import os
from pathlib import Path

# Add root directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from model import QAModel

@pytest.fixture
def qa_model():
    return QAModel()

def test_model_initialization(qa_model):
    assert qa_model.model is not None
    assert qa_model.context is not None

def test_get_answer(qa_model):
    question = "What are algorithms?"
    result = qa_model.get_answer(question)
    
    # Verify result structure
    assert isinstance(result, dict)
    assert all(key in result for key in ["answer", "confidence", "context_used"])
    
    # Verify the answer contains expected keywords
    answer = result["answer"].lower()
    expected_keywords = ["steps", "process", "rules", "problem", "solution"]
    matching_keywords = [keyword for keyword in expected_keywords if keyword in answer]
    assert matching_keywords or result["confidence"] < 0.3, \
        f"Answer '{answer}' should contain at least one of: {expected_keywords} or have low confidence handling."

def test_empty_question(qa_model):
    with pytest.raises(ValueError, match="Question cannot be empty"):
        qa_model.get_answer("")

def test_missing_context_file(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)  # Change to temp directory where context.txt doesn't exist
    with pytest.raises(FileNotFoundError, match="context.txt file is missing"):
        QAModel()

def test_empty_context_file(tmp_path):
    # Create empty context.txt file
    context_path = tmp_path / "context.txt"
    context_path.write_text("")
    
    with pytest.MonkeyPatch().context() as m:
        m.chdir(tmp_path)
        with pytest.raises(ValueError, match="context.txt file is empty"):
            QAModel()

def test_answer_confidence(qa_model):
    question = "What are algorithms?"
    result = qa_model.get_answer(question)
    
    confidence = result["confidence"]
    assert confidence > 0.3 or result["answer"] == "The model is not confident enough to provide an accurate answer.", \
        f"Confidence level {confidence} is too low without proper fallback handling."