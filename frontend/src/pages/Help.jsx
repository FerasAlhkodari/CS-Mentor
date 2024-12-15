import React from "react";

/**
 * Help component - Displays a modal with documentation and usage instructions
 * @param {boolean} isDarkMode - Current theme state
 * @param {function} onClose - Handler to close the help modal
 */
function Help({ isDarkMode, onClose }) {
  // Define help content sections with titles, content and icons
  const sections = [
    {
      title: "What is CS Mentor AI?",
      content: `CS Mentor AI is an intelligent assistant designed to help you understand computer science concepts. It can answer your questions and provide detailed explanations in various areas of computer science.`,
      icon: "🤖"
    },
    {
      title: "How to Use CS Mentor AI?",
      content: [
        "Type your question in the input box and press Enter or click Send",
        "Create a new chat session using the New Chat button", 
        "Access your chat history using the History button",
        "Enable Auto Save to keep your conversations",
        "Click on a session name to edit it",
        "Use dark/light mode toggle for better visibility"
      ],
      icon: "💡"
    },
    {
      title: "How to Ask Questions Effectively",
      content: [
        {
          question: "What is Basic I/O Interface?",
          answer: "Basic I/O Interface refers to the circuitry and protocols used to facilitate input and output operations between a microprocessor and external devices, such as sensors, actuators, and displays."
        },
        {
          question: "Explain the concept of Data Structures.",
          answer: "Data Structures are specialized formats for organizing and storing data in computer memory to be used efficiently. Common examples include arrays, linked lists, stacks, queues, trees, and graphs."
        }
      ],
      icon: "❓"
    },
    {
      title: "AI Capabilities",
      content: [
        "Explaining programming concepts and algorithms",
        "Answering theoretical questions",
        "Providing examples and clarifications",
        "Helping with problem-solving approaches",
        "Offering programming tips and best practices"
      ],
      icon: "✨"
    },
    {
      title: "Limitations",
      content: [
        "Cannot execute code directly",
        "Answers may not be 100% accurate",
        "Requires clear and specific questions",
        "No internet access for real-time information",
        "Limited to pre-programmed knowledge"
      ],
      icon: "⚠️"
    },
    {
      title: "Tips for Best Results",
      content: [
        "Ask clear and specific questions",
        "Break down complex problems",
        "Use separate sessions for different topics",
        "Review previous conversations for learning",
        "Save important conversations"
      ],
      icon: "💪"
    }
  ];

  return (
    // Modal overlay with blur effect
    <div className={`
      fixed inset-0
      flex items-center justify-center
      bg-black/50
      backdrop-blur-sm
      z-50
      p-4
      overflow-y-auto
    `}>
      {/* Main modal container */}
      <div className={`
        relative
        w-full max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        rounded-xl
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        shadow-2xl
        p-6
        animate-fade-in
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            absolute top-4 right-4
            p-2 rounded-lg
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors
          `}
        >
          ❌
        </button>

        {/* Title */}
        <h1 className={`
          text-3xl font-bold mb-8 text-center
          ${isDarkMode ? "text-white" : "text-gray-900"}
        `}>
          CS Mentor AI Tutorial
        </h1>

        {/* Help content sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="border-b last:border-0 pb-8">
              <h2 className={`
                text-xl font-semibold mb-4
                flex items-center gap-2
                ${isDarkMode ? "text-white" : "text-gray-800"}
              `}>
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h2>

              {/* Render bullet points for array content */}
              {Array.isArray(section.content) && !section.content[0]?.question && (
                <ul className={`
                  list-disc list-inside space-y-2
                  ${isDarkMode ? "text-gray-300" : "text-gray-600"}
                `}>
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}

              {/* Render Q&A format for example questions */}
              {Array.isArray(section.content) && section.content[0]?.question && (
                <div className="space-y-4">
                  {section.content.map((example, i) => (
                    <div key={i} className={`
                      p-4 rounded-lg
                      ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
                    `}>
                      <p className={`
                        font-medium mb-2
                        ${isDarkMode ? "text-gray-200" : "text-gray-800"}
                      `}>
                        Q: {example.question}
                      </p>
                      <p className={`
                        ${isDarkMode ? "text-gray-300" : "text-gray-600"}
                      `}>
                        A: {example.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Render plain text content */}
              {typeof section.content === 'string' && (
                <p className={`
                  ${isDarkMode ? "text-gray-300" : "text-gray-600"}
                `}>
                  {section.content}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Footer message */}
        <footer className="mt-8 text-center">
          <p className={`
            italic
            ${isDarkMode ? "text-gray-400" : "text-gray-500"}
          `}>
            Thank you for using CS Mentor AI! We hope it helps make learning computer science more enjoyable 🚀
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Help;