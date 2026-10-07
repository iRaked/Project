// Mapamundi.js

const firebaseConfig = {
  apiKey: "AIzaSyCG6HNwoiQeZfPhmA0Npt6qO89N0cz9-54",
  authDomain: "mapamundial.firebaseapp.com",
  projectId: "mapamundial",
  storageBucket: "mapamundial.firebasestorage.app",
  messagingSenderId: "607439029246",
  appId: "1:607439029246:web:cb44e32e930a389f9676af",
  measurementId: "G-RN8MEMTXKF"
};

let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (err) { console.error("Error Firebase:", err); }

let userMarkers = [];
let darkMode = false;
let is3DView = true;
let map2D = null;
let userLat = 0, userLng = 0;

// --- THREE.JS SETUP (300x300) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // Aspect ratio 1 (300/300)
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(300, 300); // TAMAÑO EXACTO
document.getElementById('globe-container').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://i.postimg.cc/bvMVc95M/Earth.jpg');
const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 15, transparent: true, opacity: 1 })
);
scene.add(globe);

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

let isDragging = false, prevMouse = { x: 0, y: 0 }, rotationMomentum = 0;

// Eventos del globo (Giro libre, sin botón de pausa)
renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX - renderer.domElement.offsetLeft, y: e.clientY - renderer.domElement.offsetTop };
});
renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const currX = e.clientX - renderer.domElement.offsetLeft;
        const currY = e.clientY - renderer.domElement.offsetTop;
        globe.rotation.y += (currX - prevMouse.x) * 0.01;
        globe.rotation.x += (currY - prevMouse.y) * 0.01;
        rotationMomentum = (currX - prevMouse.x) * 0.0005;
        prevMouse = { x: currX, y: currY };
    }
});
renderer.domElement.addEventListener('mouseup', () => isDragging = false);
renderer.domElement.addEventListener('mouseleave', () => isDragging = false);
renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z = Math.max(1.5, Math.min(10, camera.position.z + e.deltaY * 0.01));
});

// --- FUNCIONES DE MARCADORES ---
function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

function createUserMarker(lat, lng, labelText, isCurrentUser = false) {
    const marker3D = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 32, 32),
        new THREE.MeshBasicMaterial({ color: isCurrentUser ? 0x00ff00 : 0x00a8ff, transparent: true, opacity: 0.9 })
    );
    marker3D.position.copy(latLngToVector3(lat, lng, 1.015));
    globe.add(marker3D);

    const label = document.createElement("div");
    label.className = `label ${isCurrentUser ? 'green' : 'blue'}`;
    label.textContent = labelText;
    document.getElementById('globe-container').appendChild(label);

    const marker2D = document.createElement("div");
    marker2D.className = isCurrentUser ? "user-marker" : "other-user-marker";
    document.getElementById('globe-container').appendChild(marker2D);

    userMarkers.push({ lat, lng, labelText, marker3D, label, marker2D, isCurrentUser });
}

function updateMarkerPositions() {
    userMarkers.forEach(marker => {
        const vector = marker.marker3D.getWorldPosition(new THREE.Vector3());
        const projected = vector.project(camera);
        const x = (projected.x * 0.5 + 0.5) * renderer.domElement.width;
        const y = (-projected.y * 0.5 + 0.5) * renderer.domElement.height;
        const isVisible = projected.z < 1;
        
        marker.label.style.display = isVisible ? "block" : "none";
        marker.marker2D.style.display = isVisible ? "block" : "none";
        if (isVisible) {
            marker.label.style.left = `${x}px`;
            marker.label.style.top = `${y}px`;
            marker.marker2D.style.left = `${x}px`;
            marker.marker2D.style.top = `${y}px`;
        }
    });
}

// --- LEAFLET 2D MAP ---
function init2DMap() {
    if (!map2D) {
        map2D = L.map('map-container', { zoomControl: true, attributionControl: false }).setView([userLat || 20, userLng || 0], 3);
        
        const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
        const streetTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
        
        satelliteTiles.addTo(map2D);
        map2D._satelliteTiles = satelliteTiles;
        map2D._streetTiles = streetTiles;
        map2D._currentTiles = satelliteTiles;
    }
    update2DMapMarkers();
}

function update2DMapMarkers() {
    if (!map2D) return;
    map2D.eachLayer(layer => { if (layer instanceof L.Marker) map2D.removeLayer(layer); });
    userMarkers.forEach(marker => {
        const iconUrl = marker.isCurrentUser ? 'https://i.postimg.cc/K8j5GgBQ/Marker-Red.png' : 'https://i.postimg.cc/xCvvxGVP/Marker-Blue.png';
        L.marker([marker.lat, marker.lng], {
            icon: L.icon({ iconUrl, shadowUrl: 'https://i.postimg.cc/Wp7m07nv/Marker-Shadow.png', iconSize: [20, 32], iconAnchor: [10, 32] })
        }).addTo(map2D);
    });
}

// --- CONTROLES ---
document.getElementById('toggleDarkMode').addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    
    const btn = document.getElementById('toggleDarkMode');
    
    if (darkMode) {

        btn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
    } else {

        btn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark';
    }
    
    if (map2D && map2D._satelliteTiles && map2D._streetTiles) {
        map2D.removeLayer(map2D._currentTiles);
        if (darkMode) {
            map2D._streetTiles.addTo(map2D);
            map2D._currentTiles = map2D._streetTiles;
        } else {
            map2D._satelliteTiles.addTo(map2D);
            map2D._currentTiles = map2D._satelliteTiles;
        }
    }
});

document.getElementById('toggleView').addEventListener('click', () => {
    is3DView = !is3DView;
    const globeEl = document.getElementById('globe-container');
    const mapEl = document.getElementById('map-container');

    if (is3DView) {
        globeEl.style.display = 'block';
        mapEl.style.display = 'none';
    } else {
        globeEl.style.display = 'none';
        mapEl.style.display = 'block';
        if (!map2D) init2DMap();
        setTimeout(() => { if (map2D) map2D.invalidateSize(); }, 100);
    }
});

// --- ANIMACIÓN Y FIREBASE ---
function animate() {
    requestAnimationFrame(animate);
    if (is3DView) {
        globe.rotation.y += rotationMomentum || 0.002;
        if (rotationMomentum) rotationMomentum *= 0.95;
        updateMarkerPositions();
        renderer.render(scene, camera);
    }
}

function updateVisitorDisplay(count) {
    document.getElementById("visitor-count").textContent = count;
}

async function init() {
    animate();
    if (!db) {
        createUserMarker(19.4326, -99.1332, "Demo", true);
        updateVisitorDisplay(1);
        return;
    }

    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        userLat = data.latitude; userLng = data.longitude;
        const locName = [data.city, data.country_name].filter(Boolean).join(", ");
        
        const userId = "user_" + Math.random().toString(36).substring(2) + Date.now();
        createUserMarker(userLat, userLng, locName || "Tu Ubicación", true);
        
        await db.collection('activeUsers').doc(userId).set({
            lat: userLat, lng: userLng, name: locName || "Anónimo",
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });

        db.collection('activeUsers').where('lastUpdate', '>', new Date(Date.now() - 60000)).onSnapshot(snapshot => {
            userMarkers = userMarkers.filter(m => {
                if (m.isCurrentUser) return true;
                globe.remove(m.marker3D); m.label.remove(); m.marker2D.remove(); return false;
            });
            snapshot.forEach(doc => {
                if (doc.id !== userId) {
                    const d = doc.data();
                    createUserMarker(d.lat, d.lng, d.name, false);
                }
            });
            updateVisitorDisplay(Math.max(snapshot.size, 1));
            if (!is3DView) update2DMapMarkers();
        });
    } catch (e) {
        createUserMarker(19.4326, -99.1332, "Ubicación Demo", true);
        updateVisitorDisplay(1);
    }
}

document.addEventListener('DOMContentLoaded', init);