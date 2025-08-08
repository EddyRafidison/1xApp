document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());

//Show message : App.showMessage(msg, status);

const drawer = document.getElementById("registerDrawer");
const handle = document.getElementById("registerHandle");
const iframe = document.getElementById("registerIframe");
let pad;

iframe.addEventListener("load", () => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  pad = iframeDoc.getElementById("keyboard-padding");
});

let isOpen = false;
let isMainDocument = true;
let timer;
let inputFocusedY = 0;
let input_ = null;
let screenHeightJs = window.innerHeight;
let ratio;
let estimatedkeyboardH;
let keyboardYTop;
var excludedInputsAutoScroll = ["checkbox", "date", "file"];
let isTyping = false;
let typingTimer;
let lastFocusedMain;
let JsonLocale;

window.addEventListener("message", (e) => {
  try {
    JsonLocale = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
    localStorage.setItem("locale", JSON.stringify(JsonLocale));
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (JsonLocale.main[key]) {
        if ("placeholder" in el) {
          el.placeholder = JsonLocale.main[key];
        } else {
          el.textContent = JsonLocale.main[key];
        }
      }
    });
  } catch (err) {
    console.error("Failed to parse locale JSON", err);
  }
});

function openDrawer() {
  drawer.style.transform = "translateY(0%)";
  iframe.style.display = "block";
  isOpen = true;
  isMainDocument = false;
}

function closeDrawer() {
  drawer.style.transform = "translateY(calc(100% - 4em))";
  setTimeout(() => {
    iframe.style.display = "none";
  }, 300);
  isOpen = false;
  isMainDocument = true;
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
window.onViewHeight = function (
  keyboardHeightJava,
  screenHeightJava,
  statusNavBarHeight
) {
  if (input_ != null) {
    ratio = screenHeightJava / screenHeightJs;
    estimatedkeyboardH = keyboardHeightJava / ratio;
    keyboardYTop = screenHeightJs - estimatedkeyboardH - statusNavBarHeight;
    const rect = input_.getBoundingClientRect();
    inputFocusedY = rect.bottom;
    if (keyboardYTop < inputFocusedY) {
      pad.style.height = "10vh";
      setTimeout(() => {
        input_.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 350);
    }
  }
};

function onKeyboardClosed() {
  pad.style.height = "0";
  if (isMainDocument == true) {
    lastFocusedMain.scrollIntoView({ block: "end", behavior: "smooth" });
  }
}

function attachInputFocus() {
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("focus", () => {
      const input_type = el.type;
      lastFocusedMain = el;
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
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const next = inputs[i + 1];
          if (next) {
            next.focus();
          } else {
            el.blur();
          }
        }
      });
      el.addEventListener("focus", () => {
        const rect = el.getBoundingClientRect();
        inputFocusedY = rect.bottom;
        const input_type = el.type;
        if (isMainDocument == true) {
          lastFocusedMain = el;
        }
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

  const mainInputs = document.querySelectorAll("input");
  attachEnterKey(mainInputs);

  iframe.addEventListener("load", () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeInputs = doc.querySelectorAll("input");
      attachEnterKey(iframeInputs);
    } catch (e) {
      console.error("Erreur iframe:", e);
    }
  });
}
enableNextInputOnEnter();

function monitorTyping(doc) {
  doc.querySelectorAll("input").forEach((el) => {
    el.addEventListener("input", () => {
      const rect = el.getBoundingClientRect();
      inputFocusedY = rect.bottom;
      isTyping = true;
      setTimeout(() => {
        if (keyboardYTop < inputFocusedY) {
          if (!excludedInputsAutoScroll.includes(el.type)) {
            el.scrollIntoView({ block: "center", behavior: "smooth" });
          }
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
iframe.addEventListener("load", () => {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    monitorTyping(iframeDoc);
  } catch (e) {
    console.error("Erreur accès iframe :", e);
  }
});
