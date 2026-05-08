// Synergy Brand Architect - Enhanced AI Assistant Widget Integration
// Includes: Draggable float button, Lead onboarding form, Maximize/Minimize toggles, Rate Limiter, and full Mobile Responsiveness.

(function () {
  // Prevent loading on blog pages (to respect informational intent)
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes("blog")) {
    console.log("Synergy AI Support deactivated on blog pages.");
    return;
  }

  // Resilient fallback for CONVEX_URL
  const convexUrl = typeof CONVEX_URL !== "undefined" ? CONVEX_URL : "https://qualified-duck-586.convex.cloud";

  // 1. Premium Styles Injection
  const styles = `
    .synergy-chat-widget {
      position: fixed;
      right: 30px;
      bottom: 30px;
      z-index: 999999;
      font-family: 'Outfit', sans-serif;
      touch-action: none; /* Crucial for custom drag handle handling */
    }

    /* Floating Chat Button */
    .synergy-chat-btn {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff5e14 0%, #ff8a3d 100%);
      box-shadow: 0 10px 30px rgba(255, 94, 20, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      transition: box-shadow 0.3s, transform 0.2s;
      position: relative;
      border: 2px solid rgba(255, 255, 255, 0.15);
      user-select: none;
    }

    .synergy-chat-btn:active {
      cursor: grabbing;
      transform: scale(0.95);
    }

    .synergy-chat-btn i {
      color: #fff;
      font-size: 26px;
      pointer-events: none;
    }

    /* Pulsing animation */
    .synergy-chat-btn::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255, 94, 20, 0.3);
      top: 0;
      left: 0;
      z-index: -1;
      animation: synergy-pulse 2s infinite;
      pointer-events: none;
    }

    @keyframes synergy-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* Chat Window Container */
    .synergy-chat-window {
      position: absolute;
      right: 0px;
      bottom: 80px;
      width: 380px;
      height: 580px;
      background: rgba(17, 17, 17, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 100000;
      transform: scale(0.8) translateY(50px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
      transform-origin: bottom right;
    }

    .synergy-chat-window.active {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Maximized State Styles */
    .synergy-chat-window.maximized {
      position: fixed;
      left: 50% !important;
      top: 50% !important;
      right: auto !important;
      bottom: auto !important;
      width: 800px !important;
      height: 80% !important;
      max-height: 750px !important;
      transform: translate(-50%, -50%) scale(1) !important;
      border-radius: 28px !important;
      transform-origin: center center !important;
    }

    /* Header Bar */
    .synergy-chat-header {
      padding: 18px 20px;
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .synergy-chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .synergy-chat-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff5e14 0%, #333 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      font-size: 16px;
      border: 2px solid rgba(255, 94, 20, 0.4);
      position: relative;
    }

    .synergy-chat-avatar-status {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #00ff66;
      border-radius: 50%;
      bottom: 0;
      right: 0;
      border: 2px solid #1a1a1a;
      box-shadow: 0 0 8px #00ff66;
    }

    .synergy-chat-title h4 {
      margin: 0;
      color: #fff;
      font-size: 14.5px;
      font-weight: 700;
      line-height: 1.2;
    }

    .synergy-chat-title span {
      font-size: 11px;
      color: #00ff66;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
    }

    .synergy-chat-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .synergy-chat-header-btn {
      background: transparent;
      border: none;
      color: #888;
      font-size: 16px;
      cursor: pointer;
      transition: color 0.2s, transform 0.2s;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .synergy-chat-header-btn:hover {
      color: #ff5e14;
      transform: scale(1.15);
    }

    /* Body chat container */
    .synergy-chat-body {
      flex-grow: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: #0d0d0d;
    }

    /* Messages Custom Scrollbar */
    .synergy-chat-body::-webkit-scrollbar {
      width: 6px;
    }
    .synergy-chat-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .synergy-chat-body::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .synergy-chat-body::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 94, 20, 0.4);
    }

    /* Onboarding Lead Form Container */
    .synergy-lead-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 5px 0;
      animation: synergy-fade-in 0.4s ease-out;
      color: #fff;
    }

    .synergy-lead-header h3 {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px 0;
      background: linear-gradient(135deg, #fff 0%, #aaa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .synergy-lead-header p {
      font-size: 12.5px;
      color: #888;
      line-height: 1.5;
      margin: 0;
    }

    .synergy-lead-fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 5px;
    }

    .synergy-lead-input-grp {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .synergy-lead-input-grp label {
      font-size: 11.5px;
      color: #aaa;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .synergy-lead-input {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 11px 14px;
      color: #fff;
      font-size: 13.5px;
      outline: none;
      transition: all 0.3s;
    }

    .synergy-lead-input:focus {
      border-color: #ff5e14;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 8px rgba(255, 94, 20, 0.2);
    }

    .synergy-lead-submit {
      background: linear-gradient(135deg, #ff5e14 0%, #ff8a3d 100%);
      border: none;
      border-radius: 14px;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 13px;
      cursor: pointer;
      margin-top: 8px;
      box-shadow: 0 8px 20px rgba(255, 94, 20, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .synergy-lead-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(255, 94, 20, 0.45);
    }

    /* Message Bubbles */
    .synergy-message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.5;
      color: #fff;
      word-wrap: break-word;
      animation: synergy-fade-in 0.3s ease-out;
    }

    @keyframes synergy-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .synergy-message.system {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.05);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .synergy-message.user {
      background: linear-gradient(135deg, #ff5e14 0%, #ff7e33 100%);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 15px rgba(255, 94, 20, 0.2);
    }

    /* Custom content styles */
    .synergy-message ul { margin: 8px 0; padding-left: 18px; }
    .synergy-message li { margin-bottom: 4px; }
    .synergy-message p { margin: 0 0 8px 0; }
    .synergy-message p:last-child { margin-bottom: 0; }
    .synergy-message strong { color: #ffaa66; font-weight: 700; }

    /* Suggested Quick Prompts */
    .synergy-suggestions-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
      align-self: flex-start;
      width: 100%;
    }

    .synergy-suggestions-title {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .synergy-suggestion-btn {
      background: rgba(255, 94, 20, 0.08);
      border: 1px solid rgba(255, 94, 20, 0.15);
      color: #ff8c42;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      text-align: left;
    }

    .synergy-suggestion-btn:hover {
      background: rgba(255, 94, 20, 0.15);
      border-color: #ff5e14;
      color: #fff;
      transform: translateX(4px);
    }

    /* Input Footer */
    .synergy-chat-footer {
      padding: 15px 20px;
      background: rgba(10, 10, 10, 0.98);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .synergy-chat-input-wrapper {
      flex-grow: 1;
      position: relative;
    }

    .synergy-chat-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 16px;
      padding: 12px 16px;
      padding-right: 45px;
      color: #fff;
      font-size: 13.5px;
      outline: none;
      transition: all 0.3s;
    }

    .synergy-chat-input::placeholder {
      color: #666;
    }

    .synergy-chat-input:focus {
      border-color: #ff5e14;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 10px rgba(255, 94, 20, 0.15);
    }

    .synergy-chat-send-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #ff5e14 0%, #ff8a3d 100%);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .synergy-chat-send-btn:hover {
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 0 8px rgba(255, 94, 20, 0.4);
    }

    /* Typing indicators */
    .synergy-typing-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 18px;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      margin-top: 5px;
    }

    .synergy-typing-dot {
      width: 6px;
      height: 6px;
      background-color: #ff8c42;
      border-radius: 50%;
      animation: synergy-bounce 1.4s infinite ease-in-out both;
    }

    .synergy-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .synergy-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes synergy-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    /* Responsive Mobile Screen Optimization */
    @media (max-width: 500px) {
      .synergy-chat-window {
        position: fixed !important;
        right: 0px !important;
        bottom: 0px !important;
        left: 0px !important;
        top: 0px !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        border-radius: 0px !important;
        border: none !important;
        z-index: 1000000 !important;
        transform: scale(0.9) translateY(100px) !important;
        transform-origin: center bottom !important;
      }
      .synergy-chat-window.active {
        transform: scale(1) translateY(0) !important;
      }
      .synergy-chat-window.maximized {
        width: 100% !important;
        height: 100% !important;
        transform: none !important;
        border-radius: 0px !important;
      }
      .synergy-chat-btn {
        width: 58px;
        height: 58px;
        box-shadow: 0 8px 25px rgba(255, 94, 20, 0.4);
      }
      .synergy-chat-widget {
        right: 20px;
        bottom: 20px;
      }
    }
  `;

  // Inject CSS Styles
  const styleEl = document.createElement("style");
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);

  // State Management
  let chatHistory = [];
  let isDragging = false;
  let hasActiveLead = localStorage.getItem("synergy_lead_collected") === "true";
  let leadData = hasActiveLead ? JSON.parse(localStorage.getItem("synergy_lead_data") || "{}") : null;
  let freeMessagesCount = 0;
  let leadCaptureState = "IDLE"; // IDLE, ASKING_NAME, ASKING_PHONE, ASKING_EMAIL, ASKING_CITY
  let tempLeadData = { name: "", phone: "", email: "", city: "" };

  // Initialize widget container
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "synergy-chat-widget";
  widgetContainer.id = "synergy-chat-widget";

  // Initialize inner body with the interactive welcome bubble directly
  let innerBodyHtml = renderSystemWelcomeBubble();
  widgetContainer.innerHTML = `
    <!-- Draggable circular floating button -->
    <div class="synergy-chat-btn" id="synergy-chat-btn">
      <i class="fa-solid fa-comments"></i>
    </div>

    <!-- Chat expandable window frame -->
    <div class="synergy-chat-window" id="synergy-chat-window">
      <!-- Header -->
      <div class="synergy-chat-header" id="synergy-chat-header">
        <div class="synergy-chat-header-info">
          <div class="synergy-chat-avatar">
            S
            <div class="synergy-chat-avatar-status"></div>
          </div>
          <div class="synergy-chat-title">
            <h4>Synergy Support</h4>
            <span>Online • Active Assistant</span>
          </div>
        </div>
        <div class="synergy-chat-actions">
          <button class="synergy-chat-header-btn" id="synergy-chat-reset-btn" title="Reset Conversation">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="synergy-chat-header-btn" id="synergy-chat-max-btn" title="Maximize">
            <i class="fa-regular fa-window-maximize"></i>
          </button>
          <button class="synergy-chat-header-btn" id="synergy-chat-close-btn" title="Minimize">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Scrollable Message Body -->
      <div class="synergy-chat-body" id="synergy-chat-body">
        ${innerBodyHtml}
      </div>

      <!-- Text Input Area -->
      <div id="synergy-turnstile-container"></div>
      <div class="synergy-chat-footer" id="synergy-chat-footer">
        <div class="synergy-chat-input-wrapper">
          <input type="text" class="synergy-chat-input" id="synergy-chat-input" placeholder="Type a message..." autocomplete="off">
          <button class="synergy-chat-send-btn" id="synergy-chat-send-btn">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  // Inject Cloudflare Turnstile API
  const tsScript = document.createElement("script");
  tsScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  tsScript.async = true;
  tsScript.defer = true;
  document.head.appendChild(tsScript);
  
  let turnstileToken = "";
  let turnstileWidgetId = null;

  window.synergyTurnstileCallback = function(token) {
    turnstileToken = token;
  };

  tsScript.onload = () => {
    turnstileWidgetId = turnstile.render('#synergy-turnstile-container', {
      sitekey: '0x4AAAAAADLkBcPiHfMzH6xM',
      callback: function(token) {
        turnstileToken = token;
      },
      'error-callback': function() {
        console.error("Turnstile error");
      }
    });
  };

  // Selector mappings
  const chatBtn = document.getElementById("synergy-chat-btn");
  const chatWindow = document.getElementById("synergy-chat-window");
  const closeBtn = document.getElementById("synergy-chat-close-btn");
  const maxBtn = document.getElementById("synergy-chat-max-btn");
  const resetBtn = document.getElementById("synergy-chat-reset-btn");
  const chatBody = document.getElementById("synergy-chat-body");
  const chatInput = document.getElementById("synergy-chat-input");
  const sendBtn = document.getElementById("synergy-chat-send-btn");
  const chatFooter = document.getElementById("synergy-chat-footer");

  // Draggable Physics Engine (Mouse and Touch support)
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;

  chatBtn.addEventListener("mousedown", startDrag);
  chatBtn.addEventListener("touchstart", startDrag, { passive: true });

  function startDrag(e) {
    // If we're clicking with secondary buttons, ignore
    if (e.type === "mousedown" && e.button !== 0) return;

    isDragging = false; // Reset drag status initially
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    const rect = widgetContainer.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    document.addEventListener("mousemove", performDrag);
    document.addEventListener("touchmove", performDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function performDrag(e) {
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    // Minimum distance threshold to register as drag instead of tap
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging = true;
      if (e.cancelable) e.preventDefault();

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Bound checking boundaries
      newLeft = Math.max(10, Math.min(newLeft, viewportWidth - 75));
      newTop = Math.max(10, Math.min(newTop, viewportHeight - 75));

      widgetContainer.style.right = "auto";
      widgetContainer.style.bottom = "auto";
      widgetContainer.style.left = newLeft + "px";
      widgetContainer.style.top = newTop + "px";

      // Dynamically reposition the expandable chat window based on which half of screen the button rests
      if (newLeft < viewportWidth / 2) {
        chatWindow.style.right = "auto";
        chatWindow.style.left = "0px";
        chatWindow.style.transformOrigin = "bottom left";
      } else {
        chatWindow.style.left = "auto";
        chatWindow.style.right = "0px";
        chatWindow.style.transformOrigin = "bottom right";
      }
    }
  }

  function endDrag() {
    document.removeEventListener("mousemove", performDrag);
    document.removeEventListener("touchmove", performDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  // Toggle Minimize/Activate Chat Frame on Float Click
  chatBtn.addEventListener("click", (e) => {
    // Prevent toggling window if we just finished a drag movement
    if (isDragging) {
      isDragging = false;
      return;
    }

    chatWindow.classList.toggle("active");
    const icon = chatBtn.querySelector("i");
    if (chatWindow.classList.contains("active")) {
      icon.className = "fa-solid fa-comment-dots";
      if (hasActiveLead) {
        chatInput.focus();
      }
    } else {
      icon.className = "fa-solid fa-comments";
    }
  });

  // Minimize Window via Header Close X
  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("active");
    chatBtn.querySelector("i").className = "fa-solid fa-comments";
  });

  // Toggle Maximize screen space coverage
  maxBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("maximized");
    const maxIcon = maxBtn.querySelector("i");
    if (chatWindow.classList.contains("maximized")) {
      maxIcon.className = "fa-regular fa-window-restore";
      maxBtn.title = "Restore";
    } else {
      maxIcon.className = "fa-regular fa-window-maximize";
      maxBtn.title = "Maximize";
    }
    scrollToBottom();
  });

  // Reset Conversation to original welcome state and clear active lead flags for immediate testing
  resetBtn.addEventListener("click", () => {
    // 1. Clear lead collected variables from local storage
    localStorage.removeItem("synergy_lead_collected");
    localStorage.removeItem("synergy_lead_data");
    
    // 2. Reset local Javascript state variables
    hasActiveLead = false;
    leadData = null;
    freeMessagesCount = 0;
    leadCaptureState = "IDLE";
    tempLeadData = { name: "", phone: "", email: "", city: "" };
    chatHistory = [];
    
    // 3. Reset welcome bubble inside chat body
    chatBody.innerHTML = renderSystemWelcomeBubble();
    
    // 4. Reset input and restore footer
    chatFooter.style.display = "flex";
    chatInput.value = "";
    
    // Add a quick feedback animation to the reset button icon
    const resetIcon = resetBtn.querySelector("i");
    resetIcon.classList.add("fa-spin");
    setTimeout(() => {
      resetIcon.classList.remove("fa-spin");
    }, 500);

    scrollToBottom();
  });

  // Helper to validate genuine mobile numbers (Option 1 - Custom RegEx & Patterns)
  function validateMobileNumber(phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 1. Must be exactly 10 digits
    if (cleanPhone.length !== 10) {
      return { isValid: false, message: "Please enter a valid 10-digit mobile number." };
    }

    // 2. Must start with 6, 7, 8, or 9 (Indian telecom standard)
    const firstDigit = cleanPhone[0];
    if (!["6", "7", "8", "9"].includes(firstDigit)) {
      return { isValid: false, message: "Mobile number must start with 6, 7, 8, or 9." };
    }

    // 3. Block repetitive digits (e.g., 9999999999, 0000000000)
    if (/^(.)\1{9}$/.test(cleanPhone)) {
      return { isValid: false, message: "This mobile number appears to be invalid or fake." };
    }

    // 4. Block obvious sequential patterns (e.g., 1234567890, 9876543210, 0123456789)
    if (cleanPhone === "1234567890" || cleanPhone === "9876543210" || cleanPhone === "0123456789") {
      return { isValid: false, message: "Please enter a genuine mobile number. Sequential patterns are not allowed." };
    }

    // 5. Block repetitive sub-patterns (e.g., 9876598765, 1234512345)
    if (cleanPhone.slice(0, 5) === cleanPhone.slice(5)) {
      return { isValid: false, message: "Please enter a genuine, unique mobile number." };
    }

    return { isValid: true };
  }

  // (Note: Static HTML forms are completely removed. We now prioritize a 100% natural, conversational AI messaging intake.)

  // Rate Limiter logic (Client-side localStorage guard)
  // Max 10 messages per hour to protect DeepSeek API from spam attacks
  function verifyRateLimit() {
    const now = Date.now();
    const rawLimit = localStorage.getItem("synergy_chat_rate_limit");
    let limitData = rawLimit ? JSON.parse(rawLimit) : { count: 0, resetTime: now + 3600000 };

    // Reset rate limiter window if reset hour expired
    if (now > limitData.resetTime) {
      limitData = { count: 0, resetTime: now + 3600000 };
    }

    if (limitData.count >= 10) {
      return false; // User has exceeded limits
    }

    limitData.count++;
    localStorage.setItem("synergy_chat_rate_limit", JSON.stringify(limitData));
    return true; // Limit verification passed!
  }

  // Core Send/Receive Messaging system
  async function handleSend() {
    const query = chatInput.value.trim();
    if (!query) return;

    chatInput.value = "";

    // 1. Conversational Lead Collection State Machine
    if (!hasActiveLead && leadCaptureState !== "IDLE") {
      // Append User's answer bubble
      appendBubble(query, "user");

      if (leadCaptureState === "ASKING_NAME") {
        let inputName = query.trim();
        
        // Strip common conversational prefixes to extract pure name
        const prefixRegex = /^(?:my\s+name\s+is|i\s+am|i'm|this\s+is|mera\s+naam\s+hai|mera\s+naam|myself|hello|hi|hey|yo)\s+/i;
        inputName = inputName.replace(prefixRegex, "").trim();

        // Keywords that suggest the user is asking a business question rather than giving their name
        const invalidKeywords = ["website", "commerce", "shop", "service", "work", "grow", "show", "price", "budget", "cost", "how", "what", "why", "who", "where", "development", "design", "marketing", "seo", "app", "software"];
        const containsInvalidKeyword = invalidKeywords.some(keyword => inputName.toLowerCase().includes(keyword));
        
        // Reject names with digits, special characters, invalid keywords, or improper length
        const isValidName = /^[a-zA-Z\s]{2,35}$/.test(inputName) && !containsInvalidKeyword;

        if (!isValidName) {
          const dots = showTypingIndicator();
          setTimeout(() => {
            dots.remove();
            appendBubble(`Arey, please aage badhne se pehle apna sahi naam (**Name**) enter karein, taaki main aapko personally assist kar sakoon! 😊`, "system");
          }, 800);
          return;
        }

        // Format name to Title Case (e.g. "rahul kumar" -> "Rahul Kumar")
        tempLeadData.name = inputName.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

        const dots = showTypingIndicator();
        setTimeout(() => {
          dots.remove();
          appendBubble(`Aapka swagat hai, **${tempLeadData.name}**! 😊\n\nAapki business enquiry register karne aur is discussion ko save karne ke liye, please apna **10-digit mobile number** share karein.`, "system");
          leadCaptureState = "ASKING_PHONE";
        }, 1200);
        return;
      }

      if (leadCaptureState === "ASKING_PHONE") {
        const phoneMatch = query.replace(/[^0-9]/g, "");
        if (phoneMatch.length !== 10) {
          const dots = showTypingIndicator();
          setTimeout(() => {
            dots.remove();
            appendBubble(`Arey **${tempLeadData.name}**, lagta hai ye number galat hai. Please ek valid **10-digit mobile number** (e.g., 9525230232) enter karein taaki hum aapse coordinate kar sakein! 📱`, "system");
          }, 800);
          return;
        }

        // Advanced validation checklist (pattern matching check)
        const validation = validateMobileNumber(phoneMatch);
        if (!validation.isValid) {
          const dots = showTypingIndicator();
          setTimeout(() => {
            dots.remove();
            appendBubble(`Arey **${tempLeadData.name}**, ${validation.message} Please ek real business contact number share karein!`, "system");
          }, 800);
          return;
        }

        tempLeadData.phone = phoneMatch;

        const dots = showTypingIndicator();
        setTimeout(() => {
          dots.remove();
          appendBubble(`Dhanyawad, **${tempLeadData.name}**! 🌟\n\nAb please apna **Email Address** enter karein taaki main portfolio link aur details aapko mail kar sakoon.`, "system");
          leadCaptureState = "ASKING_EMAIL";
        }, 1200);
        return;
      }

      if (leadCaptureState === "ASKING_EMAIL") {
        const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (!emailMatch) {
          const dots = showTypingIndicator();
          setTimeout(() => {
            dots.remove();
            appendBubble(`Arey **${tempLeadData.name}**, please ek valid email id enter karein (e.g., name@company.com) taaki hum portfolio documents bhej sakein! ✉️`, "system");
          }, 800);
          return;
        }
        tempLeadData.email = emailMatch[0];

        const dots = showTypingIndicator();
        setTimeout(() => {
          dots.remove();
          appendBubble(`Perfect! 🗺️\n\nLast question—Aap kis **City** se belongs karte hain (e.g., Patna, Delhi, Ranchi)?`, "system");
          leadCaptureState = "ASKING_CITY";
        }, 1200);
        return;
      }

      if (leadCaptureState === "ASKING_CITY") {
        tempLeadData.city = query;
        const dots = showTypingIndicator();

        try {
          // 1. Generate premium sales-focused chat summary via Convex HTTP Action API
          let summaryVal = "No summary generated.";
          try {
            const summaryResp = await fetch(`${convexUrl}/api/run/chat/summarizeChat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                args: { history: chatHistory },
                format: "json"
              })
            });
            if (summaryResp.ok) {
              const summaryJson = await summaryResp.json();
              summaryVal = summaryJson.value || "No summary generated.";
            }
          } catch (e) {
            console.error("Error fetching chat summary:", e);
          }

          // 2. Format complete conversation transcript
          const transcriptVal = chatHistory.map(msg => `${msg.role === "user" ? "Client" : "Synergy AI"}: ${msg.content}`).join("\n\n");

          // 3. Push complete lead details with summary and transcript to Convex database
          await mutationToConvex("leads/addLead", {
            name: tempLeadData.name,
            email: tempLeadData.email,
            phone: tempLeadData.phone,
            subject: "AI Support Conversational Onboarding",
            message: `Lead collected via 100% conversational AI chat flow. City: ${tempLeadData.city}.`,
            chatSummary: summaryVal,
            chatTranscript: transcriptVal,
          });

          // Commit registration state
          leadData = tempLeadData;
          localStorage.setItem("synergy_lead_collected", "true");
          localStorage.setItem("synergy_lead_data", JSON.stringify(leadData));
          hasActiveLead = true;
          leadCaptureState = "IDLE";

          setTimeout(() => {
            dots.remove();
            appendBubble(`Great, **${tempLeadData.name}** from **${tempLeadData.city}**! ✓ Aapki details successfully safe and secure register ho gayi hain.\n\nHamara conversation ab poori tarah se unlocked hai! Aap Synergy ki high-converting marketing campaigns, premium designs aur rates ke baare me bejhijhak pooch sakte hain. 🚀`, "system");
          }, 1200);
        } catch (err) {
          console.error("Convex inline save error:", err);
          // Gracefully unlock anyway for premium feel
          leadData = tempLeadData;
          localStorage.setItem("synergy_lead_collected", "true");
          localStorage.setItem("synergy_lead_data", JSON.stringify(leadData));
          hasActiveLead = true;
          leadCaptureState = "IDLE";
          setTimeout(() => {
            dots.remove();
            appendBubble(`Great, **${tempLeadData.name}**! Hamari chat unlocked ho chuki hai. Aap core services ke baare me kuch bhi aage pooch sakte hain! 🚀`, "system");
          }, 1200);
        }
        return;
      }
    }

    // 2. Standard Message Submission Flow
    appendBubble(query, "user");

    // Rate Limiter Guard verification
    if (!verifyRateLimit()) {
      appendBubble(
        "**System Warning:** Dost, aapne is ghante ki free chat usage limit (10 queries/hour) exceed kar di hai. Spam aur misuse se bachne ke liye ye ceiling lagayi gayi hai. 🔒\n\nAap directly humare WhatsApp/Call support ya [Contact Page](contact.html) par humein reach out kar sakte hain!",
        "system"
      );
      return;
    }

    if (!turnstileToken) {
      appendBubble("**System:** Security check chal raha hai. Kripya 2-3 second wait karke dobara message bhejein, ya page refresh karein.", "system");
      return;
    }

    const typingDots = showTypingIndicator();

    try {
      const endpoint = `${convexUrl}/api/run/chat/ask`;

      // Call the live deployed cloud Convex HTTP Action
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          args: {
            message: query,
            history: chatHistory,
            turnstileToken: turnstileToken,
          },
          format: "json",
        }),
      });

      // Reset Turnstile token
      if (turnstileWidgetId !== null) {
        turnstileToken = "";
        turnstile.reset(turnstileWidgetId);
      }

      typingDots.remove();

      if (!response.ok) {
        throw new Error("Convex connection non-ok");
      }

      const resJson = await response.json();
      const assistantReply = resJson.value;

      if (assistantReply) {
        appendBubble(assistantReply, "system");

        // Maintain convo history
        chatHistory.push({ role: "user", content: query });
        chatHistory.push({ role: "assistant", content: assistantReply });

        // Keep rolling history buffer to 20 messages maximum to conserve tokens
        if (chatHistory.length > 20) {
          chatHistory = chatHistory.slice(-20);
        }

        // 3. Conversational lead gate trigger after the user receives their FIRST AI answer
        if (!hasActiveLead && leadCaptureState === "IDLE") {
          setTimeout(() => {
            const dots = showTypingIndicator();
            setTimeout(() => {
              dots.remove();
              appendBubble("Bohot hi badhiya question! 😊\n\nAage ki custom digital pricing, package list aur quotes discuss karne se pehle, kya main aapka subh naam (**Name**) jaan sakta hoon?", "system");
              leadCaptureState = "ASKING_NAME";
            }, 1000);
          }, 2000);
        }
      } else {
        appendBubble("Arey, lagta hai servers thode busy hain. Ek baar dobara send karein please!", "system");
      }
    } catch (err) {
      console.error("AI assistant API error:", err);
      typingDots.remove();
      appendBubble("Aksma karein! Network drop hone ki wajah se request process nahi ho saki. Please check your internet connection and try again.", "system");
    }
  }

  // Click quick suggestion helper hook
  window.sendSynergyAIQuery = function (queryStr) {
    chatInput.value = queryStr;
    handleSend();
    // Hide standard suggestions block on query submission
    const suggestionBlock = document.getElementById("synergy-suggestions");
    if (suggestionBlock) {
      suggestionBlock.style.display = "none";
    }
  };

  // Helper template strings
  function renderSystemWelcomeBubble() {
    const personalizedGreeting = leadData && leadData.name
      ? `Aapka swagat hai, **${leadData.name}**! 🌟`
      : "Aapka swagat hai! 🌟";

    const content = `${personalizedGreeting} Main Synergy Support Assistant hoon. Aapki kya madad kar sakta hoon?`;

    return `
      <div class="synergy-message system">
        ${parseMarkdown(content)}
      </div>
    `;
  }

  // Messaging Utility Helpers
  function appendBubble(text, role) {
    const bubble = document.createElement("div");
    bubble.className = `synergy-message ${role}`;
    bubble.innerHTML = parseMarkdown(text);
    chatBody.appendChild(bubble);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const wrapper = document.createElement("div");
    wrapper.className = "synergy-typing-indicator";
    wrapper.innerHTML = `
      <div class="synergy-typing-dot"></div>
      <div class="synergy-typing-dot"></div>
      <div class="synergy-typing-dot"></div>
    `;
    chatBody.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Pure Vanilla Markdown parser for rich formatted lists, bold text and custom links
  function parseMarkdown(mdText) {
    if (!mdText) return "";
    let html = mdText;

    // Headings (using multiline anchors and safe RGB style tags to prevent regex feedback loop)
    html = html.replace(/^###\s*(.*)$/gm, '<strong style="color: rgb(255, 94, 20); display: block; margin-top: 10px; font-size: 14px;">$1</strong>');
    html = html.replace(/^##\s*(.*)$/gm, '<strong style="color: rgb(255, 94, 20); display: block; margin-top: 12px; font-size: 15px;">$1</strong>');
    html = html.replace(/^#\s*(.*)$/gm, '<strong style="color: rgb(255, 94, 20); display: block; margin-top: 14px; font-size: 16px;">$1</strong>');

    // Line break & paragraph wrappers
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    // Bold pattern: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Bullet points: - point -> <li>point</li>
    html = html.replace(/^\-\s(.*)$/gm, "<li>$1</li>");

    // Hyperlinks: [label](href) -> anchor tag
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #ff8c42; text-decoration: underline; font-weight: bold;" target="_blank">$1</a>');

    return `<p>${html}</p>`
      .replace(/<p><li>/g, "<ul><li>")
      .replace(/<\/li><br>/g, "</li>")
      .replace(/<\/li><\/p>/g, "</li></ul>");
  }

  // Form submission keyboard listeners
  sendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // Proactive Sales Agent - Programmatic Auto-Open with Session Storage Check
  function initAutoOpenSalesAgent() {
    const currentPath = window.location.pathname.toLowerCase();
    
    // Blog and News page exclusion (blog.html, blog-details.html, news-grid.html, news-details.html)
    const isBlogOrNewsPage = currentPath.includes("blog") || currentPath.includes("news");
    if (isBlogOrNewsPage) {
      console.log("[Sales Agent] Excluded page detected, disabling auto-open popup.");
      return;
    }

    // Session check: only open once per browser tab session to keep experience premium
    const hasAutoOpened = sessionStorage.getItem("synergy_chat_auto_opened") === "true";
    if (hasAutoOpened) {
      return;
    }

    // Set premium 4-second delay after page loads
    setTimeout(() => {
      // Re-evaluate in case they navigated quickly
      const freshOpened = sessionStorage.getItem("synergy_chat_auto_opened") === "true";
      if (freshOpened) return;

      sessionStorage.setItem("synergy_chat_auto_opened", "true");
      
      // Open the chat programmatically
      if (!chatWindow.classList.contains("active")) {
        chatWindow.classList.add("active");
        chatBtn.querySelector("i").className = "fa-solid fa-comment-dots";
        if (hasActiveLead) {
          chatInput.focus();
        }
        scrollToBottom();
      }
    }, 4000);
  }

  initAutoOpenSalesAgent();
})();
