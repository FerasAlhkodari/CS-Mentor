import React, { useState, useEffect } from "react";

/**
 * History component that displays active and deleted chat sessions
 * Allows restoring deleted sessions and shows notifications
 */
function History({ 
  isDarkMode, 
  onClose, 
  onSessionRestore, 
  activeSessions,
  deletedSessions,
  setDeletedSessions,
  autoSave
}) {
  const [notification, setNotification] = useState(null);

  // Shows a temporary notification message
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handles restoring a deleted session
  const restoreSession = async (sessionToRestore) => {
    try {
      const alreadyExists = activeSessions.some(
        session => session.id === sessionToRestore.id
      );
      
      if (alreadyExists) {
        showNotification('This session is already active!', 'error');
        return;
      }

      const restoredSession = {
        ...sessionToRestore,
        messages: sessionToRestore.messages || [],
        restoredAt: new Date().toISOString(),
        active: false
      };

      // Update deleted sessions list
      const updatedDeletedSessions = deletedSessions.filter(
        s => s.id !== sessionToRestore.id
      );
      setDeletedSessions(updatedDeletedSessions);

      if (autoSave) {
        localStorage.setItem('deletedSessions', JSON.stringify(updatedDeletedSessions));
      }

      onSessionRestore(restoredSession);
      showNotification('Session restored successfully!');
    } catch (error) {
      console.error('Error restoring session:', error);
      showNotification('Failed to restore session.', 'error');
    }
  };

  return (
    <div className={`
      fixed inset-0
      bg-black bg-opacity-50
      flex items-center justify-center
      z-50
    `}>
      <div className={`
        w-full max-w-2xl
        max-h-[80vh]
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        rounded-lg
        shadow-xl
        overflow-hidden
        relative
      `}>
        {/* Notification popup */}
        {notification && (
          <div className={`
            absolute top-4 right-4 left-4
            p-3 rounded-lg
            ${notification.type === 'success' 
              ? 'bg-green-500' 
              : 'bg-red-500'
            }
            text-white
            text-sm
            font-medium
            animate-fade-in
          `}>
            {notification.message}
          </div>
        )}

        {/* Modal header */}
        <div className={`
          px-6 py-4
          border-b
          ${isDarkMode ? "border-gray-700" : "border-gray-200"}
          flex items-center justify-between
        `}>
          <h2 className={`
            text-xl font-bold
            ${isDarkMode ? "text-white" : "text-gray-900"}
          `}>
            Chat History
          </h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg
              ${isDarkMode 
                ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }
              transition-colors duration-200
            `}
          >
            ✕
          </button>
        </div>

        {/* Main content area */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)] space-y-6">
          {/* Active sessions section */}
          <section>
            <h3 className={`
              text-lg font-semibold mb-3
              ${isDarkMode ? "text-gray-300" : "text-gray-700"}
            `}>
              Active Sessions ({activeSessions.length})
            </h3>
            <div className="space-y-2">
              {activeSessions.length === 0 ? (
                <p className={`
                  text-sm italic
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                `}>
                  No active sessions
                </p>
              ) : (
                activeSessions.map(session => (
                  <div
                    key={session.id}
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode 
                        ? "bg-gray-700 text-gray-200" 
                        : "bg-gray-100 text-gray-800"
                      }
                      flex items-center justify-between
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💬</span>
                      <div>
                        <span className="font-medium">{session.name}</span>
                        {session.restoredAt && (
                          <span className={`
                            text-xs block
                            ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                          `}>
                            Restored: {new Date(session.restoredAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Deleted sessions section */}
          <section>
            <h3 className={`
              text-lg font-semibold mb-3
              ${isDarkMode ? "text-gray-300" : "text-gray-700"}
            `}>
              Deleted Sessions ({deletedSessions.length})
            </h3>
            <div className="space-y-2">
              {deletedSessions.length === 0 ? (
                <p className={`
                  text-sm italic
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                `}>
                  No deleted sessions
                </p>
              ) : (
                deletedSessions.map(session => (
                  <div
                    key={session.id}
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode 
                        ? "bg-gray-700 text-gray-200" 
                        : "bg-gray-100 text-gray-800"
                      }
                      flex items-center justify-between
                      group
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🗑️</span>
                      <span className="font-medium">{session.name}</span>
                    </div>
                    <button
                      onClick={() => restoreSession(session)}
                      className={`
                        px-3 py-1 rounded-lg text-sm
                        ${isDarkMode 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-green-500 hover:bg-green-600"
                        }
                        text-white
                        transition-colors duration-200
                        opacity-0 group-hover:opacity-100
                      `}
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default History;