import sys
import os
from pathlib import Path
import warnings
import pytest
import json
import tempfile

# Add root directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Ignore specific warnings during tests
@pytest.fixture(autouse=True)
def ignore_warnings():
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=FutureWarning)
        warnings.filterwarnings("ignore", category=UserWarning)
        warnings.filterwarnings("ignore", category=DeprecationWarning)
        yield

@pytest.fixture
def test_intents():
    """
    Create a temporary intents.json file for testing.
    
    Returns:
        str: Path to the temporary intents.json file
    """
    test_data = {
        "intents": [
            {
                "tag": "test_intent",
                "patterns": [
                    "What is mobile development?",
                    "Tell me about mobile development"
                ],
                "responses": [
                    "Mobile development focuses on creating applications for mobile devices."
                ]
            }
        ]
    }
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(test_data, f)
        temp_path = f.name
    
    yield temp_path
    
    if os.path.exists(temp_path):
        os.remove(temp_path)