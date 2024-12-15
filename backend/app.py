from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import QAModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CS Mentor API",
    description="API for answering Computer Science related questions",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize QA model
qa_model = QAModel()

class Question(BaseModel):
    question: str
    
    class Config:
        schema_extra = {
            "example": {
                "question": "What are algorithms?"
            }
        }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the CS Mentor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /ask": "Ask a Computer Science related question",
            "GET /health": "Check API health status"
        }
    }

# Ask endpoint - POST only
@app.post("/ask")
async def ask_question(question: Question):
    try:
        result = qa_model.get_answer(question.question)
        
        # Check confidence level
        if result["confidence"] < 0.3:
            return {
                "status": "low_confidence",
                "message": "Sorry, I'm not confident about this answer. Please rephrase your question.",
                "data": result
            }
            
        return {
            "status": "success",
            "message": "Answer found",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Prevent GET method on /ask
@app.get("/ask")
async def ask_not_allowed():
    raise HTTPException(
        status_code=405,
        detail="Method Not Allowed. Use POST to /ask with a JSON body containing your question."
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Verify model is loaded
        assert qa_model.model is not None
        assert qa_model.context is not None
        
        return {
            "status": "healthy",
            "model": "loaded",
            "context": "available"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service Unhealthy: {str(e)}"
        ) 