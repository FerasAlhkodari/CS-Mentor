import json
from typing import Dict, Union, Optional
import re
from difflib import SequenceMatcher
from functools import lru_cache
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()
intents_path = os.getenv("INTENTS_FILE_PATH", "intents.json")

class ModelError(Exception):
    """Base exception for model-related errors"""
    pass

class FileNotFoundError(ModelError):
    """Raised when required file is not found"""
    pass

class InvalidDataError(ModelError):
    """Raised when data format is invalid"""
    pass

class EmptyQuestionError(ModelError):
    """Raised when question is empty"""
    pass

class QAModel:
    def __init__(self, intents_path: str = intents_path):
        """
        Initialize the QA model.
        
        Args:
            intents_path: Path to the intents.json file
        
        Raises:
            FileNotFoundError: If intents.json file is missing
            InvalidDataError: If intents.json is empty or invalid
            ModelError: If there's an error initializing the model
        """
        # Check if file exists
        if not Path(intents_path).is_file():
            raise FileNotFoundError(f"intents.json file is missing in path: {Path(intents_path).absolute()}")

        try:
            # Load data from file
            data = self._load_intents(intents_path)
            if not data:
                raise InvalidDataError("intents.json file is empty or invalid")
        
            # Check for required 'intents' key
            if "intents" not in data:
                raise InvalidDataError("Invalid intents.json format: Missing 'intents' key")
        
            # Set model data
            self.qa_data = data["intents"]
            if not self.qa_data:
                raise InvalidDataError("intents.json contains no intents data")
        
            # Initialize common question starters
            self.common_question_starters = {
                "what", "how", "explain", "define", "describe", "tell me about",
                "can you explain", "what is", "what are", "could you tell me"
            }
        except json.JSONDecodeError:
            raise InvalidDataError("Error parsing intents.json: Invalid JSON format")
        except FileNotFoundError as e:
            raise e
        except InvalidDataError as e:
            raise e
        except Exception as e:
            raise ModelError(f"Failed to initialize model: {str(e)}")

    @staticmethod
    @lru_cache(maxsize=1)
    def _load_intents(file_path: str) -> dict:
        """
        Load and cache intents from JSON file.
        Args:
            file_path: Path to the intents.json file
        Returns:
            Dict containing the loaded intents data
        Raises:
            FileNotFoundError: If file doesn't exist
            InvalidDataError: If file is empty or invalid
            json.JSONDecodeError: If file contains invalid JSON
        """
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
                
                # Validate data structure and content
                if not data or "intents" not in data or not isinstance(data["intents"], list) or not data["intents"]:
                    raise InvalidDataError("intents.json file is empty or invalid")
                
                return data
                
        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")
        except json.JSONDecodeError as e:
            raise InvalidDataError(f"Invalid JSON in file: {file_path} - {str(e)}")
        except Exception as e:
            raise Exception(f"Error loading intents.json: {str(e)}")

    def _clean_text(self, text: str) -> str:
        """
        Clean text by removing punctuation and common question starters.
        Args:
            text: Input text to clean
        Returns:
            Cleaned text string
        """
        # Remove common question starters
        for starter in self.common_question_starters:
            if text.startswith(starter):
                text = text[len(starter):].strip()
        return text

    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity score between two texts.
        Args:
            text1: First text to compare
            text2: Second text to compare
        Returns:
            Similarity score between 0 and 1
        """
        # Calculate word-based similarity
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        # Calculate word intersection
        word_intersection = len(words1.intersection(words2))
        word_union = len(words1.union(words2))
        
        if word_union == 0:
            return 0.0
            
        # Calculate Jaccard similarity
        jaccard = word_intersection / word_union
        
        # Calculate sequence similarity
        sequence_similarity = SequenceMatcher(None, text1, text2).ratio()
        
        # Combine similarities with weights
        return (0.7 * jaccard) + (0.3 * sequence_similarity)

    def _find_intent_answer(self, question: str) -> Optional[Dict[str, Union[str, float]]]:
        """
        Find best matching answer from intents using flexible matching.
        Args:
            question: Input question to find answer for
        Returns:
            Dict containing answer, confidence and source if found, None otherwise
        """
        cleaned_question = self._clean_text(question)
        best_match = None
        highest_similarity = 0.4  # Minimum similarity threshold

        for intent in self.qa_data:
            for pattern in intent["patterns"]:
                cleaned_pattern = self._clean_text(pattern)
                similarity = self._calculate_similarity(cleaned_question, cleaned_pattern)

                if similarity > highest_similarity:
                    highest_similarity = similarity
                    best_match = {
                        "answer": intent["responses"][0],
                        "confidence": similarity,
                        "source": "intents",
                        "matched_pattern": pattern
                    }

        return best_match

    def get_answer(self, question: str) -> Dict[str, Union[str, float]]:
        """
        Get the answer to a question.
        Args:
            question: The question to answer
        Returns:
            Dict containing answer, confidence score and source
        Raises:
            ValueError: If the question is empty
        """
        # Check for empty question
        if not question.strip():
            raise ValueError("Question cannot be empty")

        # Search in intents.json
        intent_answer = self._find_intent_answer(question)
        if intent_answer and intent_answer["confidence"] > 0.5:
            return intent_answer

        # Return low confidence response
        return {
            "answer": "The model is not confident enough to provide an accurate answer.",
            "confidence": 0.0,
            "source": "model"
        }
