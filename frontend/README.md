# CS Mentor Project 🚀

## **Overview**
CS Mentor is an AI-powered chatbot system designed to answer theoretical computer science questions. This project is currently in **Phase 1**, focusing on setting up the foundational architecture for both the backend and frontend.

---

## **Current Progress (Phase 1)**

### 1. **Backend Setup**
- **Framework:** FastAPI
- **Features:**
  - Integrated Hugging Face QA model for question answering.
  - Configured API routes:
    - `GET /`: Welcome route.
    - `GET /health`: Health check endpoint.
    - `POST /ask`: Accepts a question and returns an AI-generated response.
  - Comprehensive error handling and fallback responses.
- **Testing:**
  - Successfully implemented 13 unit and integration tests using Pytest.
- **Technologies Used:**
  - FastAPI
  - Hugging Face Transformers
  - Python 3.12
  - Pytest for testing

---

### 2. **Frontend Setup**
- **Framework:** React.js
- **Features:**
  - Clean and modern UI for the chatbot.
  - Basic chat interface for user input and response display.
  - Responsive design, inspired by ChatGPT.
- **Current Structure:**
  - Main Components:
    - `App`: Manages global state and structure.
    - `ChatBox`: Displays messages.
    - `InputBox`: Handles user input.
  - Basic styles applied with CSS.
- **Technologies Used:**
  - React.js
  - CSS for styling

---

## **Next Steps (Future Phases)**

### **Phase 2: API Integration**
- Connect the frontend with the backend API.
- Implement message flow for the chat interface:
  - Send user queries to the API.
  - Display responses dynamically.

### **Phase 3: UI/UX Enhancements**
- Improve the chat interface:
  - Add features like chat history, loading indicators, and enhanced styling.
- Implement user authentication for personalized experiences.

### **Phase 4: Persistent Storage**
- Integrate a database for storing user queries and responses.

---

## **Setup Instructions**

### **Backend**
1. Navigate to the backend folder:
   ```bash
   cd backend

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

4. Access the API at `http://localhost:8000`.

Frontend
Navigate to the frontend folder and run the following commands:

1. cd frontend
2. npm install
3. npm start
4. Access the frontend at `http://localhost:3000`.

Contributors
Feras Alkhodari