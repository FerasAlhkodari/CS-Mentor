# CS Mentor Backend - Progress Report 🚀

## **Current Phase: Backend Development for the Intelligent Chat System**
### **Overview:**
This phase involves building a robust **FastAPI**-based backend that processes Computer Science-related questions and returns accurate answers. The system integrates an **AI-powered model** utilizing **Pattern Matching** and text similarity techniques.

---

## **What Has Been Completed:**

### 1. **API Endpoints Development:**
- **GET /health**: Health check endpoint to verify API status.
- **POST /ask**: Endpoint to process user questions and provide relevant answers.

### 2. **AI Model (QAModel):**
- Developed a flexible model that reads intents and responses from **intents.json**.
- Implements **text cleaning** and **similarity scoring** (Jaccard + Sequence Similarity) to match questions with predefined patterns.
- Returns responses with confidence scores based on similarity thresholds.

### 3. **Error Handling and Request Validation:**
- **400 Bad Request**: For invalid or empty inputs.
- **422 Unprocessable Entity**: For validation errors in the payload.
- **500 Internal Server Error**: For unexpected server errors.
- Implemented custom exception handlers for cleaner error responses.

### 4. **CORS Configuration:**
- Enabled **Cross-Origin Resource Sharing (CORS)** to allow communication between the **React Frontend** and the **FastAPI Backend**.
- Configured trusted origins for **localhost** (development) and production domains.

### 5. **Comprehensive Testing:**
- Wrote unit tests using **pytest** to verify:
  - Endpoint responses.
  - Handling of empty, invalid, and valid questions.
  - Model behavior with missing or malformed **intents.json** files.
- Ensured all tests pass successfully.

### 6. **Security Enhancements:**
- Implemented a **.env** file to hide sensitive configurations, such as file paths and future API keys.
- Updated **.gitignore** to exclude the `.env` file and other temporary files.

---

## **Current Results:**
✅ **The API is fully operational** and handles user questions seamlessly.  
✅ The **QAModel** retrieves answers with confidence scoring and appropriate fallback responses.  
✅ The backend successfully connects to the **React Frontend** for testing.  
✅ All unit tests using **pytest** have passed successfully.

---

## **Next Steps:**
1. Enhance the **React Frontend** with improved UI/UX.
2. Expand the model's accuracy by adding more patterns and training data.
3. Deploy the system on cloud platforms like **Heroku** or **Vercel**.
4. Add detailed documentation on backend-frontend integration and deployment.

---

## **How to Run the Project:**

### **Backend Setup (FastAPI):**
1. Install dependencies:   ```bash
   cd backend
   pip install -r requirements.txt   ```

2. Create `.env` file:   ```env
   INTENTS_FILE_PATH=intents.json
   CORS_ORIGINS=http://localhost:3000,http://localhost:8000
   SECRET_KEY=your-super-secure-key   ```

3. Run the server:   ```bash
   uvicorn app:app --reload   ```

4. Run tests:   ```bash
   pytest tests/   ```

### **Frontend Setup (React):**
1. Install dependencies:   ```bash
   cd frontend
   npm install   ```

2. Create `.env` file:   ```env
   REACT_APP_BACKEND_URL=http://127.0.0.1:8000
   REACT_APP_API_KEY=your-secure-api-key   ```

3. Start the development server:   ```bash
   npm start   ```

---

## **API Documentation:**
- Access the interactive API documentation at: `http://localhost:8000/docs`
- Alternative documentation format at: `http://localhost:8000/redoc`

---

**Note:** Replace placeholders in `.env` with your actual keys and values in a secure manner.
