import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import InputBox from "./components/InputBox";
import Sidebar from "./components/Sidebar";
import SystemMessage from "./components/SystemMessage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [systemMessage, setSystemMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // تحميل الجلسات عند بدء التطبيق
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    setSessions(savedSessions);
    
    const activeSessionId = localStorage.getItem('activeSessionId');
    if (activeSessionId) {
      const active = savedSessions.find(s => s.id === activeSessionId);
      if (active) {
        setActiveSession(active);
        setMessages(active.messages || []);
      }
    }
  }, []);

  // حفظ الرسائل في الجلسة النشطة
  useEffect(() => {
    if (activeSession) {
      const updatedSessions = sessions.map(session => 
        session.id === activeSession.id
          ? { ...session, messages }
          : session
      );
      setSessions(updatedSessions);
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    }
  }, [messages]);

  // إخفاء رسائل النظام بعد 3 ثوانٍ
  useEffect(() => {
    if (systemMessage) {
      const timer = setTimeout(() => {
        setSystemMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [systemMessage]);

  const handleSendMessage = async (input) => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // إضافة رسالة المستخدم
      const userMessage = {
        id: Date.now(),
        role: 'user',
        text: input,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // إضافة رسالة "جاري التفكير..."
      const thinkingMessage = {
        id: 'typing',
        role: 'bot',
        text: 'AI is thinking...',
        isTyping: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // إرسال الطلب إلى الخادم
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question: input
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // التحقق من نوع الاستجابة وثقة الموديل
      if (data.status === "low_confidence") {
        throw new Error("I'm not confident about this answer. Could you rephrase your question?");
      }

      // تأخير قصير قبل عرض الإجابة
      await new Promise(resolve => setTimeout(resolve, 500));

      // استبدال رسالة "thinking" بالرد
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [
          ...messagesWithoutTyping,
          {
            id: Date.now(),
            role: 'bot',
            text: data.data.answer,
            confidence: data.data.confidence,
            source: data.data.source,
            timestamp: new Date().toISOString()
          }
        ];
      });

      // إذا كانت الثقة منخفضة، عرض تنبيه للمستخدم
      if (data.data.confidence < 0.7) {
        setSystemMessage({
          text: "I'm not entirely sure about this answer. Please verify it.",
          type: "warning"
        });
      }

    } catch (error) {
      console.error('Error:', error);

      // استبدال رسالة "thinking" برسالة خطأ
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [
          ...messagesWithoutTyping,
          {
            id: Date.now(),
            role: 'bot',
            text: error.message || "Sorry, I couldn't process your request. Please try again.",
            isError: true,
            timestamp: new Date().toISOString()
          }
        ];
      });

      // عرض رسالة خطأ للمستخدم
      setSystemMessage({
        text: error.message || "Connection error. Please check your internet connection.",
        type: "error"
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionChange = (session) => {
    setActiveSession(session);
    setMessages(session.messages || []);
    localStorage.setItem('activeSessionId', session.id);
  };

  const handleNewSession = (session) => {
    setSessions(prev => [session, ...prev]);
    handleSessionChange(session);
    setSystemMessage({
      text: "New chat session created",
      type: "success"
    });
  };

  const handleClearHistory = () => {
    setSessions([]);
    setMessages([{
      id: Date.now(),
      role: 'bot',
      text: "All history has been cleared",
      isSystem: true,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleAutoSaveToggle = (isEnabled) => {
    setSystemMessage({
      text: isEnabled ? "Auto save activated" : "Auto save deactivated",
      type: isEnabled ? "success" : "warning"
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark-transition');
  };

  const handleSessionDelete = (sessionName) => {
    setSystemMessage({
      text: `Session "${sessionName}" has been deleted`,
      type: "warning"
    });
  };

  return (
    <div className={`
      min-h-screen
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}
      transition-colors duration-300
    `}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        sessions={sessions}
        setSessions={setSessions}
        activeSession={activeSession}
        onSessionChange={handleSessionChange}
        onNewSession={handleNewSession}
        onClearHistory={handleClearHistory}
        onAutoSaveToggle={handleAutoSaveToggle}
        onSessionDelete={handleSessionDelete}
      />
      
      <main className="pl-64">
        <SystemMessage 
          message={systemMessage}
          isDarkMode={isDarkMode}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="relative flex-1 flex flex-col min-h-screen">
            <ChatBox 
              messages={messages} 
              isDarkMode={isDarkMode} 
            />
            <InputBox 
              onSendMessage={handleSendMessage}
              messages={messages} 
              isDarkMode={isDarkMode}
              isLoading={isLoading}
              activeSession={activeSession}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
