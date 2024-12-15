# README.md - CS Mentor
### 📚 CS Mentor - AI-Powered Chat System

# 📝 Project Overview
The CS Mentor project is an AI-driven chatbot designed to provide theoretical answers to Computer Science questions. It combines a FastAPI backend for API logic with a modern, clean React.js frontend for user interaction.


# ⚙️ Project Structure
CS Mentor/
│
├── backend/            # FastAPI Backend
│   ├── app.py          # Main application logic
│   ├── model.py        # QA Model integration using Hugging Face
│   ├── context.txt     # Source content for answering questions
│   ├── requirements.txt# Backend dependencies
│   └── tests/          # Unit and integration tests
│
├── frontend/           # React.js Frontend
│   ├── public/         # Static files
│   ├── src/            # React components, styles, and logic
│   ├── package.json    # Frontend dependencies
│   └── README.md       # Frontend-specific documentation
│
└── README.md           # General project overview (this file)

# 🔍 Project Phases
# Phase 1: Project Setup and Basic Structure ✅
* Set up the backend with FastAPI, including:
* /health endpoint for health checks.
* /ask endpoint to process CS-related queries.
* Implement a basic React.js frontend with a clean UI resembling popular chat interfaces.
* Ensure communication between the backend and frontend.

# Phase 2: Core Backend Features 🛠️
* Integrate an NLP model for processing and answering questions (using Hugging Face).
* Enhance the /ask endpoint with:
* Improved question parsing.
* Confidence scoring for responses.
* Add error handling and input validation.

# Phase 3: Enhanced Frontend Features 🎨
* Design a user-friendly interface:
* Add a sidebar for navigation (new session, history, settings).
* Display responses with proper formatting and confidence score.
* Integrate a loader/spinner while waiting for backend responses.
* Improve UI responsiveness for different screen sizes.

# Phase 4: Testing and Optimization 🧪
* Write comprehensive unit tests and integration tests for:
* Backend API endpoints.
* React components and state management.
* Optimize backend for performance (caching, efficient model loading).
* Enhance error logging and monitoring.

# 💻 Setup Instructions
# Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run the server:
```bash
uvicorn app:app --reload
```
4. Test API using:
http://127.0.0.1:8000/health ➡️ Health Check
http://127.0.0.1:8000/docs ➡️ Swagger Documentation

# Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```
4. Access the frontend at:
http://localhost:3000

# ✅ Progress Summary
* Phase 1: Completed 🎉
* Phase 2: Completed 🎉
* Phase 3: Upcoming
* Phase 4: Upcoming
* Phase 5: Upcoming

# 🛠️ Technologies Used
* Backend: FastAPI, Python, Hugging Face Transformers
* Frontend: React.js, CSS
* Tools: Git, GitHub, VS Code, npm, uvicorn
* Deployment: (Planned) Render, Netlify/Vercel

# 📈 Next Steps
1. Implement the NLP model and finalize backend functionality.
2. Enhance the user interface with dynamic features.
3. Deploy the project to production environments.

