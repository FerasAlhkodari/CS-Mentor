from transformers import pipeline, AutoModelForQuestionAnswering, AutoTokenizer
import torch
import os
from typing import Dict, Union
import warnings

# Ignore unnecessary warnings
warnings.filterwarnings('ignore', category=FutureWarning)

class QAModel:
    def __init__(self, model_name: str = "distilbert-base-cased-distilled-squad"):
        try:
            # Use CUDA if available
            device = 0 if torch.cuda.is_available() else -1
            
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self.model = pipeline(
                    "question-answering",
                    model=model_name,
                    framework="pt",  # Use PyTorch
                    device=device
                )
            self.context = self._load_context()
        except (FileNotFoundError, ValueError) as e:
            raise e
        except Exception as e:
            raise Exception(f"Failed to initialize model: {str(e)}")
    
    def _load_context(self) -> str:
        try:
            if not os.path.exists("context.txt"):
                raise FileNotFoundError("context.txt file is missing")
            
            with open("context.txt", "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    raise ValueError("context.txt file is empty")
                return content
        except (FileNotFoundError, ValueError) as e:
            raise e
        except Exception as e:
            raise Exception(f"Error reading context file: {str(e)}")
    
    def get_answer(self, question: str) -> Dict[str, Union[str, float]]:
        if not question.strip():
            raise ValueError("Question cannot be empty")
            
        if not self.context:
            raise Exception("Context is not properly loaded")
            
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                result = self.model(question=question, context=self.context)
            
            # Add logic to improve low confidence handling
            if result["score"] < 0.3:
                return {
                    "answer": "The model is not confident enough to provide an accurate answer.",
                    "confidence": float(result["score"]),
                    "context_used": self.context
                }
            
            return {
                "answer": result["answer"],
                "confidence": float(result["score"]),
                "context_used": self.context  # Include full context for better testing
            }
        except Exception as e:
            raise Exception(f"Error processing question: {str(e)}") 