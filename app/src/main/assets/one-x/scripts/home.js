document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("copy", (e) => e.preventDefault());
    document.addEventListener("paste", (e) => e.preventDefault());
    
    const right_drawer = document.querySelector('.right-drawer');
    const rd_overlay = document.querySelector('.right-drawer-overlay');
    const iframe = document.getElementById("homeIframe");
    
    let pad;
    let inputFocusedY = 0;
    let input_ = null;
    let screenHeightJs = window.innerHeight;
    let ratio;
    let estimatedkeyboardH;
    let keyboardYTop;
    var excludedInputsAutoScroll = ['checkbox', 'date', 'file'];
    let isTyping = false;
    let typingTimer;
    let JsonLocale = JSON.parse(localStorage.getItem("locale"));
    
    window.addEventListener("load", (e) => {
        try {
            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (JsonLocale.main[key]) {
                    if ("placeholder" in el) { el.placeholder = JsonLocale.main[key]; }
                    else { el.textContent = JsonLocale.main[key]; }
                }
            });
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                if (JsonLocale.main[key]) {
                    el.innerHTML = JsonLocale.main[key];
                }
            });
            
        } catch (err) {
            console.error("Failed to parse locale JSON", err);
        }
    });
    
    iframe.addEventListener('load', () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        pad = iframeDoc.getElementById('keyboard-padding2');
    });
    
    // Navigation Drawer
    const navDrawer = document.getElementById('navDrawer');
    const menuButton = document.getElementById('menuButton');
    const overlay = document.getElementById('overlay');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Notification Panel
    const notificationButton = document.getElementById('notificationButton');
    const notificationPanel = document.getElementById('notificationPanel');
    
    // Tab Selection
    const tabOptions = document.querySelectorAll('.tab-option');
    const tabIframe = document.getElementById('tabIframe');
    
    // Ouvrir le drawer
    menuButton.addEventListener('click', () => {
        navDrawer.classList.add('open');
        overlay.classList.add('visible');
    });
    
    window.onViewHeight = function(keyboardHeightJava, screenHeightJava, statusNavBarHeight) {
        if (input_ != null) {
            pad.style.height = "20vh";
            ratio = screenHeightJava / screenHeightJs;
            estimatedkeyboardH = keyboardHeightJava / ratio;
            keyboardYTop = ((screenHeightJs - estimatedkeyboardH) - statusNavBarHeight);
            const rect = input_.getBoundingClientRect();
            inputFocusedY = rect.bottom;
            setTimeout(() => {
                if (keyboardYTop < inputFocusedY) {
                    input_.scrollIntoView({ block: "center", behavior: "smooth" });
                    
                }
            }, 350);
        }
    };
    
    function onKeyboardClosed() {
        pad.style.height = "0";
    }
    
    function closeDrawer() {
        navDrawer.classList.remove('open');
        overlay.classList.remove('visible');
    }
    
    function attachInputFocus() {
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
    iframe.addEventListener('load', () => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            monitorTyping(iframeDoc);
        } catch (e) {
            console.error("Erreur accès iframe :", e);
        }
    });
    // Fermer en cliquant sur un item ou à l'extérieur
    overlay.addEventListener('click', closeDrawer);
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Enlève la sélection précédente
            navItems.forEach(i => i.classList.remove('active'));
            // Ajoute la sélection à l'item cliqué
            this.classList.add('active');
            closeDrawer();
            const it = item.textContent;
            if (it.includes(JsonLocale.main['set_pswd'])) {
                openRDrawer("mpswd.html");
            } else if (it.includes(JsonLocale.main['set_sp'])) {
                
            } else if (it.includes(JsonLocale.main['quit_device'])) {
                
            } else if (it.includes(JsonLocale.main['delete_acc'])) {
                
            } else if (it.includes(JsonLocale.main['mail_us'])) {
                
            } else if (it.includes(JsonLocale.main['terms'])) {
                
            } else {
                //privacy
            }
        });
    });
    
    // Gestion des notifications
    notificationButton.addEventListener('click', () => {
        notificationPanel.classList.toggle('open');
    });
    
    // Fermer les notifications en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!notificationButton.contains(e.target) && !notificationPanel.contains(e.target)) {
            notificationPanel.classList.remove('open');
        }
    });
    
    // Sélection des onglets
    tabOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Enlève la sélection précédente
            tabOptions.forEach(opt => opt.classList.remove('active'));
            // Ajoute la sélection à l'onglet cliqué
            this.classList.add('active');
            
            // Change l'iframe en fonction de l'onglet (simulation)
            const tab = this.getAttribute('data-tab');
            switch (tab) {
                case 'activities':
                    tabIframe.srcdoc = `
                            <!DOCTYPE html>
                            <html>
                            <head><title>Activités</title></head>
                            <body style="display:flex; justify-content:center; align-items:center; height:100%; font-family:Arial, sans-serif; background:#f0f5ff;">
                                <div style="text-align:center; color:#2196F3;">
                                    <i class="fas fa-chart-line" style="font-size:48px; margin-bottom:16px;"></i>
                                    <h2>Tableau des Activités</h2>
                                    <p>Historique de vos transactions récentes</p>
                                </div>
                            </body>
                            </html>
                        `;
                    break;
                case 'buy':
                    tabIframe.srcdoc = `
                            <!DOCTYPE html>
                            <html>
                            <head><title>Acheter</title></head>
                            <body style="display:flex; justify-content:center; align-items:center; height:100%; font-family:Arial, sans-serif; background:#f0fff4;">
                                <div style="text-align:center; color:#4CAF50;">
                                    <i class="fas fa-shopping-cart" style="font-size:48px; margin-bottom:16px;"></i>
                                    <h2>Zone d'Achat</h2>
                                    <p>Parcourez les offres disponibles</p>
                                </div>
                            </body>
                            </html>
                        `;
                    break;
                case 'sell':
                    tabIframe.srcdoc = `
                            <!DOCTYPE html>
                            <html>
                            <head><title>Vendre</title></head>
                            <body style="display:flex; justify-content:center; align-items:center; height:100%; font-family:Arial, sans-serif; background:#fff8f0;">
                                <div style="text-align:center; color:#FF9800;">
                                    <i class="fas fa-tag" style="font-size:48px; margin-bottom:16px;"></i>
                                    <h2>Zone de Vente</h2>
                                    <p>Créez vos offres de vente</p>
                                </div>
                            </body>
                            </html>
                        `;
                    break;
            }
        });
    });
    
    // Initialiser l'iframe avec l'onglet Activités
    tabOptions[0].click();
    
    function openRDrawer(htmlSrc) {
        iframe.src = 'mpswd.html';
        right_drawer.classList.add('open');
        rd_overlay.classList.add('active');
    }
    
    function closeRDrawer() {
        right_drawer.classList.remove('open');
        rd_overlay.classList.remove('active');
    }
    
    rd_overlay.addEventListener('click', closeRDrawer);
});