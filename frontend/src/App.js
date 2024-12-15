import React, { useState } from 'react';
import './App.css';

// Load environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      try {
        setIsLoading(true);
        const response = await fetch(`${BACKEND_URL}/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: input }),
        });

        const data = await response.json();
        
        setMessages([
          ...messages, 
          { text: input, sender: 'user' }, 
          { 
            text: data.data.answer || 'حدث خطأ أثناء المعالجة', 
            sender: 'bot',
            confidence: data.data.confidence
          }
        ]);
        setInput('');
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...messages,
          { text: input, sender: 'user' },
          { text: 'عذراً، حدث خطأ في الاتصال', sender: 'bot' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // إرسال الرسالة عند الضغط على Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-item">
          <span>محادثة جديدة</span>
        </div>
        <div className="sidebar-item">
          <span>السجل</span>
        </div>
        <div className="sidebar-item">
          <span>الإعدادات</span>
        </div>
      </div>
      <div className="main-content">
        <h1>نظام الدردشة الذكي</h1>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="اكتب رسالتك هنا..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>إرسال</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
