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
    
    // Fermer le drawer
    function closeDrawer() {
        navDrawer.classList.remove('open');
        overlay.classList.remove('visible');
    }
    
    // Fermer en cliquant sur un item ou à l'extérieur
    overlay.addEventListener('click', closeDrawer);
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Enlève la sélection précédente
            navItems.forEach(i => i.classList.remove('active'));
            // Ajoute la sélection à l'item cliqué
            this.classList.add('active');
            closeDrawer();
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