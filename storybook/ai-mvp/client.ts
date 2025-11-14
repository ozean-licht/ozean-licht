// This script gets injected into Storybook preview iframe
(function() {
  // Prevent double injection
  if ((window as any).__AI_ITERATE_INJECTED__) return;
  (window as any).__AI_ITERATE_INJECTED__ = true;

  // Create floating button
  const button = document.createElement('button');
  button.innerHTML = '✨ AI';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(135deg, #0ec2bc 0%, #0a9d98 100%);
    color: white;
    border: none;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(14, 194, 188, 0.4);
    transition: all 0.2s ease;
  `;

  button.onmouseenter = () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 20px rgba(14, 194, 188, 0.6)';
  };
  button.onmouseleave = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(14, 194, 188, 0.4)';
  };

  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 15, 26, 0.85);
    backdrop-filter: blur(8px);
    z-index: 100000;
    align-items: center;
    justify-content: center;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #1A1F2E;
    border: 1px solid #0ec2bc;
    border-radius: 12px;
    padding: 32px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 0 40px rgba(14, 194, 188, 0.3);
  `;

  modalContent.innerHTML = `
    <h3 style="color: white; margin: 0 0 16px 0; font-family: Montserrat, sans-serif;">AI Iterate Component</h3>
    <p style="color: #94A3B8; margin: 0 0 16px 0; font-size: 14px;">Describe what changes you want to make to this component.</p>
    <textarea
      id="ai-prompt"
      placeholder="e.g., Make the button 20% larger and add a glass morphism effect"
      style="
        width: 100%;
        height: 120px;
        background: #0A0F1A;
        color: white;
        border: 1px solid #0ec2bc;
        border-radius: 8px;
        padding: 12px;
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        resize: vertical;
        outline: none;
      "
    ></textarea>
    <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
      <button
        id="ai-cancel"
        style="
          padding: 10px 20px;
          background: transparent;
          color: #94A3B8;
          border: 1px solid #94A3B8;
          border-radius: 6px;
          cursor: pointer;
          font-family: Montserrat, sans-serif;
          font-weight: 500;
        "
      >Cancel</button>
      <button
        id="ai-iterate"
        style="
          padding: 10px 20px;
          background: #0ec2bc;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: Montserrat, sans-serif;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(14, 194, 188, 0.3);
        "
      >✨ Iterate</button>
    </div>
    <div
      id="ai-status"
      style="
        margin-top: 16px;
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
        font-family: Montserrat, sans-serif;
        display: none;
      "
    ></div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(button);
  document.body.appendChild(modal);

  // Modal handlers
  const showModal = () => {
    modal.style.display = 'flex';
    (document.getElementById('ai-prompt') as HTMLTextAreaElement)?.focus();
  };

  const hideModal = () => {
    modal.style.display = 'none';
    (document.getElementById('ai-prompt') as HTMLTextAreaElement).value = '';
    const status = document.getElementById('ai-status')!;
    status.style.display = 'none';
  };

  const showStatus = (message: string, type: 'loading' | 'success' | 'error') => {
    const status = document.getElementById('ai-status')!;
    status.style.display = 'block';
    status.textContent = message;

    if (type === 'loading') {
      status.style.background = 'rgba(14, 194, 188, 0.1)';
      status.style.color = '#0ec2bc';
      status.style.border = '1px solid rgba(14, 194, 188, 0.3)';
    } else if (type === 'success') {
      status.style.background = 'rgba(34, 197, 94, 0.1)';
      status.style.color = '#22c55e';
      status.style.border = '1px solid rgba(34, 197, 94, 0.3)';
    } else {
      status.style.background = 'rgba(239, 68, 68, 0.1)';
      status.style.color = '#ef4444';
      status.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }
  };

  // Button click handler
  button.onclick = showModal;

  // Cancel button
  document.getElementById('ai-cancel')!.onclick = hideModal;

  // Click outside to close
  modal.onclick = (e) => {
    if (e.target === modal) hideModal();
  };

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  // Use capture phase to intercept before Storybook's search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showModal();
    }
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      e.preventDefault();
      hideModal();
    }
  }, true); // Use capture phase!

  // Iterate button handler
  document.getElementById('ai-iterate')!.onclick = async () => {
    const prompt = (document.getElementById('ai-prompt') as HTMLTextAreaElement).value.trim();
    if (!prompt) {
      showStatus('Please enter a prompt', 'error');
      return;
    }

    try {
      showStatus('AI is analyzing and updating your component...', 'loading');

      // Get current story context from Storybook
      const storyData = (window as any).__STORYBOOK_PREVIEW__?.currentSelection;
      if (!storyData) {
        showStatus('No story selected. Please view a component first.', 'error');
        return;
      }

      // Try to determine component path from story
      const storyId = storyData.storyId;
      const componentName = storyId.split('--')[0].replace(/-/g, '');

      // Search likely component locations (paths will be resolved server-side)
      const searchPaths = [
        `shared/ui/src/ui/${componentName}.tsx`,
        `shared/ui/src/components/${componentName}.tsx`,
        `apps/admin/components/ui/${componentName}.tsx`,
      ];

      // Try each path until we find the component
      let componentPath = '';
      let currentCode = '';

      for (const path of searchPaths) {
        try {
          const getResponse = await fetch('/__ai-get-component', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ componentPath: path })
          });

          const getResult = await getResponse.json();

          if (getResult.success) {
            componentPath = path;
            currentCode = getResult.code;
            break;
          }
        } catch {
          // Try next path
          continue;
        }
      }

      if (!componentPath || !currentCode) {
        showStatus(`Component file not found: ${componentName}.tsx. Tried: ${searchPaths.join(', ')}`, 'error');
        return;
      }

      // Call our Vite plugin endpoint (same origin - no CORS!)
      const response = await fetch('/__ai-iterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentPath,
          currentCode,
          prompt
        })
      });

      const result = await response.json();

      if (result.success) {
        showStatus('✓ Component updated! Changes will appear in ~1 second via HMR.', 'success');
        setTimeout(hideModal, 2000);
      } else {
        showStatus(`Error: ${result.error}`, 'error');
      }

    } catch (error: any) {
      showStatus(`Error: ${error.message}`, 'error');
    }
  };
})();
