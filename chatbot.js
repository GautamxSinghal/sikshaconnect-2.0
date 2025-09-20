// SikshaConnect 2.0 - AI Chatbot Assistant

// Chatbot state
let chatHistory = [];
const maxChatHistory = 5;
let chatbotInitialized = false;

// Initialize Chatbot
function initChatbot() {
    if (chatbotInitialized) return;
    
    // Create chatbot HTML structure
    const chatbotContainer = document.getElementById('chatbot-container');
    if (!chatbotContainer) return;
    
    chatbotContainer.innerHTML = `
        <!-- Chatbot Toggle Button -->
        <button class="chatbot-toggle" onclick="toggleChatbot()">
            <i class="fas fa-robot"></i>
        </button>

        <!-- Chatbot Window -->
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <div>
                    <strong><i class="fas fa-robot"></i> AI Study Assistant</strong>
                    <div style="font-size: 0.9rem; opacity: 0.8;">Here to help with your learning!</div>
                </div>
                <button class="chatbot-close" onclick="toggleChatbot()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot">
                    Hello! I'm your AI Study Assistant. I can help you with information about our courses, enrollment process, and instructors. How can I assist you today?
                </div>
                <div class="quick-actions">
                    <button class="quick-action" onclick="sendQuickMessage('What courses do you offer?')">
                        Available Courses
                    </button>
                    <button class="quick-action" onclick="sendQuickMessage('How can I enroll?')">
                        Enrollment Guide
                    </button>
                    <button class="quick-action" onclick="sendQuickMessage('Who are the instructors?')">
                        Meet Instructors
                    </button>
                </div>
            </div>
            
            <div class="chatbot-input-container">
                <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message...">
                <button class="chatbot-send" onclick="sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add chatbot styles
    addChatbotStyles();
    
    // Add event listeners
    setupChatbotEventListeners();
    
    chatbotInitialized = true;
}

// Add Chatbot Styles
function addChatbotStyles() {
    if (document.getElementById('chatbot-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'chatbot-styles';
    style.textContent = `
        /* Chatbot Styles */
        .chatbot-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            z-index: 1001;
        }

        .chatbot-toggle:hover {
            background: var(--secondary-color);
            transform: scale(1.1);
        }

        .chatbot-window {
            position: fixed;
            bottom: 100px;
            right: 2rem;
            width: 350px;
            height: 500px;
            background: var(--surface-color);
            border-radius: 1rem;
            box-shadow: var(--shadow-hover);
            z-index: 1002;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        .chatbot-window.show {
            display: flex;
            animation: slideUp 0.3s ease;
        }

        .chatbot-header {
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
        }

        .chatbot-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .message {
            max-width: 80%;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            word-wrap: break-word;
        }

        .message.user {
            background: var(--primary-color);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 0.3rem;
        }

        .message.bot {
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            align-self: flex-start;
            border-bottom-left-radius: 0.3rem;
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            border-bottom-left-radius: 0.3rem;
            align-self: flex-start;
            max-width: 80%;
        }

        .typing-dots {
            display: flex;
            gap: 0.2rem;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--text-muted);
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        .chatbot-input-container {
            padding: 1rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 1rem;
        }

        .chatbot-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            background: var(--bg-color);
            color: var(--text-color);
        }

        .chatbot-send {
            padding: 0.75rem 1rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
        }

        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }

        .quick-action {
            padding: 0.5rem 1rem;
            background: var(--primary-color)20;
            color: var(--primary-color);
            border: 1px solid var(--primary-color)40;
            border-radius: 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .quick-action:hover {
            background: var(--primary-color);
            color: white;
        }

        @media (max-width: 768px) {
            .chatbot-window {
                width: calc(100vw - 2rem);
                right: 1rem;
                left: 1rem;
            }

            .chatbot-toggle {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Setup Event Listeners
function setupChatbotEventListeners() {
    // Enter key support
    const chatInput = document.getElementById('chatbotInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        const chatWindow = document.getElementById('chatbotWindow');
        const chatToggle = document.querySelector('.chatbot-toggle');
        
        if (chatWindow && chatToggle && chatWindow.classList.contains('show') && 
            !chatWindow.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            chatWindow.classList.remove('show');
        }
    });
}

// Chatbot Functions
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    if (!chatWindow) return;
    
    chatWindow.classList.toggle('show');
    
    // Focus input when opening
    if (chatWindow.classList.contains('show')) {
        setTimeout(() => {
            const input = document.getElementById('chatbotInput');
            if (input) input.focus();
        }, 300);
    }
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Add to chat history
        chatHistory.push({ role: 'user', content: message });
        if (chatHistory.length > maxChatHistory) {
            chatHistory.shift();
        }
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process response
        setTimeout(() => {
            hideTypingIndicator();
            processMessage(message);
        }, 1500);
    }
}

function sendQuickMessage(message) {
    addMessage(message, 'user');
    
    // Add to chat history
    chatHistory.push({ role: 'user', content: message });
    if (chatHistory.length > maxChatHistory) {
        chatHistory.shift();
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        processMessage(message);
    }, 1500);
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = content;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span>AI Assistant is typing</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function processMessage(message) {
    let response = '';
    const lowerMessage = message.toLowerCase();
    
    // Course-related queries
    if (lowerMessage.includes('course') || lowerMessage.includes('what courses')) {
        const courses = Array.from(document.querySelectorAll('.course-title')).map(title => title.textContent);
        if (courses.length > 0) {
            response = `We offer these amazing courses:\n\n${courses.map(course => `• ${course}`).join('\n')}\n\nEach course is designed with hands-on projects and expert instruction. Would you like to know more about any specific course?`;
        } else {
            response = `We offer a wide range of courses including:\n\n• Web Development Fundamentals\n• Data Science Essentials\n• Digital Design Mastery\n• Mobile App Development\n• AI & Machine Learning\n• Digital Marketing Strategy\n\nVisit our Courses page to see all available options!`;
        }
    }
    // Enrollment queries
    else if (lowerMessage.includes('enroll') || lowerMessage.includes('how to join') || lowerMessage.includes('sign up')) {
        response = `Here's how to enroll in our courses:\n\n1️⃣ Browse our course catalog\n2️⃣ Select your preferred course\n3️⃣ Create your free account\n4️⃣ Complete the enrollment form\n5️⃣ Start learning immediately!\n\nWe offer flexible payment plans and financial aid for eligible students. Ready to begin your learning journey?`;
    }
    // Instructor queries
    else if (lowerMessage.includes('instructor') || lowerMessage.includes('teacher') || lowerMessage.includes('who teaches')) {
        const team = Array.from(document.querySelectorAll('.team-name')).map(name => name.textContent);
        if (team.length > 0) {
            response = `Our expert instructors include:\n\n${team.map(member => `• ${member}`).join('\n')}\n\nAll our instructors are industry professionals with years of experience and a passion for teaching. You can learn more about them on our About Us page!`;
        } else {
            response = `Our expert team includes:\n\n• Dr. Sarah Chen - Founder & CEO\n• Mark Rodriguez - CTO\n• Priya Sharma - Head of Student Experience\n• Dr. James Wilson - Director of Curriculum\n\nAll our instructors are industry professionals with extensive teaching experience!`;
        }
    }
    // Pricing queries
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
        response = `Our courses are designed to be affordable and accessible:\n\n💰 Individual courses: $49-199\n📦 Course bundles: Up to 40% savings\n🎓 Full program access: $299/year\n💳 Financial aid available\n🆓 Free trial lessons\n\nWe believe quality education should be accessible to everyone. Contact us to discuss payment options!`;
    }
    // Certificate queries
    else if (lowerMessage.includes('certificate') || lowerMessage.includes('certification')) {
        response = `Yes! Upon successful completion of any course, you'll receive:\n\n🏆 Official SikshaConnect Certificate\n📊 Detailed skill assessment report\n🔗 LinkedIn-sharable credentials\n📱 Digital badge for social profiles\n\nOur certificates are recognized by leading employers and can help advance your career!`;
    }
    // Support queries
    else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
        response = `I'm here to help! Our support team is available:\n\n🕐 24/7 Chat support (that's me!)\n📧 Email: hello@sikshaconnect.org\n📞 Phone: +1 (234) 567-8900\n💬 Community forums\n📚 Comprehensive help center\n\nWhat specific issue can I help you resolve?`;
    }
    // General greeting
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = `Hello there! 👋 Welcome to SikshaConnect! I'm your AI Study Assistant, and I'm excited to help you on your learning journey.\n\nI can help you with:\n• Course information and recommendations\n• Enrollment process\n• Instructor details\n• Technical support\n• General questions\n\nWhat would you like to know more about?`;
    }
    // Default response
    else {
        response = `I understand you're asking about "${message}". While I may not have specific information about that topic, I'd be happy to help you with:\n\n📚 Course details and recommendations\n✏️ Enrollment process\n👨‍🏫 Information about our instructors\n💡 Learning tips and support\n📞 Contact information\n\nIs there anything specific I can help clarify for you?`;
    }
    
    // Add bot response to chat history
    chatHistory.push({ role: 'bot', content: response });
    if (chatHistory.length > maxChatHistory) {
        chatHistory.shift();
    }
    
    addMessage(response, 'bot');
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});