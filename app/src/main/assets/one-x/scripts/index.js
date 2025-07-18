document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());

const drawer = document.getElementById("registerDrawer");
const handle = document.getElementById("registerHandle");
const iframe = document.getElementById("registerIframe");
let pad;

iframe.addEventListener('load', () => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  pad = iframeDoc.getElementById('keyboard-padding');
});

let isOpen = false;
let timer;
let inputFocusedY = 0;
let input_ = null;
let screenHeightJs = window.innerHeight;
let ratio;
let estimatedkeyboardH;
let keyboardYTop;
var excludedInputsAutoScroll = ['checkbox', 'date', 'file'];
let isTyping = false;
let typingTimer;

function openDrawer() {
  drawer.style.transform = "translateY(0%)";
  iframe.style.display = "block";
  isOpen = true;
}

function closeDrawer() {
  drawer.style.transform = "translateY(calc(100% - 9vh))";
  setTimeout(() => {
    iframe.style.display = "none";
  }, 300);
  isOpen = false;
}

handle.addEventListener("touchstart", () => {
  timer = setTimeout(() => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, 500); // long click = 500ms
});

handle.addEventListener("touchend", () => clearTimeout(timer));
window.onViewHeight = function(keyboardHeightJava, screenHeightJava, statusBarHeight) {
  pad.style.height = "20vh";
  ratio = screenHeightJava / screenHeightJs;
  estimatedkeyboardH = keyboardHeightJava / ratio;
  keyboardYTop = (screenHeightJs - estimatedkeyboardH - statusBarHeight);
  const rect = input_.getBoundingClientRect();
  inputFocusedY = rect.bottom;
  setTimeout(() => {
    if (keyboardYTop < inputFocusedY) {
      if (input_ != null) {
        input_.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, 350);
};

function onKeyboardClosed() {
  pad.style.height = "0";
}

function showToast(message, duration = 3000) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "5vh";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "1.8vh 3.6vh";
  toast.style.borderRadius = "1vh";
  toast.style.boxShadow = "0 0.4vh 1.8vh rgba(0,0,0,0.3)";
  toast.style.zIndex = "9999";
  toast.style.fontFamily = "sans-serif";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";
  
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });
  
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function attachInputFocus() {
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("focus", () => {
      const input_type = el.type;
      if (!excludedInputsAutoScroll.includes(input_type)) {
        input_ = el;
      } else {
        input_ = null;
      }
    });
  });
  
  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.querySelectorAll("input").forEach((el) => {
        el.addEventListener("focus", () => {
          const input_type = el.type;
          if (!excludedInputsAutoScroll.includes(input_type)) {
            input_ = el;
          } else {
            input_ = null;
          }
        });
      });
    } catch (e) {
      console.error("Erreur iframe:", e);
    }
  });
}
attachInputFocus();

function enableNextInputOnEnter() {
  function attachEnterKey(inputs) {
    inputs.forEach((el, i) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const next = inputs[i + 1];
          if (next) {
            next.focus();
          } else {
            el.blur();
          }
        }
      });
      el.addEventListener('focus', () => {
        const rect = el.getBoundingClientRect();
        inputFocusedY = rect.bottom;
        const input_type = el.type;
        setTimeout(() => {
          if (keyboardYTop < inputFocusedY) {
            if (!excludedInputsAutoScroll.includes(input_type)) {
              el.scrollIntoView({ block: "center", behavior: "smooth" });
            } else {
              input_ = null;
            }
          }
        }, 350);
      });
    });
  }
  
  const mainInputs = document.querySelectorAll('input');
  attachEnterKey(mainInputs);
  
  iframe.addEventListener('load', () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeInputs = doc.querySelectorAll('input');
      attachEnterKey(iframeInputs);
    } catch (e) {
      console.error('Erreur iframe:', e);
    }
  });
}
enableNextInputOnEnter();

function monitorTyping(doc) {
  doc.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
      const rect = el.getBoundingClientRect();
      inputFocusedY = rect.bottom;
      isTyping = true;
      setTimeout(() => {
        if (keyboardYTop < inputFocusedY) {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }, 350);
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        isTyping = false;
      }, 1000);
    });
  });
}

monitorTyping(document);
iframe.addEventListener('load', () => {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    monitorTyping(iframeDoc);
  } catch (e) {
    console.error("Erreur accès iframe :", e);
  }
});