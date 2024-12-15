# 📚 CS Mentor - AI-Powered Chat System

## 📝 Overview
CS Mentor is an AI-powered chatbot designed to provide theoretical answers to Computer Science questions. The project integrates a **FastAPI backend** for API logic with a **React.js frontend** for a modern and user-friendly interface.

**Final Version:** 🎯  
The latest working version of the project is located in the branch **`Frontend-UI-Implementation`**.

---

## ⚙️ Project Structure 🗂️

cs-mentor/
├── backend/
│   ├── app.py              # Main FastAPI application
│   ├── model.py            # AI model implementation
│   ├── intents.json        # Training data and responses
│   ├── requirements.txt    # Python dependencies
│   └── tests/
│       ├── test_app.py     # API endpoint tests
│       ├── test_model.py   # Model unit tests
│       └── conftest.py     # Test configurations
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main React application
│   │   └── App.css        # Main styles
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind configuration

---

## 🔍 Features

### Backend (FastAPI) 🚀
- **API Endpoints:**
  - `/health`: Health check endpoint 🏥
  - `/ask`: Main endpoint for processing questions 💭

- **AI Model Features:** 🧠
  - Pattern matching algorithms
  - Text similarity scoring
  - Response confidence calculation
  - Fallback response handling

### Frontend (React.js) 💫
- Interactive UI with chat-like interface 💬
- Sidebar navigation for new sessions, history, and settings ⚡
- Responsive design using Tailwind CSS 🎨
- Full integration with backend API 🔄

---

## 💻 Setup Instructions

### Backend Setup 🛠️

# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Required environment variables:
INTENTS_FILE_PATH=intents.json
CORS_ORIGINS=http://localhost:3000
DEBUG=True

# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/

# Start the server
uvicorn app:app --reload

### Frontend Setup 🎨

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Required variables:
REACT_APP_BACKEND_URL=http://localhost:8000

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

### Access Points 🌐
- Frontend Application: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

---

## 🧪 Testing Guide

### Backend Testing ⚡
- **Test Structure:** 📁
  tests/
  ├── conftest.py          # Shared fixtures
  ├── test_app.py          # API tests
  └── test_model.py        # Model tests

- **Running Tests:** 🔄
  # Run all tests
  pytest tests/

  # Run with coverage
  pytest --cov=app tests/

  # Run specific test file
  pytest tests/test_model.py

  # Generate coverage report
  pytest --cov=app --cov-report=html tests/

### Frontend Testing 🔍
- Component tests using React Testing Library ⚛️
- Integration tests for API communication 🔌
- UI interaction tests 🖱️
- Responsive design tests 📱

---

## 🛠️ Technologies Used

### Backend: 🔧
  - FastAPI ⚡
  - Python 🐍
  - Hugging Face Transformers 🤖
  - pytest ✅

### Frontend: 🎨
  - React.js ⚛️
  - Tailwind CSS 🎯
  - Axios 🔄

### Development Tools: 🔧
  - Git & GitHub 📚
  - VS Code 💻
  - npm 📦
  - uvicorn 🚀

---

## ✅ Progress Summary
- Phase 1: Completed - Initial setup and structure 🎯
- Phase 2: Completed - Backend development and AI model integration 🤖
- Phase 3: Completed - Frontend implementation and API integration 🔄
- Phase 4: Testing and optimization 🧪
- Phase 5: Deployment (Optional but planned) 🚀

---

## 📝 Notes
1. The final working version resides in the branch `Frontend-UI-Implementation` 🎯
2. Ensure all environment variables are properly configured before running ⚙️
3. Regular updates to `intents.json` will improve response accuracy 📈
4. Run tests before committing changes ✅

---

## 📚 Documentation
- Full API documentation available at `/docs` endpoint 📖
- Component documentation in respective frontend directories 📂
- Setup guides in backend and frontend README files 📋

---

**Note:** Replace all placeholder values in configuration files with actual production values before deployment. ⚠️
