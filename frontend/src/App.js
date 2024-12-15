import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

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
