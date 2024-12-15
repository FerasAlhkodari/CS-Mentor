from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
from model import QAModel, ModelError
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Union, Literal, Optional
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="CS Mentor API",
    description="""
    An API for answering Computer Science related questions. 
    This API uses a combination of pattern matching and natural language processing 
    to provide accurate answers to computer science questions.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "").split(",")

# Setup CORS with specific origins from .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,  # Load origins from .env file
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


# Initialize QA model
qa_model = QAModel(intents_path="intents.json")

class ErrorResponse(BaseModel):
    """
    Standard error response model
    
    Attributes:
        status: Always "error"
        message: Main error message
        detail: Optional additional error details
    """
    status: Literal["error"]
    message: str
    detail: Optional[str] = None

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors in request data"""
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            status="error",
            message="Invalid request data",
            detail=str(exc.errors())
        ).dict()
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            status="error",
            message=exc.detail,
            detail=None
        ).dict()
    )

@app.exception_handler(ModelError)
async def model_exception_handler(request: Request, exc: ModelError):
    """Handle model-specific errors"""
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            status="error",
            message="Model error",
            detail=str(exc)
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            status="error",
            message="Internal server error",
            detail=str(exc)
        ).dict()
    )


class Question(BaseModel):
    question: str = Field(
        ...,
        description="The computer science related question to be answered",
        min_length=1,
        max_length=500
    )
    
    class Config:
        schema_extra = {
            "example": {
                "question": "What is object-oriented programming?"
            }
        }

class Answer(BaseModel):
    status: Literal["success", "low_confidence"] = Field(
        ...,
        description="Status of the response (success or low_confidence)"
    )
    message: str = Field(
        ...,
        description="A message describing the result"
    )
    data: Dict[str, Union[str, float]] = Field(
        ...,
        description="The answer data including the response text and confidence score"
    )

    class Config:
        schema_extra = {
            "example": {
                "status": "success",
                "message": "Answer found",
                "data": {
                    "answer": "Object-oriented programming is a programming paradigm based on the concept of objects, which can contain data and code.",
                    "confidence": 0.95,
                    "source": "intents"
                }
            }
        }

@app.get("/",
    response_model=Dict[str, Union[str, dict]],
    summary="Root endpoint",
    description="Returns basic information about the API and available endpoints"
)
async def root():
    """
    Get basic information about the API and its endpoints.
    
    Returns:
        dict: API information including version and available endpoints
    """
    return {
        "message": "Welcome to the CS Mentor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /ask": "Ask a Computer Science related question",
            "GET /health": "Check API health status"
        }
    }

@app.post("/ask",
    response_model=Answer,
    summary="Ask a question",
    description="Submit a computer science related question and get an answer",
    response_description="The answer to the question with confidence score"
)
async def ask_question(question: Question):
    """
    Ask a computer science related question.
    
    Args:
        question (Question): The question to be answered
        
    Returns:
        Answer: The answer with confidence score and status
        
    Raises:
        HTTPException: If question is empty or if there's an error processing the question
    """
    try:
        # Check for empty question
        if not question.question.strip():
            raise ValueError("Question cannot be empty")
            
        # Get answer from the model
        result = qa_model.get_answer(question.question)
        
        # Determine response status based on confidence level
        is_confident = result["confidence"] > 0.5
        
        return {
            "status": "success" if is_confident else "low_confidence",
            "message": "Answer found" if is_confident else "No confident answer found",
            "data": result
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except ModelError as me:
        raise HTTPException(status_code=400, detail=str(me))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )

@app.get("/ask")
async def ask_not_allowed():
    """
    Handle GET requests to /ask endpoint.
    
    Raises:
        HTTPException: Always returns 405 Method Not Allowed
    """
    raise HTTPException(
        status_code=405,
        detail="Method Not Allowed. Use POST to /ask with a JSON body containing your question."
    )

@app.get("/health",
    response_model=Dict[str, str],
    summary="Health check",
    description="Check if the API is healthy and ready to handle requests"
)
async def health_check():
    """
    Check the health status of the API.
    
    Returns:
        dict: Health status information
        
    Raises:
        HTTPException: If the service is unhealthy
    """
    try:
        assert qa_model.qa_data is not None
        
        return {
            "status": "healthy"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service Unhealthy: {str(e)}"
        ) 