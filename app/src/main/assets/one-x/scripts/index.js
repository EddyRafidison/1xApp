document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());

const drawer = document.getElementById("registerDrawer");
const handle = document.getElementById("registerHandle");
const iframe = document.getElementById("registerIframe");

let isOpen = false;
let timer;
let inputFocusedY = 0;
let input_;
let screenHeightJs = window.innerHeight;
let ratio;
let estimatedkeyboardH;
let keyboardYTop;

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
window.onViewHeight = function (keyboardHeightJava, screenHeightJava) {
  ratio = screenHeightJava / screenHeightJs;
  estimatedkeyboardH = keyboardHeightJava/ratio;
  keyboardYTop = (screenHeightJs - estimatedkeyboardH);
  const rect = input_.getBoundingClientRect();
  inputFocusedY = rect.bottom;
  setTimeout(() => {
    if(keyboardYTop < inputFocusedY){
        input_.scrollIntoView({ block: "center", behavior: "smooth" });
      }}, 350);
};
function onKeyboardClosed(){

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
  // Principal document
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("focus", () => {
      input_ = el;
    });
  });

  // Iframe
  const iframe = document.querySelector("iframe");
  if (!iframe) return;

  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.querySelectorAll("input").forEach((el) => {
        el.addEventListener("focus", () => {
          input_ = el;
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
        setTimeout(() => {
        if(keyboardYTop < inputFocusedY){
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }}, 350);
      });
    });
  }

  // Principal document
  const mainInputs = document.querySelectorAll('input');
  attachEnterKey(mainInputs);

  // Iframe
  const iframe = document.querySelector('iframe');
  if (iframe) {
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
}
enableNextInputOnEnter();
