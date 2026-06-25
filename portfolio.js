const panels = document.querySelectorAll(".panel");
const menuButton = document.querySelector(".menu-btn");
const closeMenuButton = document.querySelector(".close-menu-btn");
const menuOverlay = document.querySelector(".menu-overlay");
const sidebarMenu = document.querySelector(".sidebar-menu");
const menuLinks = document.querySelectorAll(".sidebar-nav a");

const openMenu = () => {
  document.body.classList.add("menu-open");
  menuButton.setAttribute("aria-expanded", "true");
  sidebarMenu.setAttribute("aria-hidden", "false");
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  sidebarMenu.setAttribute("aria-hidden", "true");
};

panels.forEach((panel) => {
  panel.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      panels.forEach((p) => p.classList.remove("active"));
      panel.classList.add("active");
    }
  });

  panel.addEventListener("click", () => {
    panels.forEach((p) => p.classList.remove("active"));
    panel.classList.add("active");
  });
});

if (menuButton && closeMenuButton && menuOverlay && sidebarMenu) {
  menuButton.addEventListener("click", openMenu);
  closeMenuButton.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const chatWidget = document.querySelector(".chat-widget");
const chatToggleBtn = document.querySelector(".chat-toggle-btn");
const chatCloseBtn = document.querySelector(".chat-close-btn");
const chatPanel = document.querySelector(".chat-panel");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-messages");

const botReplies = {
  greeting: "Hi there! I'm Ashish's portfolio assistant. Ask me about my skills, projects, or contact details.",
  help: "Try asking about my projects, experience, tools, or how to reach me.",
  project: "I build responsive web apps with React, Node.js, Express, and MongoDB.",
  contact: "You can email me at ashishdwivedi7654321@gmail.com or call +91 964 860 8732.",
  resume: "I'm open to internships, freelance work, and full stack roles with modern JavaScript stacks.",
  experience: "I enjoy building production-ready web apps, APIs, and database-backed services using modern JS.",
  default: "Thanks for reaching out! I'm a quick portfolio helper, so feel free to ask about my work, tools, or contact details.",
};

const quickReplies = [
  { label: "Projects", text: "Tell me about your projects." },
  { label: "Experience", text: "What is your experience?" },
  { label: "Contact", text: "How can I reach you?" },
  { label: "Help", text: "Help me explore your portfolio." },
];

const addChatMessage = (text, sender, { announce = false } = {}) => {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  if (sender === "bot") {
    message.setAttribute("aria-live", "polite");
  }
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (announce) {
    message.setAttribute("role", "status");
  }
};

const addTypingIndicator = () => {
  const typing = document.createElement("div");
  typing.className = "message bot typing-indicator";
  typing.innerHTML = `<span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span>`;
  typing.dataset.typing = "true";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
};

const removeTypingIndicator = () => {
  const typing = chatMessages.querySelector(".typing-indicator");
  if (typing) typing.remove();
};

const renderQuickReplies = () => {
  const replyContainer = document.querySelector(".chat-quick-replies");
  if (!replyContainer) return;
  replyContainer.innerHTML = "";
  quickReplies.forEach((reply) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-quick-reply-btn";
    button.textContent = reply.label;
    button.addEventListener("click", () => {
      handleQuickReply(reply.text);
    });
    replyContainer.appendChild(button);
  });
};

const getBotReply = (text) => {
  const normalized = text.toLowerCase();
  if (normalized.includes("hello") || normalized.includes("hi")) return botReplies.greeting;
  if (normalized.includes("project") || normalized.includes("work") || normalized.includes("app")) return botReplies.project;
  if (normalized.includes("resume") || normalized.includes("experience") || normalized.includes("intern")) return botReplies.experience;
  if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("call")) return botReplies.contact;
  if (normalized.includes("help")) return botReplies.help;
  return botReplies.default;
};

const sendChatMessage = (messageText) => {
  if (!chatInput || !messageText.trim()) return;
  addChatMessage(messageText, "user");
  chatInput.value = "";
  const typingNode = addTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    addChatMessage(getBotReply(messageText), "bot", { announce: true });
    chatInput?.focus();
  }, 550);
};

const handleQuickReply = (text) => {
  if (!chatWidget?.classList.contains("open")) {
    openChat();
  }
  sendChatMessage(text);
};

const openChat = () => {
  if (!chatWidget) return;
  chatWidget.classList.add("open");
  chatToggleBtn?.setAttribute("aria-expanded", "true");
  chatPanel?.setAttribute("aria-hidden", "false");
  if (chatMessages && chatMessages.children.length === 0) {
    addChatMessage("Hi! Need help exploring my portfolio? Ask me anything.", "bot", { announce: true });
  }
  renderQuickReplies();
  chatInput?.focus();
};

const closeChat = () => {
  if (!chatWidget) return;
  chatWidget.classList.remove("open");
  chatToggleBtn?.setAttribute("aria-expanded", "false");
  chatPanel?.setAttribute("aria-hidden", "true");
};

chatToggleBtn?.addEventListener("click", () => {
  if (chatWidget?.classList.contains("open")) {
    closeChat();
  } else {
    openChat();
  }
});

chatCloseBtn?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!chatInput || !chatInput.value.trim()) return;
  sendChatMessage(chatInput.value.trim());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeChat();
    closeMenu();
  }
});
