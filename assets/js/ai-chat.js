/* ── Double Eight AI Chat Widget ── */
(function () {
  // API key is now stored securely in Vercel environment variables

  const SYSTEM_PROMPT = `You are a helpful assistant for Double Eight, a premium creative agency. 
You help visitors learn about the agency's services (branding, web design, digital marketing, photography), 
answer questions about pricing, projects, and how to get in touch. 
Be concise, professional, and friendly. Keep responses short (2-4 sentences max). 
If asked about specific pricing, say pricing depends on the project scope and invite them to contact the team.`;

  // ── Inject CSS ──
  const style = document.createElement('style');
  style.textContent = `
    .ai-chat-btn {
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, #d4af37, #b8960c);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(212,175,55,.5);
      transition: transform .3s, box-shadow .3s;
      flex-shrink: 0; position: relative;
      animation: aiPulse 3s ease-in-out infinite;
    }
    .ai-chat-btn:hover { transform: scale(1.12); box-shadow: 0 8px 32px rgba(212,175,55,.7); animation: none; }
    .ai-chat-btn svg { width: 24px; height: 24px; fill: #fff; }
    @keyframes aiPulse { 0%,100%{box-shadow:0 4px 20px rgba(212,175,55,.5);} 50%{box-shadow:0 6px 30px rgba(212,175,55,.8);} }

    .ai-chat-label {
      background: rgba(10,10,10,.88); backdrop-filter: blur(8px);
      color: #fff; font-size: .72rem; padding: .4rem .9rem;
      border-radius: 99px; white-space: nowrap;
      opacity: 0; transform: translateX(-8px);
      transition: all .3s; pointer-events: none;
      font-family: var(--font-body, sans-serif);
    }
    .ai-chat-bubble-wrap:hover .ai-chat-label { opacity: 1; transform: translateX(0); }
    .ai-chat-bubble-wrap { display: flex; align-items: center; gap: .6rem; }

    .ai-chat-window {
      position: fixed; bottom: 6.5rem; left: 2rem; z-index: 10000;
      width: 320px; max-height: 480px;
      background: #0f0f0f; border: 1px solid rgba(212,175,55,.25);
      border-radius: 16px; display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,.7);
      transform: scale(0.85) translateY(20px); opacity: 0;
      pointer-events: none;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s;
      font-family: var(--font-body, sans-serif);
    }
    .ai-chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .ai-chat-header {
      padding: .9rem 1rem; border-bottom: 1px solid rgba(212,175,55,.15);
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(212,175,55,.06); border-radius: 16px 16px 0 0;
    }
    .ai-chat-header-info { display: flex; align-items: center; gap: .6rem; }
    .ai-chat-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg,#d4af37,#b8960c);
      display: flex; align-items: center; justify-content: center;
    }
    .ai-chat-avatar svg { width: 16px; height: 16px; fill: #fff; }
    .ai-chat-title { color: #d4af37; font-size: .82rem; font-weight: 600; letter-spacing: .04em; }
    .ai-chat-subtitle { color: rgba(255,255,255,.45); font-size: .68rem; }
    .ai-chat-close {
      background: none; border: none; cursor: pointer; padding: .3rem;
      color: rgba(255,255,255,.5); transition: color .2s; line-height: 1;
    }
    .ai-chat-close:hover { color: #d4af37; }
    .ai-chat-messages {
      flex: 1; overflow-y: auto; padding: .8rem;
      display: flex; flex-direction: column; gap: .6rem;
      scrollbar-width: thin; scrollbar-color: rgba(212,175,55,.2) transparent;
    }
    .ai-msg {
      max-width: 85%; padding: .55rem .8rem;
      border-radius: 12px; font-size: .8rem; line-height: 1.5; color: #e8e8e8;
    }
    .ai-msg.bot { background: rgba(255,255,255,.07); align-self: flex-start; border-radius: 4px 12px 12px 12px; }
    .ai-msg.user {
      background: linear-gradient(135deg,rgba(212,175,55,.25),rgba(184,150,12,.2));
      border: 1px solid rgba(212,175,55,.2);
      align-self: flex-end; border-radius: 12px 4px 12px 12px; color: #f5e6b2;
    }
    .ai-msg.typing { color: rgba(255,255,255,.4); font-style: italic; }
    .ai-chat-input-row {
      padding: .7rem; border-top: 1px solid rgba(212,175,55,.1);
      display: flex; gap: .5rem; align-items: flex-end;
    }
    .ai-chat-input {
      flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(212,175,55,.2);
      border-radius: 10px; padding: .5rem .7rem;
      color: #fff; font-size: .8rem; font-family: inherit;
      resize: none; outline: none; transition: border-color .2s;
      min-height: 36px; max-height: 90px; line-height: 1.4;
    }
    .ai-chat-input::placeholder { color: rgba(255,255,255,.3); }
    .ai-chat-input:focus { border-color: rgba(212,175,55,.5); }
    .ai-chat-send {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg,#d4af37,#b8960c);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: opacity .2s, transform .2s;
    }
    .ai-chat-send:hover { opacity: .85; transform: scale(1.08); }
    .ai-chat-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }
    .ai-chat-send svg { width: 16px; height: 16px; fill: #fff; }
    @media (max-width: 480px) {
      .ai-chat-window { width: calc(100vw - 2rem); left: 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ──
  const wrap = document.createElement('div');
  wrap.className = 'ai-chat-bubble-wrap';
  wrap.innerHTML = `
    <button class="ai-chat-btn" id="aiChatToggle" aria-label="Open AI Chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    </button>
    <span class="ai-chat-label">Ask AI</span>
  `;

  const chatWindow = document.createElement('div');
  chatWindow.className = 'ai-chat-window';
  chatWindow.id = 'aiChatWindow';
  chatWindow.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-chat-header-info">
        <div class="ai-chat-avatar">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div>
          <div class="ai-chat-title">Double Eight AI</div>
          <div class="ai-chat-subtitle">Always here to help</div>
        </div>
      </div>
      <button class="ai-chat-close" id="aiChatClose" aria-label="Close chat">✕</button>
    </div>
    <div class="ai-chat-messages" id="aiChatMessages">
      <div class="ai-msg bot">👋 Hi! I'm the Double Eight AI assistant. Ask me anything about our services, projects, or how to get started!</div>
    </div>
    <div class="ai-chat-input-row">
      <textarea class="ai-chat-input" id="aiChatInput" placeholder="Type a message..." rows="1"></textarea>
      <button class="ai-chat-send" id="aiChatSend" aria-label="Send">
        <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  // ── Inject into .wa-bubble ──
  const waBubble = document.querySelector('.wa-bubble');
  if (waBubble) {
    waBubble.appendChild(wrap);
  } else {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;bottom:2rem;left:2rem;z-index:9999;display:flex;align-items:center;gap:.6rem;';
    container.appendChild(wrap);
    document.body.appendChild(container);
  }
  document.body.appendChild(chatWindow);

  // ── Logic ──
  const toggle = document.getElementById('aiChatToggle');
  const closeBtn = document.getElementById('aiChatClose');
  const messagesEl = document.getElementById('aiChatMessages');
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');

  let isOpen = false;
  let history = [];
  let isLoading = false;

  function openChat() { isOpen = true; chatWindow.classList.add('open'); input.focus(); }
  function closeChat() { isOpen = false; chatWindow.classList.remove('open'); }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    input.style.height = 'auto';
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    const typing = addMessage('Typing…', 'bot typing');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: history
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t get a response. Please try again.';
      history.push({ role: 'assistant', content: reply });
      typing.remove();
      addMessage(reply, 'bot');
    } catch (e) {
      typing.remove();
      addMessage('Connection error. Please try again.', 'bot');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });
})();
