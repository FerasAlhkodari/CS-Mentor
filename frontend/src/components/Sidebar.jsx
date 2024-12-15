import React, { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import History from './History';
import Tooltip from './Tooltip';
import Help from '../pages/Help';

// Component for rendering individual session items in the sidebar
function SessionItem({ 
  session, 
  isDarkMode, 
  isActive, 
  onSelect, 
  onEdit, 
  onDelete, 
  editingSession,
  editInputRef,
  handleEditName 
}) {
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);

  return (
    <div
      className={`
        group
        flex items-center gap-2
        px-3 py-2 rounded-lg
        transition-all duration-200
        ${isActive
          ? isDarkMode 
            ? "bg-gray-700 text-white" 
            : "bg-gray-100 text-gray-900"
          : isDarkMode
            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
        overflow-visible
      `}
    >
      <div className="relative flex-1 min-w-0 overflow-visible">
        <button
          className="w-full flex items-center gap-3 min-w-0"
          onClick={() => onSelect(session)}
          onMouseEnter={() => setShowNameTooltip(true)}
          onMouseLeave={() => setShowNameTooltip(false)}
        >
          <span className="text-xl flex-shrink-0">💬</span>
          {editingSession === session.id ? (
            <input
              ref={editInputRef}
              type="text"
              className={`
                flex-1 min-w-0
                bg-transparent
                focus:outline-none
                ${isDarkMode ? "text-white" : "text-gray-900"}
              `}
              defaultValue={session.name}
              onBlur={(e) => handleEditName(session.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditName(session.id, e.target.value);
                }
              }}
            />
          ) : (
            <span className="font-medium truncate block">
              {session.name}
              {session.restoredAt && (
                <span className={`
                  text-xs ml-2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                `}>
                  (Restored)
                </span>
              )}
            </span>
          )}
        </button>
        {/* Name Tooltip */}
        {showNameTooltip && !editingSession && (
          <div className="absolute -top-10 left-0 transform -translate-y-full z-50 overflow-visible">
            <Tooltip 
              text={session.name}
              position="top"
            />
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className={`
        flex items-center gap-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        overflow-visible
      `}>
        <div className="relative overflow-visible">
          <button
            onClick={() => onEdit(session.id)}
            onMouseEnter={() => setShowEditTooltip(true)}
            onMouseLeave={() => setShowEditTooltip(false)}
            className={`
              p-1 rounded
              hover:text-blue-500
              transition-colors duration-200
            `}
          >
            ✏️
          </button>
          {showEditTooltip && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-full z-50">
              <Tooltip 
                text="Edit session name"
                position="top"
              />
            </div>
          )}
        </div>
        <div className="relative overflow-visible">
          <button
            onClick={() => onDelete(session.id)}
            onMouseEnter={() => setShowDeleteTooltip(true)}
            onMouseLeave={() => setShowDeleteTooltip(false)}
            className={`
              p-1 rounded
              hover:text-red-500
              transition-colors duration-200
            `}
          >
            ❌
          </button>
          {showDeleteTooltip && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-full z-50">
              <Tooltip 
                text="Delete session"
                position="top"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Sidebar component handling sessions, themes and settings
function Sidebar({ 
  isDarkMode, 
  toggleDarkMode, 
  sessions,
  setSessions,
  activeSession,
  onSessionChange,
  onNewSession,
  onClearHistory,
  onAutoSaveToggle,
  onSessionDelete
}) {
  const [editingSession, setEditingSession] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Initialize autoSave from localStorage or default to true
  const [autoSave, setAutoSave] = useState(() => {
    const savedState = localStorage.getItem('autoSave');
    return savedState ? JSON.parse(savedState) : true;
  });
  const [deletedSessions, setDeletedSessions] = useState([]);
  const settingsRef = useRef(null);
  const editInputRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);

  // Load deleted sessions on startup
  useEffect(() => {
    const storedDeletedSessions = JSON.parse(localStorage.getItem('deletedSessions')) || [];
    setDeletedSessions(storedDeletedSessions);
  }, []);

  // Handle auto-saving of sessions
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('sessions', JSON.stringify(sessions));
      localStorage.setItem('deletedSessions', JSON.stringify(deletedSessions));
      if (activeSession) {
        localStorage.setItem('activeSessionId', activeSession.id);
      }
    } else {
      localStorage.removeItem('sessions');
      localStorage.removeItem('deletedSessions');
      localStorage.removeItem('activeSessionId');
    }
  }, [sessions, deletedSessions, autoSave, activeSession]);

  // Persist autoSave preference
  useEffect(() => {
    localStorage.setItem('autoSave', JSON.stringify(autoSave));
  }, [autoSave]);

  const toggleAutoSave = () => {
    setAutoSave(prev => {
      const newState = !prev;
      if (!newState) {
        localStorage.removeItem('sessions');
        localStorage.removeItem('deletedSessions');
        localStorage.removeItem('activeSessionId');
      }
      onAutoSaveToggle(newState);
      return newState;
    });
  };

  // Handle session deletion with history tracking
  const deleteSession = (sessionId) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    if (sessionToDelete) {
      const updatedDeletedSessions = [...deletedSessions, {
        ...sessionToDelete,
        deletedAt: new Date().toISOString()
      }];
      setDeletedSessions(updatedDeletedSessions);
      
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);

      if (autoSave) {
        localStorage.setItem('deletedSessions', JSON.stringify(updatedDeletedSessions));
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      }

      onSessionDelete(sessionToDelete.name);
    }
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manual save of sessions
  const handleSaveSessions = () => {
    try {
      localStorage.setItem("savedSessions", JSON.stringify(sessions));
      alert("Sessions saved successfully!");
      setShowSettings(false);
    } catch (error) {
      alert("Failed to save sessions!");
    }
  };

  // Clear all history after confirmation
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
      setSessions([]);
      setDeletedSessions([]);
      localStorage.removeItem('sessions');
      localStorage.removeItem('deletedSessions');
      localStorage.removeItem('activeSessionId');
      onClearHistory();
      setShowSettings(false);
    }
  };

  // Create new chat session
  const addNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      name: `Session ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    onNewSession(newSession);
  };

  // Restore deleted session
  const handleSessionRestore = (restoredSession) => {
    const sessionToAdd = {
      ...restoredSession,
      messages: restoredSession.messages || [],
      restoredAt: new Date().toISOString()
    };
    setSessions(prev => [sessionToAdd, ...prev]);
  };

  // Session name editing handlers
  const startEditing = (sessionId) => {
    setEditingSession(sessionId);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleEditName = (sessionId, newName) => {
    if (newName.trim()) {
      setSessions(sessions.map(session => 
        session.id === sessionId
          ? { ...session, name: newName.trim() }
          : session
      ));
    }
    setEditingSession(null);
  };

  const activateSession = (sessionId) => {
    setSessions(sessions.map(session => ({
      ...session,
      active: session.id === sessionId
    })));
  };

  return (
    <div className={`
      w-64 h-screen
      fixed left-0 top-0
      ${isDarkMode 
        ? "bg-gray-800 border-r border-gray-700" 
        : "bg-white"
      }
      shadow-lg
      transition-colors duration-300
      flex flex-col
      z-30
    `}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10
            rounded-xl
            flex items-center justify-center
            ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}
            text-white
            transition-all duration-300
            hover:scale-105
          `}>
            <span className="text-xl">🤖</span>
          </div>
          <div className="flex flex-col">
            <h1 className={`
              text-lg font-bold
              ${isDarkMode ? "text-white" : "text-gray-800"}
            `}>
              CS Mentor
            </h1>
            <span className={`
              text-xs
              ${isDarkMode ? "text-gray-400" : "text-gray-500"}
            `}>
              AI Assistant
            </span>
          </div>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col p-4">
        {/* Top Actions */}
        <div className="space-y-2">
          {/* New Chat Button */}
          <button
            onClick={addNewSession}
            className={`
              w-full
              flex items-center gap-3 px-3 py-2 rounded-lg
              transition-all duration-200
              ${isDarkMode 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-blue-500 text-white hover:bg-blue-600"
              }
              font-medium
            `}
          >
            <span className="text-xl">➕</span>
            <span>New Chat</span>
          </button>

          {/* Help Link */}
          <SidebarLink 
            icon="❓" 
            text="Help" 
            isDarkMode={isDarkMode}
            onClick={() => setShowHelp(true)}
          />

          {/* History Link */}
          <SidebarLink 
            icon="📚" 
            text="History" 
            isDarkMode={isDarkMode}
            onClick={() => setShowHistory(true)}
          />

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`
                w-full
                flex items-center justify-between
                px-3 py-2 rounded-lg
                transition-all duration-200
                ${isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                hover:opacity-80
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⚙️</span>
                <span className="font-medium">Settings</span>
              </div>
              <span className={`
                transform transition-transform duration-200
                ${showSettings ? "rotate-180" : ""}
              `}>
                ▼
              </span>
            </button>

            {/* Settings Dropdown Menu */}
            {showSettings && (
              <div className={`
                absolute left-0 right-0 mt-1
                py-1 rounded-lg
                shadow-lg
                ${isDarkMode ? "bg-gray-700" : "bg-white"}
                border
                ${isDarkMode ? "border-gray-600" : "border-gray-200"}
                z-50
                animate-fade-in
              `}>
                {/* Auto Save Toggle */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💾</span>
                      <span className={`
                        font-medium
                        ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                      `}>
                        Auto Save
                      </span>
                    </div>
                    <button
                      onClick={toggleAutoSave}
                      className={`
                        relative
                        w-11 h-6
                        rounded-full
                        transition-all duration-300
                        focus:outline-none
                        ${autoSave 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : isDarkMode 
                            ? 'bg-gray-600 hover:bg-gray-500' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }
                      `}
                      aria-label={autoSave ? "Disable auto save" : "Enable auto save"}
                    >
                      <span className={`
                        absolute top-1 left-1
                        w-4 h-4
                        bg-white
                        rounded-full
                        shadow-sm
                        transition-transform duration-300
                        transform
                        ${autoSave ? 'translate-x-5' : 'translate-x-0'}
                      `} />
                    </button>
                  </div>
                  <p className={`
                    mt-1 text-xs
                    ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  `}>
                    {autoSave 
                      ? "Sessions are automatically saved" 
                      : "Sessions will not be saved"
                    }
                  </p>
                </div>

                {/* Clear History Button */}
                <button
                  onClick={handleClearHistory}
                  className={`
                    w-full px-4 py-2
                    flex items-center gap-2
                    transition-colors duration-200
                    ${isDarkMode
                      ? "text-gray-300 hover:bg-red-600"
                      : "text-gray-700 hover:bg-red-500 hover:text-white"
                    }
                  `}
                >
                  <span>🗑️</span>
                  <span>Clear History</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className={`
          h-px -mx-4 my-4
          ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}
        `} />

        {/* Sessions List */}
        <div className="space-y-1 flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isDarkMode={isDarkMode}
              isActive={session.id === activeSession?.id}
              onSelect={onSessionChange}
              onEdit={startEditing}
              onDelete={deleteSession}
              editingSession={editingSession}
              editInputRef={editInputRef}
              handleEditName={handleEditName}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4">
        <div className={`
          text-xs
          ${isDarkMode ? "text-gray-500" : "text-gray-400"}
          text-center
        `}>
          Version 1.0.0
        </div>
      </div>

      {/* Modals */}
      {showHistory && (
        <History 
          isDarkMode={isDarkMode}
          onClose={() => setShowHistory(false)}
          onSessionRestore={handleSessionRestore}
          activeSessions={sessions}
          deletedSessions={deletedSessions}
          setDeletedSessions={setDeletedSessions}
          autoSave={autoSave}
        />
      )}

      {showHelp && (
        <Help 
          isDarkMode={isDarkMode}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
}

// Helper component for sidebar navigation links with tooltips
function SidebarLink({ icon, text, isDarkMode, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`
        relative
        w-full
        flex items-center gap-3 px-3 py-2 rounded-lg
        transition-all duration-200
        ${isDarkMode
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
        hover:opacity-80
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
      {showTooltip && (
        <Tooltip 
          text={
            text === "Help" ? "View Help Documentation" :
            text === "History" ? "View Chat History" :
            text === "Settings" ? "Open Settings Menu" :
            `Open ${text}`
          }
          position="right"
        />
      )}
    </button>
  );
}

export default Sidebar; 