document.addEventListener('DOMContentLoaded', () => {

    // --- PROTECCIÓN IMÁGENES ROTAS (Reemplazo de onerror) ---
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.classList.add('hidden-img');
        });
    });

    // --- FUNCIÓN DE SEGURIDAD PARA URLS ---
    function safeUrl(url) {
        if (!url) return '#';
        try {
            const u = new URL(url);
            return (u.protocol === 'https:' || u.protocol === 'http:') ? url : '#';
        } catch (e) {
            return '#';
        }
    }

    // --- AVISO LEGAL MODAL ---
    const legalOverlay = document.getElementById('legal-modal-overlay');
    const btnAcceptLegal = document.getElementById('btn-accept-legal');
    
    if (sessionStorage.getItem('aviso_legal_aceptado') === 'true') {
        if(legalOverlay) legalOverlay.style.display = 'none';
    } else {
        document.body.classList.add('hidden-scroll');
    }

    if (btnAcceptLegal) {
        btnAcceptLegal.addEventListener('click', () => {
            sessionStorage.setItem('aviso_legal_aceptado', 'true');
            legalOverlay.style.display = 'none';
            document.body.classList.remove('hidden-scroll');
        });
    }

    // --- REGISTRO PWA ---
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => console.log('SW registrado'))
                .catch(error => console.log('Error SW:', error));
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBtn) installBtn.style.display = 'block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') installBtn.style.display = 'none';
                deferredPrompt = null;
            }
        });
    }

    // --- NAVEGACIÓN Y MENÚ ---
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if(dropdownToggle) {
        dropdownToggle.addEventListener('click', () => dropdownMenu.classList.toggle('show-dropdown'));
    }

    window.addEventListener('click', (e) => {
        if (!e.target.matches('#dropdown-toggle') && !e.target.closest('.dropdown')) {
            if(dropdownMenu) dropdownMenu.classList.remove('show-dropdown');
        }
    });

    function navigate(sectionId) {
        document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        document.querySelectorAll('.dropdown-content button').forEach(btn => btn.classList.remove('active-nav'));
        let navBtn = document.getElementById('nav-' + sectionId);
        if(navBtn) navBtn.classList.add('active-nav');
        else if (sectionId === 'rcp' || sectionId === 'atragantamiento') {
            let navPaux = document.getElementById('nav-paux');
            if(navPaux) navPaux.classList.add('active-nav');
        }

        if(dropdownMenu) dropdownMenu.classList.remove('show-dropdown');
        if (sectionId === 'mapa' && map) setTimeout(() => map.invalidateSize(), 300);
        window.scrollTo(0, 0);
    }

    const routes = {
        'nav-inicio': 'inicio', 'nav-mochila': 'mochila', 'nav-plan333': 'plan333', 
        'nav-mapa': 'mapa', 'nav-paux': 'paux', 'pc-mochila': 'mochila', 
        'pc-plan333': 'plan333', 'pc-mapa': 'mapa', 'pc-paux': 'paux', 
        'pc-rcp': 'rcp', 'pc-atra': 'atragantamiento', 'back-rcp': 'paux', 'back-atra': 'paux'
    };

    for (const [id, target] of Object.entries(routes)) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => navigate(target));
    }

    // --- MODO OSCURO ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    if (isDark && darkModeToggle) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerText = '☀️';
    }

    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const darkActive = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', darkActive);
            darkModeToggle.innerText = darkActive ? '☀️' : '🌙';
        });
    }

    // --- MOCHILA ---
    const checkboxes = document.querySelectorAll('#mochila input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resetBtn = document.getElementById('reset-btn');

    function updateProgress() {
        const total = checkboxes.length;
        const checkedCount = document.querySelectorAll('#mochila input[type="checkbox"]:checked').length;
        const percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
        if(progressBar) progressBar.value = percentage;
        if(progressText) progressText.textContent = percentage + '%';
    }

    checkboxes.forEach(box => {
        const savedState = localStorage.getItem('mochila_spa_final_' + box.id);
        if (savedState === 'true') { box.checked = true; box.closest('.item').classList.add('checked'); }
        box.addEventListener('change', (e) => {
            localStorage.setItem('mochila_spa_final_' + e.target.id, e.target.checked);
            if (e.target.checked) e.target.closest('.item').classList.add('checked');
            else e.target.closest('.item').classList.remove('checked');
            updateProgress();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm("¿Estás seguro de que deseas desmarcar todos los elementos de la mochila?")) {
                checkboxes.forEach(box => {
                    box.checked = false; box.closest('.item').classList.remove('checked');
                    localStorage.removeItem('mochila_spa_final_' + box.id);
                });
                updateProgress();
            }
        });
    }
    updateProgress();

    // --- PLAN 333 ---
    function updateCountdown() {
        const now = new Date();
        const currentHour = now.getHours();
        let nextHour = currentHour + (3 - (currentHour % 3));
        let nextWindow = new Date(now);
        
        const countdownEl = document.getElementById('countdown');
        const nextWindowTextEl = document.getElementById('next-window-text');
        if (!countdownEl || !nextWindowTextEl) return;

        if (currentHour % 3 === 0 && now.getMinutes() < 3) {
            countdownEl.innerText = "¡VENTANA ACTIVA!";
            countdownEl.style.color = "var(--accent-color)";
            nextWindowTextEl.innerText = "Transmite según protocolo";
            return;
        }
        if (nextHour >= 24) { nextHour = 0; nextWindow.setDate(nextWindow.getDate() + 1); }
        nextWindow.setHours(nextHour, 0, 0, 0);
        
        const diff = nextWindow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownEl.innerText = String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
        countdownEl.style.color = "var(--primary-color)";
        nextWindowTextEl.innerText = `Próxima apertura a las: ${String(nextHour).padStart(2, '0')}:00`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- MAPA TÁCTICO ---
    let map = null;
    let markersLayer = null;
    let circleLayer = null;

    const categories = {
        police: { label: 'Policía', icon: '🚔', color: '#3b82f6', overpassQuery: (lat, lng, radius) => `[out:json][timeout:25];(node["amenity"="police"](around:${radius},${lat},${lng});way["amenity"="police"](around:${radius},${lat},${lng});node["office"="police"](around:${radius},${lat},${lng}););out center;` },
        fire: { label: 'Bomberos', icon: '🚒', color: '#ef4444', overpassQuery: (lat, lng, radius) => `[out:json][timeout:25];(node["amenity"="fire_station"](around:${radius},${lat},${lng});way["amenity"="fire_station"](around:${radius},${lat},${lng}););out center;` },
        civilProtection: { label: 'Protección Civil', icon: '🛡️', color: '#22c55e', overpassQuery: (lat, lng, radius) => `[out:json][timeout:25];(node["office"="government"]["government"="civil_protection"](around:${radius},${lat},${lng});node["amenity"="civil_protection"](around:${radius},${lat},${lng});node["emergency"="civil_protection"](around:${radius},${lat},${lng});way["office"="government"]["government"="civil_protection"](around:${radius},${lat},${lng});way["amenity"="civil_protection"](around:${radius},${lat},${lng});node["name"~"Protección Civil",i](around:${radius},${lat},${lng});node["name"~"Proteccion Civil",i](around:${radius},${lat},${lng}););out center;` },
        redCross: { label: 'Cruz Roja', icon: '🏥', color: '#f97316', overpassQuery: (lat, lng, radius) => `[out:json][timeout:25];(node["name"~"Cruz Roja",i](around:${radius},${lat},${lng});node["name"~"Red Cross",i](around:${radius},${lat},${lng});node["operator"~"Cruz Roja",i](around:${radius},${lat},${lng});node["operator"~"Red Cross",i](around:${radius},${lat},${lng});way["name"~"Cruz Roja",i](around:${radius},${lat},${lng});way["name"~"Red Cross",i](around:${radius},${lat},${lng});node["social_facility"="outreach"]["operator"~"Cruz",i](around:${radius},${lat},${lng}););out center;` }
    };

    const tLocBtn = document.getElementById('tabLocation');
    const tAddrBtn = document.getElementById('tabAddress');
    const panelLoc = document.getElementById('panelLocation');
    const panelAddr = document.getElementById('panelAddress');

    if(tLocBtn) tLocBtn.addEventListener('click', () => {
        tLocBtn.style.backgroundColor = '#ef4444'; tLocBtn.classList.replace('bg-transparent', 'bg-red-500'); tLocBtn.classList.replace('text-slate-400', 'text-white');
        tAddrBtn.style.backgroundColor = 'transparent'; tAddrBtn.classList.replace('bg-blue-500', 'bg-transparent'); tAddrBtn.classList.replace('text-white', 'text-slate-400');
        if(panelLoc) panelLoc.classList.remove('hidden'); if(panelAddr) panelAddr.classList.add('hidden');
    });

    if(tAddrBtn) tAddrBtn.addEventListener('click', () => {
        tAddrBtn.style.backgroundColor = '#3b82f6'; tAddrBtn.classList.replace('bg-transparent', 'bg-blue-500'); tAddrBtn.classList.replace('text-slate-400', 'text-white');
        tLocBtn.style.backgroundColor = 'transparent'; tLocBtn.classList.replace('bg-red-500', 'bg-transparent'); tLocBtn.classList.replace('text-white', 'text-slate-400');
        if(panelAddr) panelAddr.classList.remove('hidden'); if(panelLoc) panelLoc.classList.add('hidden');
        setTimeout(() => { const addrIn = document.getElementById('addressInput'); if(addrIn) addrIn.focus(); }, 100);
    });

    function getMyLocation() {
        if (!navigator.geolocation) { showError('Navegador no soporta geolocalización.'); return; }
        const btn = document.getElementById('btnLocation');
        const spinner = document.getElementById('locSpinner');
        const locText = document.getElementById('locText');
        const locIcon = document.getElementById('locIcon');

        if(btn) btn.disabled = true; if(spinner) spinner.classList.remove('hidden'); 
        if(locIcon) locIcon.classList.add('hidden'); if(locText) locText.textContent = 'Obteniendo...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude; const lng = position.coords.longitude;
                if(spinner) spinner.classList.add('hidden'); if(locIcon) locIcon.classList.remove('hidden'); 
                if(locText) locText.textContent = 'Compartir mi ubicación'; if(btn) btn.disabled = false;
                updateStatus('Ubicación obtenida', `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                searchEmergencies(lat, lng);
            },
            (error) => {
                if(spinner) spinner.classList.add('hidden'); if(locIcon) locIcon.classList.remove('hidden'); 
                if(locText) locText.textContent = 'Compartir mi ubicación'; if(btn) btn.disabled = false;
                showError('Error al obtener ubicación.');
            }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }
    
    const btnLoc = document.getElementById('btnLocation');
    if(btnLoc) btnLoc.addEventListener('click', getMyLocation);

    function resetBtnSearch() {
        const btn = document.getElementById('btnSearch');
        if (!btn) return;
        btn.replaceChildren();
        btn.appendChild(document.createTextNode('🔍 Buscar'));
        btn.disabled = false;
    }

    async function searchAddress() {
        const inputEl = document.getElementById('addressInput');
        if(!inputEl) return;
        const input = inputEl.value.trim();
        if (!input) { showError('Introduce una dirección.'); return; }

        const btn = document.getElementById('btnSearch');
        if(btn) {
            btn.disabled = true; 
            btn.replaceChildren();
            const spinner = document.createElement('div'); spinner.className = 'spinner inline-block';
            btn.appendChild(spinner); btn.appendChild(document.createTextNode(' Buscando...'));
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=1&addressdetails=1`);
            const data = await response.json();
            
            if (data.length === 0) { showError('No se encontró la dirección.'); resetBtnSearch(); return; }

            const lat = parseFloat(data[0].lat); const lng = parseFloat(data[0].lon);
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                showError('Coordenadas inválidas recibidas.'); resetBtnSearch(); return;
            }

            const displayName = data[0].display_name.split(',').slice(0, 3).join(',');
            updateStatus(`📍 ${displayName}`, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            searchEmergencies(lat, lng);
        } catch (err) { showError('Error al buscar la dirección.'); }
        resetBtnSearch();
    }

    const addressInput = document.getElementById('addressInput');
    if(addressInput) addressInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchAddress(); });
    const btnSearch = document.getElementById('btnSearch');
    if(btnSearch) btnSearch.addEventListener('click', searchAddress);

    async function searchEmergencies(lat, lng) {
        const radius = 2000;
        showMap(lat, lng, radius);
        
        const sBar = document.getElementById('statsBar'); const rList = document.getElementById('resultsList'); const nRes = document.getElementById('noResults');
        if(sBar) sBar.classList.remove('hidden'); if(rList) rList.classList.add('hidden'); if(nRes) nRes.classList.add('hidden');

        let allResults = [];
        let counts = { police: 0, fire: 0, civilProtection: 0, redCross: 0 };
        const loadingToast = showToast('Buscando servicios de emergencia...');

        for (const [key, cat] of Object.entries(categories)) {
            try {
                const query = cat.overpassQuery(lat, lng, radius);
                const response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: `data=${encodeURIComponent(query)}` });
                const data = await response.json();

                if (data.elements && data.elements.length > 0) {
                    counts[key] = data.elements.length;
                    data.elements.forEach(el => {
                        const elLat = el.lat || (el.center && el.center.lat); const elLng = el.lon || (el.center && el.center.lon);
                        if (!elLat || !elLng) return;

                        const dist = haversineDistance(lat, lng, elLat, elLng);
                        const tags = el.tags || {};
                        
                        // Uso de variables en crudo (DOM API previene inyección de forma nativa)
                        const name = tags.name || tags['name:es'] || cat.label;
                        const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || 'No disponible';
                        const website = safeUrl(tags.website || tags['contact:website'] || '');
                        const addr = tags['addr:street'] ? `${tags['addr:street']}${tags['addr:housenumber'] ? ' ' + tags['addr:housenumber'] : ''}` : '';

                        allResults.push({ key, category: cat.label, icon: cat.icon, color: cat.color, name, lat: elLat, lng: elLng, distance: dist, phone, website, address: addr, tags });
                        addMarker(elLat, elLng, cat.icon, cat.color, name, cat.label, dist, phone);
                    });
                }
            } catch (err) { console.error(`Error buscando ${cat.label}:`, err); }
        }

        removeToast(loadingToast);
        
        const cPolice = document.getElementById('countPolice'); const cFire = document.getElementById('countFire'); const cCivil = document.getElementById('countCivil'); const cRed = document.getElementById('countRedCross');
        if(cPolice) cPolice.textContent = counts.police; if(cFire) cFire.textContent = counts.fire; if(cCivil) cCivil.textContent = counts.civilProtection; if(cRed) cRed.textContent = counts.redCross;

        allResults.sort((a, b) => a.distance - b.distance);
        if (allResults.length === 0) { if(nRes) nRes.classList.remove('hidden'); } 
        else { renderResults(allResults); }
    }

    function showMap(lat, lng, radius) {
        const container = document.getElementById('mapContainer');
        if(container) container.classList.remove('hidden');

        if (!map) {
            map = L.map('map', { zoomControl: true, attributionControl: true });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
            markersLayer = L.layerGroup().addTo(map);
        }

        markersLayer.clearLayers();
        if (circleLayer) map.removeLayer(circleLayer);
        circleLayer = L.circle([lat, lng], { radius: radius, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08, weight: 2, dashArray: '8, 8' }).addTo(map);

        const iconDiv = document.createElement('div');
        iconDiv.style.position = 'relative';
        const centerDot = document.createElement('div');
        centerDot.style.cssText = 'width:16px;height:16px;background:#ef4444;border:3px solid white;border-radius:50%;position:relative;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
        const pulse = document.createElement('div');
        pulse.className = 'pulse-ring';
        pulse.style.cssText = 'position:absolute;top:50%;left:50%;width:16px;height:16px;background:rgba(239,68,68,0.3);border-radius:50%;transform:translate(-50%,-50%);z-index:1;';
        
        iconDiv.appendChild(centerDot); iconDiv.appendChild(pulse);

        const userIcon = L.divIcon({ html: iconDiv, className: '', iconSize: [16, 16], iconAnchor: [8, 8] });
        
        const popupDiv = document.createElement('div');
        popupDiv.style.cssText = 'text-align:center;font-weight:bold;color:black;';
        popupDiv.textContent = '📍 Tu ubicación';

        L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(markersLayer).bindPopup(popupDiv);
        map.setView([lat, lng], 14);
        setTimeout(() => map.invalidateSize(), 100);
    }

    function addMarker(lat, lng, emoji, color, name, category, distance, phone) {
        
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = `width:40px;height:40px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,0.3);cursor:pointer;`;
        iconDiv.textContent = emoji;

        const markerIcon = L.divIcon({ html: iconDiv, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });

        const distText = distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(2)} km`;
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'min-width:180px;font-family:Inter,sans-serif;';
        
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size:16px;font-weight:700;margin-bottom:4px;color:black;';
        titleEl.textContent = `${emoji} ${name}`;
        
        const catEl = document.createElement('div');
        catEl.style.cssText = 'font-size:12px;color:#6b7280;margin-bottom:6px;';
        catEl.textContent = category;
        
        const infoEl = document.createElement('div');
        infoEl.style.cssText = 'font-size:12px;color:#6b7280;';
        infoEl.textContent = `📏 ${distText}`;
        if(phone !== 'No disponible') {
            infoEl.appendChild(document.createElement('br'));
            infoEl.appendChild(document.createTextNode('📞 '));
            const phoneLink = document.createElement('a');
            phoneLink.href = `tel:${phone}`; phoneLink.style.color = color; phoneLink.textContent = phone;
            infoEl.appendChild(phoneLink);
        }

        const navWrap = document.createElement('div'); navWrap.style.marginTop = '8px';
        const navLink = document.createElement('a');
        navLink.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        navLink.target = '_blank'; navLink.rel = 'noopener noreferrer';
        navLink.style.cssText = `display:inline-block;background:${color};color:white;padding:6px 14px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;`;
        navLink.textContent = '🧭 Cómo llegar';
        navWrap.appendChild(navLink);

        wrapper.appendChild(titleEl); wrapper.appendChild(catEl); wrapper.appendChild(infoEl); wrapper.appendChild(navWrap);

        L.marker([lat, lng], { icon: markerIcon }).addTo(markersLayer).bindPopup(wrapper);
    }

    function renderResults(results) {
        const container = document.getElementById('resultsContainer');
        const list = document.getElementById('resultsList');
        if(!container) return;
        
        // Uso seguro de replaceChildren (Cero innerHTML)
        container.replaceChildren();

        results.forEach((r, i) => {
            const distText = r.distance < 1 ? `${(r.distance * 1000).toFixed(0)} m` : `${r.distance.toFixed(2)} km`;
            const distBadgeClass = r.distance < 0.5 ? 'bg-green-500/20 text-green-400' : r.distance < 1 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400';

            const card = document.createElement('div');
            card.className = 'glass rounded-xl p-4 card-hover fade-in';
            card.style.animationDelay = `${i * 0.05}s`;
            
            const flexWrap = document.createElement('div'); flexWrap.className = 'flex items-start gap-4';
            const iconWrap = document.createElement('div'); iconWrap.className = 'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl'; iconWrap.style.background = `${r.color}20`; iconWrap.textContent = r.icon;
            const contentWrap = document.createElement('div'); contentWrap.className = 'flex-1 min-w-0';
            
            const headerWrap = document.createElement('div'); headerWrap.className = 'flex items-start justify-between gap-2';
            const title = document.createElement('h3'); title.className = 'font-bold text-white text-sm truncate'; title.style.margin = '0'; title.textContent = r.name;
            const badge = document.createElement('span'); badge.className = `flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${distBadgeClass}`; badge.textContent = distText;
            headerWrap.appendChild(title); headerWrap.appendChild(badge);
            
            const catPara = document.createElement('p'); catPara.className = 'text-xs text-slate-500 mt-0.5 m-0'; catPara.textContent = r.category;
            contentWrap.appendChild(headerWrap); contentWrap.appendChild(catPara);

            if(r.address) { const addrPara = document.createElement('p'); addrPara.className = 'text-xs text-slate-400 mt-1 m-0'; addrPara.textContent = `📍 ${r.address}`; contentWrap.appendChild(addrPara); }

            const linksWrap = document.createElement('div'); linksWrap.className = 'flex items-center gap-2 mt-2 flex-wrap';
            if(r.phone !== 'No disponible') {
                const pLink = document.createElement('a'); pLink.href = `tel:${r.phone}`; pLink.className = 'text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1'; pLink.style.textDecoration = 'none'; pLink.textContent = `📞 ${r.phone}`; linksWrap.appendChild(pLink);
            }
            if(r.website !== '#') {
                const wLink = document.createElement('a'); wLink.href = r.website; wLink.target = '_blank'; wLink.rel = 'noopener noreferrer'; wLink.className = 'text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1'; wLink.style.textDecoration = 'none'; wLink.textContent = '🌐 Web'; linksWrap.appendChild(wLink);
            }
            contentWrap.appendChild(linksWrap);

            const navLink = document.createElement('a'); navLink.href = `https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`; navLink.target = '_blank'; navLink.rel = 'noopener noreferrer'; navLink.className = 'inline-flex items-center gap-1 mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all'; navLink.style.cssText = `background:${r.color}20;color:${r.color};text-decoration:none;`; navLink.textContent = '🧭 Cómo llegar';
            contentWrap.appendChild(navLink);

            flexWrap.appendChild(iconWrap); flexWrap.appendChild(contentWrap);
            card.appendChild(flexWrap);
            container.appendChild(card);
        });
        if(list) list.classList.remove('hidden');
    }

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function updateStatus(text, coords) {
        const sBar = document.getElementById('statusBar'); const sText = document.getElementById('statusText'); const sCoords = document.getElementById('statusCoords');
        if(sBar) sBar.classList.remove('hidden'); if(sText) sText.textContent = text; if(sCoords) sCoords.textContent = coords;
    }

    function showError(msg) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 z-[9999] bg-red-500/90 backdrop-blur text-white px-5 py-3 rounded-xl shadow-2xl text-sm max-w-sm fade-in';
        toast.textContent = msg; 
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 5000);
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] glass text-white px-6 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-3 fade-in';
        const spinner = document.createElement('div'); spinner.className = 'spinner';
        const span = document.createElement('span'); span.textContent = msg;
        toast.appendChild(spinner); toast.appendChild(span);
        document.body.appendChild(toast); 
        return toast;
    }

    function removeToast(toast) {
        if (toast && toast.parentNode) { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }
    }
});