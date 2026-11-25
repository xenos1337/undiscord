import initUI from './undiscord-ui.js';

function start() {
  try {
    initUI();
    console.log('[UNDISCORD] UI loaded.');
  } catch (err) {
    console.error('[UNDISCORD] Failed to start:', err);
  }
}

// make sure Discord's root element exists before mounting
if (document.querySelector('#app-mount')) start();
else {
  const iv = setInterval(() => {
    if (document.querySelector('#app-mount')) { clearInterval(iv); start(); }
  }, 500);
}
