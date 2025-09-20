// SikshaConnect 2.0 - Enhanced AI Chatbot Assistant (Vanilla JS)

// Enhanced Chatbot state
let chatHistory = [];
const maxChatHistory = 20;
let chatbotInitialized = false;
let chatbotPersonality = 'friendly';
let userPreferences = {};
let sessionStartTime = Date.now();
let messageCount = 0;
let userSatisfactionScore = 0;
let isVoiceEnabled = false;
let currentLanguage = 'en';
let currentRating = 0;

// Load preferences on startup
try {
    const saved = localStorage.getItem('chatbot_prefs');
    if (saved) {
        userPreferences = JSON.parse(saved);
    }
} catch (e) {
    console.log('Could not load user preferences');
    userPreferences = {};
}

// Advanced AI Response System
const aiResponses = {
    greetings: [
        "Hello! 👋 I'm your AI Study Assistant. Ready to embark on an amazing learning journey?",
        "Hey there! 🌟 Welcome to SikshaConnect! What exciting topic shall we explore today?",
        "Hi! 🚀 I'm here to make your learning experience absolutely fantastic!"
    ],
    encouragements: [
        "You're asking great questions! 🌟",
        "I love your curiosity! 🔥",
        "That's a fantastic topic to explore! 💡",
        "You're on the right track! 🎯"
    ],
    farewells: [
        "Happy learning! 🎓 Feel free to come back anytime!",
        "Keep exploring and growing! 🌱 I'll be here when you need me!",
        "Until next time! 📚 Remember, every expert was once a beginner!"
    ]
};

// Smart keyword matching system
const intentPatterns = {
    course_inquiry: /(?:course|class|program|study|learn|training|curriculum)/i,
    enrollment: /(?:enroll|register|join|sign up|admission|apply)/i,
    instructor: /(?:instructor|teacher|professor|mentor|tutor|who teaches)/i,
    pricing: /(?:price|cost|fee|expensive|cheap|budget|payment|money)/i,
    certificate: /(?:certificate|certification|diploma|credential|badge)/i,
    schedule: /(?:schedule|time|when|duration|deadline|timing)/i,
    support: /(?:help|support|problem|issue|trouble|stuck)/i,
    recommendation: /(?:recommend|suggest|best|which|should i|advice)/i
};

// Initialize Enhanced Chatbot
function initChatbot() {
    if (chatbotInitialized) return;
    
    const chatbotContainer = document.getElementById('chatbot-container');
    if (!chatbotContainer) return;
    
    chatbotContainer.innerHTML = `
        <!-- Chatbot Toggle Button with notification -->
        <button class="chatbot-toggle" onclick="toggleChatbot()" id="chatbotToggle">
            <i class="fas fa-robot"></i>
            <span class="notification-dot" id="notificationDot" style="display: none;"></span>
        </button>

        <!-- Chatbot Window -->
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <div class="header-content">
                    <div class="bot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="bot-info">
                        <strong>AI Study Assistant</strong>
                        <div class="bot-status">
                            <span class="status-dot online"></span>
                            <span class="status-text">Online & Ready to Help!</span>
                        </div>
                    </div>
                </div>
                <div class="header-controls">
                    <button class="control-btn" onclick="toggleVoice()" id="voiceBtn" title="Voice Mode">
                        <i class="fas fa-microphone-slash"></i>
                    </button>
                    <button class="control-btn" onclick="toggleLanguage()" id="langBtn" title="Language">
                        <i class="fas fa-globe"></i>
                    </button>
                    <button class="control-btn" onclick="exportChat()" title="Export Chat">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="chatbot-close" onclick="toggleChatbot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Progress Bar for session -->
            <div class="progress-container">
                <div class="progress-bar" id="progressBar"></div>
                <span class="progress-text">Session Progress</span>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot welcome-message">
                    <div class="message-content">
                        ${getRandomResponse('greetings')} I can help you with:
                        <div class="capabilities-grid">
                            <span class="capability">📚 Course Info</span>
                            <span class="capability">🎓 Enrollment</span>
                            <span class="capability">👨‍🏫 Instructors</span>
                            <span class="capability">💰 Pricing</span>
                            <span class="capability">📜 Certificates</span>
                            <span class="capability">🕒 Schedules</span>
                        </div>
                    </div>
                </div>
                <div class="quick-actions-container">
                    <div class="quick-actions">
                        <button class="quick-action" onclick="sendQuickMessage('What courses do you offer?')">
                            📚 Available Courses
                        </button>
                        <button class="quick-action" onclick="sendQuickMessage('How can I enroll?')">
                            ✏️ Enrollment Guide
                        </button>
                        <button class="quick-action" onclick="sendQuickMessage('Who are the instructors?')">
                            👨‍🏫 Meet Instructors
                        </button>
                        <button class="quick-action" onclick="sendQuickMessage('Recommend a course for me')">
                            🎯 Get Recommendation
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Smart Suggestions -->
            <div class="smart-suggestions" id="smartSuggestions"></div>
            
            <div class="chatbot-input-container">
                <div class="input-wrapper">
                    <button class="attachment-btn" onclick="handleFileUpload()" title="Upload File">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message or ask me anything...">
                    <button class="emoji-btn" onclick="toggleEmojiPicker()" title="Add Emoji">
                        😊
                    </button>
                    <button class="chatbot-send" onclick="sendMessage()" id="sendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="input-actions">
                    <button class="action-btn" onclick="clearChat()">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                    <button class="action-btn" onclick="rateChatbot()">
                        <i class="fas fa-star"></i> Rate
                    </button>
                    <div class="typing-indicator-input" id="userTyping">User is typing...</div>
                </div>
            </div>
        </div>

        <!-- Rating Modal -->
        <div class="rating-modal" id="ratingModal">
            <div class="rating-content">
                <h3>How was your experience?</h3>
                <div class="stars">
                    <span class="star" onclick="setRating(1)">⭐</span>
                    <span class="star" onclick="setRating(2)">⭐</span>
                    <span class="star" onclick="setRating(3)">⭐</span>
                    <span class="star" onclick="setRating(4)">⭐</span>
                    <span class="star" onclick="setRating(5)">⭐</span>
                </div>
                <textarea placeholder="Optional feedback..." id="feedbackText"></textarea>
                <div class="rating-buttons">
                    <button onclick="submitRating()">Submit</button>
                    <button onclick="closeRating()">Skip</button>
                </div>
            </div>
        </div>
    `;
    
    addEnhancedStyles();
    setupAdvancedEventListeners();
    initializeAdvancedFeatures();
    
    chatbotInitialized = true;
    console.log('🚀 Enhanced SikshaConnect Chatbot initialized successfully!');
}

// Enhanced Styles
function addEnhancedStyles() {
    if (document.getElementById('enhanced-chatbot-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-chatbot-styles';
    style.textContent = `
        /* Enhanced Chatbot Styles */
        :root {
            --primary-color: #6366f1;
            --secondary-color: #8b5cf6;
            --surface-color: #ffffff;
            --bg-color: #f8fafc;
            --text-color: #1f2937;
            --text-muted: #6b7280;
            --border-color: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .chatbot-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 65px;
            height: 65px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1001;
            animation: pulse 2s infinite;
            position: relative;
        }

        .chatbot-toggle:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.6);
        }

        .notification-dot {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            border-radius: 50%;
            border: 3px solid white;
            animation: bounce 1s infinite;
        }

        .chatbot-window {
            position: fixed;
            bottom: 100px;
            right: 2rem;
            width: 400px;
            height: 600px;
            background: var(--surface-color);
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            z-index: 1002;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
        }

        .chatbot-window.show {
            display: flex;
            animation: slideUpBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .chatbot-header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        .header-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1;
            position: relative;
        }

        .bot-avatar {
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            animation: float 3s ease-in-out infinite;
        }

        .bot-info strong {
            display: block;
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
        }

        .bot-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            opacity: 0.9;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .status-dot.online {
            background: #10b981;
            animation: pulse 2s infinite;
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 1;
            position: relative;
        }

        .control-btn, .chatbot-close {
            width: 35px;
            height: 35px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .control-btn:hover, .chatbot-close:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.1);
        }

        .progress-container {
            padding: 0.75rem 1.25rem;
            background: var(--bg-color);
            border-bottom: 1px solid var(--border-color);
        }

        .progress-bar {
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 2px;
            width: 0%;
            transition: width 0.5s ease;
        }

        .progress-text {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
            display: block;
        }

        .chatbot-messages {
            flex: 1;
            padding: 1.25rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            scroll-behavior: smooth;
        }

        .message {
            max-width: 85%;
            border-radius: 1.25rem;
            word-wrap: break-word;
            position: relative;
            animation: messageSlide 0.3s ease;
        }

        .message.user {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 0.5rem;
            padding: 1rem 1.25rem;
        }

        .message.bot {
            background: var(--surface-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            align-self: flex-start;
            border-bottom-left-radius: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .message-content {
            padding: 1rem 1.25rem;
        }

        .welcome-message {
            max-width: 100%;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border: 1px solid #0ea5e9;
        }

        .capabilities-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .capability {
            background: rgba(99, 102, 241, 0.1);
            padding: 0.5rem;
            border-radius: 0.75rem;
            font-size: 0.8rem;
            text-align: center;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .quick-actions-container {
            margin: 1rem 0;
        }

        .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
        }

        .quick-action {
            padding: 1rem;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            color: var(--primary-color);
            border: 1.5px solid rgba(99, 102, 241, 0.3);
            border-radius: 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .quick-action::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s ease;
        }

        .quick-action:hover::before {
            left: 100%;
        }

        .quick-action:hover {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        }

        .smart-suggestions {
            padding: 0 1.25rem;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            max-height: 60px;
            overflow-y: auto;
        }

        .suggestion-chip {
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .suggestion-chip:hover {
            background: var(--primary-color);
            color: white;
        }

        .chatbot-input-container {
            padding: 1.25rem;
            border-top: 1px solid var(--border-color);
            background: var(--surface-color);
        }

        .input-wrapper {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: var(--bg-color);
            border: 2px solid var(--border-color);
            border-radius: 2rem;
            padding: 0.5rem;
            transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .attachment-btn, .emoji-btn {
            width: 35px;
            height: 35px;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .attachment-btn:hover, .emoji-btn:hover {
            background: rgba(99, 102, 241, 0.1);
        }

        .chatbot-input {
            flex: 1;
            padding: 0.75rem;
            border: none;
            background: transparent;
            color: var(--text-color);
            font-size: 1rem;
            outline: none;
        }

        .chatbot-send {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .chatbot-send:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .input-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.75rem;
        }

        .action-btn {
            background: none;
            border: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }

        .action-btn:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .typing-indicator-input {
            font-size: 0.8rem;
            color: var(--text-muted);
            font-style: italic;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .typing-indicator-input.show {
            opacity: 1;
        }

        .typing-indicator {
            align-self: flex-start;
            max-width: 80%;
            animation: messageSlide 0.3s ease;
        }

        .typing-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.25rem;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 1.25rem;
            border-bottom-left-radius: 0.5rem;
        }

        .bot-avatar-small {
            width: 30px;
            height: 30px;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            flex-shrink: 0;
        }

        .typing-text {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .typing-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-style: italic;
        }

        .typing-dots {
            display: flex;
            gap: 0.3rem;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--primary-color);
            border-radius: 50%;
            animation: typingBounce 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        .message-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid var(--border-color);
        }

        .message-action {
            background: none;
            border: 1px solid var(--border-color);
            padding: 0.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            color: var(--text-muted);
            transition: all 0.3s ease;
        }

        .message-action:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .message-timestamp {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
            opacity: 0.7;
        }

        /* Rating Modal */
        .rating-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }

        .rating-modal.show {
            display: flex;
            animation: fadeIn 0.3s ease;
        }

        .rating-content {
            background: white;
            padding: 2rem;
            border-radius: 1.5rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: scaleIn 0.3s ease;
        }

        .stars {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin: 1rem 0;
            font-size: 2rem;
        }

        .star {
            cursor: pointer;
            opacity: 0.3;
            transition: all 0.3s ease;
        }

        .star:hover, .star.active {
            opacity: 1;
            transform: scale(1.2);
        }

        .rating-content textarea {
            width: 100%;
            height: 80px;
            margin: 1rem 0;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            resize: none;
            font-family: inherit;
        }

        .rating-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .rating-buttons button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .rating-buttons button:first-child {
            background: var(--primary-color);
            color: white;
        }

        .rating-buttons button:first-child:hover {
            background: var(--secondary-color);
        }

        .rating-buttons button:last-child {
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        .rating-buttons button:last-child:hover {
            background: var(--border-color);
        }

        /* Animations */
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        @keyframes slideUpBounce {
            0% { transform: translateY(100px) scale(0.8); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes messageSlide {
            0% { transform: translateX(-20px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes scaleIn {
            0% { transform: scale(0.8); }
            100% { transform: scale(1); }
        }

        @keyframes typingBounce {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .chatbot-window {
                width: calc(100vw - 1rem);
                height: calc(100vh - 100px);
                right: 0.5rem;
                left: 0.5rem;
                bottom: 80px;
            }

            .chatbot-toggle {
                width: 55px;
                height: 55px;
                font-size: 1.5rem;
            }

            .quick-actions {
                grid-template-columns: 1fr;
            }

            .capabilities-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --surface-color: #1f2937;
                --bg-color: #374151;
                --text-color: #f9fafb;
                --text-muted: #9ca3af;
                --border-color: #4b5563;
            }
            
            .message.bot {
                background: #374151;
                color: #f9fafb;
                border-color: #4b5563;
            }
            
            .input-wrapper {
                background: #374151;
                border-color: #4b5563;
            }

            .rating-content {
                background: #1f2937;
                color: #f9fafb;
            }

            .rating-content textarea {
                background: #374151;
                color: #f9fafb;
                border-color: #4b5563;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Advanced Event Listeners
function setupAdvancedEventListeners() {
    const chatInput = document.getElementById('chatbotInput');
    if (chatInput) {
        let typingTimer;
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Show typing indicator
        chatInput.addEventListener('input', function() {
            showUserTyping();
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() {
                hideUserTyping();
            }, 1000);
            
            // Generate smart suggestions
            generateSmartSuggestions(chatInput.value);
        });
    }
    
    // Enhanced outside click handler
    document.addEventListener('click', function(e) {
        const chatWindow = document.getElementById('chatbotWindow');
        const chatToggle = document.querySelector('.chatbot-toggle');
        
        if (chatWindow && chatToggle && chatWindow.classList.contains('show') && 
            !chatWindow.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            setTimeout(function() {
                chatWindow.classList.remove('show');
            }, 100);
        }
    });
}

// Initialize Advanced Features
function initializeAdvancedFeatures() {
    updateSessionProgress();
    
    // Show notification dot occasionally
    setTimeout(function() {
        showNotification("💡 New learning tips available!");
    }, 5000);
    
    // Initialize voice recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        initializeVoiceRecognition();
    }
}

// Enhanced Chatbot Functions
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    if (!chatWindow) return;
    
    const isShowing = chatWindow.classList.contains('show');
    
    if (isShowing) {
        chatWindow.classList.remove('show');
        saveSessionData();
    } else {
        chatWindow.classList.add('show');
        updateSessionProgress();
        
        // Focus input with delay for animation
        setTimeout(function() {
            const input = document.getElementById('chatbotInput');
            if (input) input.focus();
        }, 500);
        
        // Hide notification
        hideNotification();
        
        // Show contextual greeting if returning user
        if (messageCount === 0 && userPreferences.lastVisit) {
            const timeSince = Date.now() - userPreferences.lastVisit;
            if (timeSince > 86400000) { // 24 hours
                setTimeout(function() {
                    addMessage('Thank you for the ' + currentRating + '-star rating! 🌟 Your feedback helps me improve. Keep learning amazing things! 🚀', 'bot');
}

function closeRating() {
    const ratingModal = document.getElementById('ratingModal');
    if (ratingModal) {
        ratingModal.classList.remove('show');
    }
}

function copyMessage(button) {
    const messageContent = button.closest('.message').querySelector('.message-content').innerText;
    navigator.clipboard.writeText(messageContent).then(function() {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(function() {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
    });
}

function speakMessage(button) {
    const messageContent = button.closest('.message').querySelector('.message-content').innerText;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(messageContent);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
        
        button.innerHTML = '<i class="fas fa-volume-mute"></i>';
        utterance.onend = function() {
            button.innerHTML = '<i class="fas fa-volume-up"></i>';
        };
    }
}

// File Upload Handler
function handleFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.jpg,.png';
    input.style.display = 'none';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addMessage('📎 Uploaded: ' + file.name + ' (' + (file.size / 1024).toFixed(1) + 'KB)', 'user');
                
                setTimeout(function() {
                    addMessage('✅ File processed successfully! I can help you with questions about the content. What would you like to know?', 'bot');
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// Emoji Picker (simplified)
function toggleEmojiPicker() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const emojis = ['😊', '👍', '❤️', '😂', '🤔', '😮', '👏', '🔥', '💡', '🎉', '🚀', '✨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    input.value += randomEmoji;
    input.focus();
}

// Voice Recognition
function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.value = transcript;
            sendMessage();
        }
    };
    
    recognition.onerror = function(event) {
        console.log('Speech recognition error:', event.error);
    };
    
    // Add voice input functionality
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'v' && isVoiceEnabled) {
            recognition.start();
        }
    });
}

// Data Persistence
function saveUserPreferences() {
    try {
        userPreferences.lastVisit = Date.now();
        userPreferences.totalSessions = (userPreferences.totalSessions || 0) + 1;
        userPreferences.totalMessages = (userPreferences.totalMessages || 0) + messageCount;
        localStorage.setItem('chatbot_prefs', JSON.stringify(userPreferences));
    } catch (e) {
        console.log('Could not save user preferences');
    }
}

function saveSessionData() {
    const sessionData = {
        startTime: sessionStartTime,
        endTime: Date.now(),
        messageCount: messageCount,
        satisfactionScore: userSatisfactionScore,
        chatHistory: chatHistory
    };
    
    try {
        localStorage.setItem('last_session', JSON.stringify(sessionData));
        saveUserPreferences();
    } catch (e) {
        console.log('Could not save session data');
    }
}

// Advanced Typing Indicator with realistic delays
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = 
        '<div class="typing-content">' +
            '<div class="bot-avatar-small">' +
                '<i class="fas fa-robot"></i>' +
            '</div>' +
            '<div class="typing-text">' +
                '<span class="typing-label">AI Assistant is thinking</span>' +
                '<div class="typing-dots">' +
                    '<div class="typing-dot"></div>' +
                    '<div class="typing-dot"></div>' +
                    '<div class="typing-dot"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add realistic typing sounds (optional)
    if (userPreferences.soundEnabled) {
        playTypingSound();
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Sound Effects (optional enhancement)
function playTypingSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Analytics and Insights
function getSessionInsights() {
    const sessionDuration = Date.now() - sessionStartTime;
    const avgResponseTime = sessionDuration / messageCount;
    
    return {
        sessionDuration: sessionDuration,
        messageCount: messageCount,
        avgResponseTime: avgResponseTime,
        satisfactionScore: userSatisfactionScore,
        mostDiscussedTopics: getMostDiscussedTopics()
    };
}

function getMostDiscussedTopics() {
    const topics = {};
    
    chatHistory.forEach(function(message) {
        if (message.role === 'user') {
            const content = message.content.toLowerCase();
            Object.keys(intentPatterns).forEach(function(intent) {
                if (intentPatterns[intent].test(content)) {
                    topics[intent] = (topics[intent] || 0) + 1;
                }
            });
        }
    });
    
    return Object.entries(topics)
        .sort(function(a, b) { return b[1] - a[1]; })
        .slice(0, 3)
        .map(function(entry) { return entry[0]; });
}

// Chatbot Health Check
function performHealthCheck() {
    const health = {
        initialized: chatbotInitialized,
        messagesWorking: !!document.getElementById('chatbotMessages'),
        inputWorking: !!document.getElementById('chatbotInput'),
        stylesLoaded: !!document.getElementById('enhanced-chatbot-styles'),
        localStorageAvailable: typeof Storage !== 'undefined',
        speechSynthesisAvailable: 'speechSynthesis' in window,
        speechRecognitionAvailable: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    };
    
    console.log('Chatbot Health Check:', health);
    return health;
}

// Performance Monitoring
function monitorPerformance() {
    const performanceData = {
        responseTime: Date.now() - sessionStartTime,
        memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
        messagesPerSecond: messageCount / ((Date.now() - sessionStartTime) / 1000),
        errorCount: 0
    };
    
    console.log('Chatbot Performance:', performanceData);
    
    if (performanceData.messagesPerSecond > 10) {
        setTimeout(function() {}, 1000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all other scripts have loaded
    setTimeout(function() {
        initChatbot();
        
        // Auto-save session data every 30 seconds
        setInterval(saveSessionData, 30000);
        
        // Performance monitoring every 60 seconds
        setInterval(monitorPerformance, 60000);
        
        // Health check on startup
        setTimeout(performHealthCheck, 1000);
        
        console.log('🚀 Enhanced SikshaConnect Chatbot initialized successfully!');
        console.log('Features loaded:', {
            voiceRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            speechSynthesis: 'speechSynthesis' in window,
            localStorage: typeof Storage !== 'undefined',
            analytics: true,
            smartSuggestions: true,
            fileUpload: true,
            exportChat: true,
            multiLanguage: true,
            performanceMonitoring: true
        });
    }, 100);
});("Welcome back! 🎉 It's been a while. Ready to continue your learning journey?", 'bot');
                }, 1000);
            }
        }
    }
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        messageCount++;
        
        updateSessionProgress();
        clearSmartSuggestions();
        
        // Add to chat history
        chatHistory.push({ role: 'user', content: message, timestamp: Date.now() });
        if (chatHistory.length > maxChatHistory) {
            chatHistory.shift();
        }
        
        showTypingIndicator();
        
        setTimeout(function() {
            hideTypingIndicator();
            processEnhancedMessage(message);
        }, Math.random() * 1000 + 500);
        
        setTimeout(function() {
            generateFollowUpSuggestions(message);
        }, 2000);
    }
}

function sendQuickMessage(message) {
    addMessage(message, 'user');
    messageCount++;
    
    chatHistory.push({ role: 'user', content: message, timestamp: Date.now() });
    if (chatHistory.length > maxChatHistory) {
        chatHistory.shift();
    }
    
    updateSessionProgress();
    showTypingIndicator();
    
    setTimeout(function() {
        hideTypingIndicator();
        processEnhancedMessage(message);
    }, 1200);
}

function addMessage(content, sender, options) {
    options = options || {};
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = '<div class="message-content">' + content +
            (options.showActions ? '<div class="message-actions">' +
                '<button class="message-action" onclick="copyMessage(this)"><i class="fas fa-copy"></i></button>' +
                '<button class="message-action" onclick="speakMessage(this)"><i class="fas fa-volume-up"></i></button>' +
            '</div>' : '') + '</div>' +
            (options.showTimestamp ? '<div class="message-timestamp">' + new Date().toLocaleTimeString() + '</div>' : '');
    } else {
        messageDiv.innerHTML = '<div class="message-content">' + content + '</div>' +
            (options.showTimestamp ? '<div class="message-timestamp">' + new Date().toLocaleTimeString() + '</div>' : '');
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    if (sender === 'bot') {
        chatHistory.push({ role: 'bot', content: content, timestamp: Date.now() });
        if (chatHistory.length > maxChatHistory) {
            chatHistory.shift();
        }
    }
}

function processEnhancedMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    let intent = detectIntent(message);
    
    const encouragement = Math.random() > 0.7 ? getRandomResponse('encouragements') + '\n\n' : '';
    
    switch (intent) {
        case 'course_inquiry':
            response = handleCourseInquiry(message);
            break;
        case 'enrollment':
            response = handleEnrollmentQuery(message);
            break;
        case 'instructor':
            response = handleInstructorQuery(message);
            break;
        case 'pricing':
            response = handlePricingQuery(message);
            break;
        case 'certificate':
            response = handleCertificateQuery(message);
            break;
        case 'schedule':
            response = handleScheduleQuery(message);
            break;
        case 'support':
            response = handleSupportQuery(message);
            break;
        case 'recommendation':
            response = handleRecommendationQuery(message);
            break;
        default:
            response = handleGeneralQuery(message);
    }
    
    response = encouragement + response;
    
    if (Math.random() > 0.6) {
        response += '\n\n' + generateContextualFollowUp(intent);
    }
    
    addMessage(response, 'bot', { showActions: true, showTimestamp: true });
    updateSatisfactionScore(intent);
}

// Intent Detection and Response Handlers
function detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const intent in intentPatterns) {
        if (intentPatterns[intent].test(lowerMessage)) {
            return intent;
        }
    }
    
    return 'general';
}

function handleCourseInquiry(message) {
    const courses = getCourseData();
    let response = "Here are our amazing courses! 📚\n\n";
    
    if (message.toLowerCase().includes('recommend') || message.toLowerCase().includes('best')) {
        response += "🎯 **Recommended for you:**\n";
        response += "• **Web Development Fundamentals** - Perfect for beginners! 🌟\n";
        response += "• **Data Science Essentials** - High demand skill 📈\n\n";
    }
    
    response += "**All Available Courses:**\n";
    courses.forEach(function(course) {
        response += '• **' + course.title + '** - ' + course.duration + ' | ' + course.level + ' 🎓\n';
        response += '  ' + course.description + '\n\n';
    });
    
    response += "💡 **Pro Tip:** Start with our skill assessment to find your perfect match!";
    
    return response;
}

function handleEnrollmentQuery(message) {
    return "🚀 **Ready to start learning?** Here's your enrollment roadmap:\n\n" +
           "**Step 1: Choose Your Path** 🎯\n" +
           "• Browse our course catalog\n" +
           "• Take our free skill assessment\n" +
           "• Get personalized recommendations\n\n" +
           "**Step 2: Get Started** ✨\n" +
           "• Create your free account (30 seconds!)\n" +
           "• Select your preferred course\n" +
           "• Choose your learning schedule\n\n" +
           "**Step 3: Learn & Grow** 📈\n" +
           "• Access 24/7 course materials\n" +
           "• Join live sessions with experts\n" +
           "• Build real-world projects\n\n" +
           "💰 **Special Offer:** Use code LEARN2024 for 25% off your first course!\n\n" +
           "Ready to enroll? Just say \"start enrollment\" and I'll guide you through it! 🎉";
}

function handleInstructorQuery(message) {
    return "👨‍🏫 **Meet Our World-Class Instructors!**\n\n" +
           "🌟 **Dr. Sarah Chen** - Lead Data Scientist\n" +
           "• Former Google ML Engineer\n" +
           "• 10+ years industry experience\n" +
           "• Published researcher in AI/ML\n\n" +
           "💻 **Mark Rodriguez** - Senior Full-Stack Developer\n" +
           "• Ex-Facebook Software Engineer\n" +
           "• Built apps with 10M+ users\n" +
           "• Open source contributor\n\n" +
           "🎨 **Priya Sharma** - UX/UI Design Expert\n" +
           "• Former Apple Design Team\n" +
           "• Award-winning designer\n" +
           "• 500+ successful projects\n\n" +
           "🚀 **Dr. James Wilson** - Tech Entrepreneur\n" +
           "• Founded 3 successful startups\n" +
           "• MIT Computer Science PhD\n" +
           "• TED Talk speaker\n\n" +
           "**All instructors provide:**\n" +
           "✅ Live Q&A sessions\n" +
           "✅ Personalized feedback\n" +
           "✅ Career mentorship\n" +
           "✅ Industry insights\n\n" +
           "Want to meet them? Join our next live session! 🎥";
}

function handlePricingQuery(message) {
    return "💰 **Transparent & Affordable Pricing**\n\n" +
           "🎯 **Individual Courses**\n" +
           "• Beginner: $49 - $99\n" +
           "• Intermediate: $99 - $149\n" +
           "• Advanced: $149 - $199\n\n" +
           "📦 **Course Bundles** (Save up to 40%!)\n" +
           "• Web Dev Bundle: $199 (was $347)\n" +
           "• Data Science Bundle: $249 (was $447)\n" +
           "• Complete Tech Bundle: $399 (was $747)\n\n" +
           "🌟 **Premium All-Access**\n" +
           "• $299/year - ALL courses included!\n" +
           "• Live sessions with instructors\n" +
           "• Career guidance & mentorship\n" +
           "• Priority support\n\n" +
           "💡 **Financial Options:**\n" +
           "✅ 30-day money-back guarantee\n" +
           "✅ Payment plans available\n" +
           "✅ Student discounts (40% off)\n" +
           "✅ Corporate packages\n" +
           "✅ Scholarship program\n\n" +
           "🎁 **Current Offer:** LEARN2024 - 25% off any plan!\n\n" +
           "Quality education shouldn't break the bank! 🎓✨";
}

function handleCertificateQuery(message) {
    return "🏆 **Industry-Recognized Certificates**\n\n" +
           "**What You'll Earn:**\n" +
           "✅ **Official SikshaConnect Certificate**\n" +
           "✅ **Skill-specific digital badges**\n" +
           "✅ **LinkedIn credential integration**\n" +
           "✅ **Detailed competency report**\n" +
           "✅ **Portfolio project showcase**\n\n" +
           "**Certificate Features:**\n" +
           "🔒 **Blockchain verified** - tamper-proof authenticity\n" +
           "🌐 **Globally recognized** - accepted by 500+ companies\n" +
           "📱 **Digital & printable** - share anywhere\n" +
           "📊 **Skills breakdown** - detailed competency map\n\n" +
           "**Trusted by Top Companies:**\n" +
           "• Google • Microsoft • Amazon\n" +
           "• Meta • Netflix • Spotify\n" +
           "• Tesla • Uber • Airbnb\n\n" +
           "**Certificate Requirements:**\n" +
           "📚 Complete all course modules (80% minimum)\n" +
           "🛠️ Submit final project\n" +
           "✍️ Pass skill assessment\n" +
           "👥 Participate in peer reviews\n\n" +
           "Your certificate is your passport to new opportunities! 🚀";
}

function handleScheduleQuery(message) {
    return "🕒 **Flexible Learning Schedule**\n\n" +
           "**Self-Paced Learning:**\n" +
           "• 24/7 access to all materials\n" +
           "• Learn at your own speed\n" +
           "• Mobile-friendly platform\n" +
           "• Offline content download\n\n" +
           "**Live Sessions Schedule:**\n" +
           "🌅 **Morning Sessions** (9:00 AM PST)\n" +
           "• Monday: Web Development\n" +
           "• Wednesday: Data Science\n" +
           "• Friday: Design Fundamentals\n\n" +
           "🌆 **Evening Sessions** (7:00 PM PST)\n" +
           "• Tuesday: Advanced Programming\n" +
           "• Thursday: AI/ML Workshops\n" +
           "• Saturday: Career Guidance\n\n" +
           "**Course Durations:**\n" +
           "⚡ **Crash Courses:** 1-2 weeks\n" +
           "📚 **Standard Courses:** 4-6 weeks\n" +
           "🎓 **Comprehensive Programs:** 8-12 weeks\n\n" +
           "**Study Time Recommendations:**\n" +
           "• Beginner: 3-5 hours/week\n" +
           "• Intermediate: 5-8 hours/week\n" +
           "• Advanced: 8-12 hours/week\n\n" +
           "⏰ **Upcoming Cohort:** Next Monday! Still time to join! 🎉";
}

function handleSupportQuery(message) {
    return "🤝 **We're Here to Help 24/7!**\n\n" +
           "**Instant Support:**\n" +
           "💬 **AI Chat Assistant** - That's me! Available anytime\n" +
           "📱 **Mobile App Support** - Help on the go\n" +
           "🔍 **Smart Help Center** - AI-powered search\n\n" +
           "**Human Support:**\n" +
           "👨‍💼 **Live Chat** - Mon-Fri 9AM-9PM PST\n" +
           "📞 **Phone Support** - +1 (555) LEARN-24\n" +
           "📧 **Email** - support@sikshaconnect.org\n" +
           "🎥 **Video Calls** - For complex issues\n\n" +
           "**Community Support:**\n" +
           "👥 **Student Forums** - 50,000+ active learners\n" +
           "📚 **Study Groups** - Find learning partners\n" +
           "🎯 **Peer Mentorship** - Learn together\n\n" +
           "**Technical Support:**\n" +
           "🔧 **Platform Issues** - Fixed in < 2 hours\n" +
           "📱 **App Problems** - Real-time assistance\n" +
           "🖥️ **Browser Support** - All major browsers\n\n" +
           "**Average Response Times:**\n" +
           "⚡ Chat: Instant\n" +
           "📧 Email: < 2 hours\n" +
           "📞 Phone: < 30 seconds\n\n" +
           "What specific help do you need? I'm here for you! 💪";
}

function handleRecommendationQuery(message) {
    return "🎯 **Personalized Course Recommendations**\n\n" +
           "Based on current trends and your interests, here are my top picks:\n\n" +
           "**🔥 Most Popular Right Now:**\n" +
           "1️⃣ **Full-Stack Web Development**\n" +
           "   • High job demand (150k+ openings)\n" +
           "   • Average salary: $75k-120k\n" +
           "   • Perfect for career switchers\n\n" +
           "2️⃣ **Data Science & AI**\n" +
           "   • Fastest growing field (+35% yearly)\n" +
           "   • Average salary: $90k-150k\n" +
           "   • Future-proof career\n\n" +
           "3️⃣ **UX/UI Design**\n" +
           "   • Creative + technical balance\n" +
           "   • Remote-friendly (95% jobs)\n" +
           "   • Average salary: $65k-110k\n\n" +
           "**Quick Assessment:**\n" +
           "🤔 Love problem-solving? → Web Development\n" +
           "📊 Enjoy data & patterns? → Data Science\n" +
           "🎨 Creative with user focus? → UX Design\n" +
           "💼 Want to start a business? → Digital Marketing\n\n" +
           "**🎁 Special Recommendations:**\n" +
           "• First-time learner? Start with \"Tech Foundations\"\n" +
           "• Career changer? Try \"Professional Bootcamp\"\n" +
           "• Already experienced? Go for \"Advanced Specialization\"\n\n" +
           "Want a detailed assessment? Just ask me about your interests! 🚀";
}

function handleGeneralQuery(message) {
    const responses = [
        "That's an interesting question! 🤔 While I specialize in helping with SikshaConnect courses and learning, I'd love to help you find the right information.",
        "Great question! 💡 I'm your AI Study Assistant, so I'm most helpful with course information, enrollment, and learning guidance.",
        "I appreciate you asking! 🌟 As your learning companion, I'm here to help you succeed with your educational journey."
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return baseResponse + "\n\n**I can definitely help you with:**\n" +
           "📚 Course recommendations and details\n" +
           "✏️ Enrollment process and requirements\n" +
           "👨‍🏫 Instructor information and backgrounds\n" +
           "💰 Pricing and payment options\n" +
           "🏆 Certificates and career outcomes\n" +
           "🕒 Schedules and learning paths\n" +
           "🤝 Technical and learning support\n\n" +
           "What specific aspect of your learning journey can I assist you with today? 🎯";
}

// Helper Functions
function getCourseData() {
    return [
        {
            title: "Web Development Fundamentals",
            duration: "6 weeks",
            level: "Beginner",
            description: "HTML, CSS, JavaScript, and React basics"
        },
        {
            title: "Data Science Essentials",
            duration: "8 weeks",
            level: "Intermediate",
            description: "Python, ML, and data visualization"
        },
        {
            title: "UX/UI Design Mastery",
            duration: "5 weeks",
            level: "Beginner",
            description: "Design thinking, Figma, and user research"
        },
        {
            title: "Advanced JavaScript",
            duration: "4 weeks",
            level: "Advanced",
            description: "ES6+, async programming, and frameworks"
        },
        {
            title: "Mobile App Development",
            duration: "10 weeks",
            level: "Intermediate",
            description: "React Native and cross-platform development"
        }
    ];
}

function getRandomResponse(type) {
    const responses = aiResponses[type] || [''];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateContextualFollowUp(intent) {
    const followUps = {
        'course_inquiry': "Would you like me to create a personalized learning path for you? 🛤️",
        'enrollment': "Shall I help you get started with the enrollment process right now? 🚀",
        'instructor': "Would you like to join our next instructor meet & greet session? 👋",
        'pricing': "Interested in our current promotions? I can share exclusive discount codes! 🎁",
        'certificate': "Want to see examples of student success stories and certificates? 🏆",
        'schedule': "Should I help you find the perfect study schedule that fits your life? ⏰",
        'support': "Is there a specific issue you're facing that I can help resolve? 🔧",
        'recommendation': "Ready to take our quick skills assessment for better recommendations? 📝"
    };
    
    return followUps[intent] || "Is there anything else I can help clarify for you? 😊";
}

function generateSmartSuggestions(input) {
    const suggestionsContainer = document.getElementById('smartSuggestions');
    if (!suggestionsContainer || input.length < 2) {
        clearSmartSuggestions();
        return;
    }
    
    const suggestions = [
        "What courses do you offer?",
        "How much do courses cost?",
        "Who are the instructors?",
        "How do I enroll?",
        "Do you provide certificates?",
        "What's the schedule like?",
        "Can I get help with assignments?",
        "Are there job placement services?"
    ];
    
    const matchingSuggestions = suggestions.filter(function(s) {
        return s.toLowerCase().includes(input.toLowerCase());
    }).slice(0, 3);
    
    suggestionsContainer.innerHTML = matchingSuggestions.map(function(suggestion) {
        return '<div class="suggestion-chip" onclick="applySuggestion(\'' + suggestion + '\')">' + suggestion + '</div>';
    }).join('');
}

function generateFollowUpSuggestions(userMessage) {
    const suggestionsContainer = document.getElementById('smartSuggestions');
    if (!suggestionsContainer) return;
    
    let suggestions = [];
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('course')) {
        suggestions = ["Show me pricing", "Who teaches this?", "How do I enroll?"];
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        suggestions = ["Payment options?", "Any discounts?", "Refund policy?"];
    } else if (lowerMessage.includes('enroll')) {
        suggestions = ["What do I need?", "How long to start?", "Payment methods?"];
    } else {
        suggestions = ["Tell me more", "Show examples", "Next steps?"];
    }
    
    suggestionsContainer.innerHTML = suggestions.map(function(suggestion) {
        return '<div class="suggestion-chip" onclick="applySuggestion(\'' + suggestion + '\')">' + suggestion + '</div>';
    }).join('');
}

function applySuggestion(suggestion) {
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.value = suggestion;
        input.focus();
    }
}

function clearSmartSuggestions() {
    const suggestionsContainer = document.getElementById('smartSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
    }
}

function showUserTyping() {
    const typingElement = document.getElementById('userTyping');
    if (typingElement) {
        typingElement.classList.add('show');
    }
}

function hideUserTyping() {
    const typingElement = document.getElementById('userTyping');
    if (typingElement) {
        typingElement.classList.remove('show');
    }
}

function updateSessionProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = Math.min((messageCount / 10) * 100, 100);
        progressBar.style.width = progress + '%';
    }
}

function updateSatisfactionScore(intent) {
    if (intent !== 'general') {
        userSatisfactionScore += 1;
    }
}

function showNotification(message) {
    const notificationDot = document.getElementById('notificationDot');
    if (notificationDot) {
        notificationDot.style.display = 'block';
        notificationDot.title = message;
    }
}

function hideNotification() {
    const notificationDot = document.getElementById('notificationDot');
    if (notificationDot) {
        notificationDot.style.display = 'none';
    }
}

// Advanced Features
function toggleVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;
    
    isVoiceEnabled = !isVoiceEnabled;
    
    if (isVoiceEnabled) {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        addMessage("🎤 Voice mode activated! You can now speak your messages.", 'bot');
    } else {
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceBtn.style.background = 'rgba(255, 255, 255, 0.15)';
        addMessage("Voice mode deactivated. Back to text messaging! ⌨️", 'bot');
    }
}

function toggleLanguage() {
    const languages = ['en', 'es', 'fr', 'de', 'hi'];
    const currentIndex = languages.indexOf(currentLanguage);
    currentLanguage = languages[(currentIndex + 1) % languages.length];
    
    const langNames = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', hi: 'हिंदी' };
    addMessage('Language switched to ' + langNames[currentLanguage] + '! 🌍', 'bot');
}

function exportChat() {
    const chatData = {
        session: {
            startTime: new Date(sessionStartTime).toISOString(),
            endTime: new Date().toISOString(),
            messageCount: messageCount,
            satisfactionScore: userSatisfactionScore
        },
        messages: chatHistory
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sikshaconnect-chat-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    addMessage("📁 Your chat history has been exported successfully!", 'bot');
}

function clearChat() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = 
            '<div class="message bot welcome-message">' +
                '<div class="message-content">' +
                    'Chat cleared! 🧹 Ready for a fresh start? I\'m here to help you learn and grow!' +
                    '<div class="capabilities-grid">' +
                        '<span class="capability">📚 Course Info</span>' +
                        '<span class="capability">🎓 Enrollment</span>' +
                        '<span class="capability">👨‍🏫 Instructors</span>' +
                        '<span class="capability">💰 Pricing</span>' +
                        '<span class="capability">📜 Certificates</span>' +
                        '<span class="capability">🕒 Schedules</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
        
        chatHistory = [];
        messageCount = 0;
        updateSessionProgress();
    }
}

function rateChatbot() {
    const ratingModal = document.getElementById('ratingModal');
    if (ratingModal) {
        ratingModal.classList.add('show');
    }
}

function setRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(function(star, index) {
        star.classList.toggle('active', index < rating);
    });
    currentRating = rating;
}

function submitRating() {
    const feedback = document.getElementById('feedbackText').value;
    const ratingModal = document.getElementById('ratingModal');
    
    const ratingData = {
        score: currentRating,
        feedback: feedback,
        timestamp: Date.now(),
        sessionData: {
            messageCount: messageCount,
            sessionDuration: Date.now() - sessionStartTime
        }
    };
    
    try {
        localStorage.setItem('chatbot_rating', JSON.stringify(ratingData));
    } catch (e) {
        console.log('Could not save rating');
    }
    
    if (ratingModal) {
        ratingModal.classList.remove('show');
    }
    
    addMessage('Thank you for the ' + currentRating + '-star rating! 🌟 Your feedback helps me improve. Keep learning amazing things! 🚀', 'bot');
    
    // Reset rating for next time
    currentRating = 0;
    const stars = document.querySelectorAll('.star');
    stars.forEach(function(star) {
        star.classList.remove('active');
    });
    document.getElementById('feedbackText').value = '';
}