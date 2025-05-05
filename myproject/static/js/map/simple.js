console.log("simple.js loaded");

// Cấu hình bản đồ
const config = {
    minZoom: 7,
    maxZoom: 18,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft',
        title: 'Phóng to toàn màn hình',
        titleCancel: 'Thoát toàn màn hình'
    }
};

// Ngưỡng zoom để hiển thị marker
const ZOOM_THRESHOLD = 15;

// Bán kính tìm kiếm trạm gần nhất (mét)
const SEARCH_RADIUS = 100000;

// Khởi tạo bản đồ
const map = L.map("map", config).setView(
    [10.8110, 106.7020], // Tọa độ mặc định gần 220/8 P5 Hoàng Hoa Thám
    DEFAULT_ZOOM
);
console.log("Map initialized", map);
map.attributionControl.setPrefix(false);

// Thêm layer OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="#">LT GIS</a>',
}).addTo(map);

// Click lên bản đồ (debug)
map.on("click", e => console.log(`You clicked the map at ${e.latlng}`));

// Icon tuỳ chỉnh cho trạm bus
const busIcon = L.icon({
    iconUrl: "/static/leaflet/images/bus.png",
    iconSize: [30, 40],
    iconAnchor: [15, 38],
});

// Icon vị trí người dùng
const userIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Tạo layer group cho trạm xe
const stationsLayer = L.layerGroup().addTo(map);

// Mảng để lưu các marker
const markers = [];

// Thêm marker động từ POINTS
POINTS.forEach(p => {
    const m = L.marker([p.latitude, p.longitude], { icon: busIcon })
        .bindPopup(
            `<b>${p.title}</b>` +
            (p.address ? `<br>${p.address}` : '') +
            (p.routes ? `<br><br>Các tuyến: ${p.routes}` : '')
        )
        .on("mouseover", () => m.setZIndexOffset(1000))
        .on("mouseout", () => m.setZIndexOffset(0))
        .addTo(stationsLayer);

    m._data = p;
    markers.push(m);
});

// Hàm ẩn/hiện marker theo zoom
function updateMarkersVisibility() {
    const currentZoom = map.getZoom();
    markers.forEach(marker => {
        marker.setOpacity(currentZoom < ZOOM_THRESHOLD ? 0 : 1);
    });
}
map.on('zoomend', updateMarkersVisibility);
updateMarkersVisibility();

// Biến giữ Marker người dùng, vòng tròn và control chỉ đường
let userMarker, searchCircle, routingControl;

// Hàm dọn route cũ
function clearRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    if (searchCircle) {
        map.removeLayer(searchCircle);
        searchCircle = null;
    }
    map.setView([10.8110, 106.7020], DEFAULT_ZOOM); // Quay về vị trí gần Hoàng Hoa Thám
}

// Tìm trạm gần nhất trong bán kính
function findNearestStation(latlng) {
    let nearest = null, minDist = Infinity;
    markers.forEach(m => {
        const dist = map.distance(latlng, m.getLatLng());
        if (dist <= SEARCH_RADIUS && dist < minDist) {
            minDist = dist;
            nearest = m;
        }
    });
    return { nearest, distance: minDist };
}

// Định vị và vẽ chỉ đường đến trạm gần nhất
function locateAndRoute() {
    if (!navigator.geolocation) {
        alert('Trình duyệt không hỗ trợ Geolocation. Vui lòng kiểm tra cài đặt trình duyệt.');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const latlng = L.latLng(coords.latitude, coords.longitude);
            const accuracy = coords.accuracy;
            console.log(`User position: lat=${coords.latitude}, lng=${coords.longitude}, accuracy=${accuracy}m`);
            if (accuracy > 100) {
                alert(`Độ chính xác vị trí thấp (${accuracy}m). Vui lòng bật GPS, kết nối Wi-Fi mạnh, hoặc kiểm tra quyền truy cập vị trí.`);
            }

            clearRoute();
            userMarker = L.marker(latlng, { icon: userIcon })
                .addTo(map)
                .bindPopup(`Bạn đang ở đây (độ chính xác: ${Math.round(accuracy)}m)`).openPopup();
            searchCircle = L.circle(latlng, {
                radius: SEARCH_RADIUS,
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.1
            }).addTo(map);
            map.setView(latlng, ZOOM_THRESHOLD);

            const { nearest } = findNearestStation(latlng);
            if (!nearest) {
                alert(`Không có trạm trong bán kính ${SEARCH_RADIUS}m`);
                return;
            }
            nearest.openPopup();

            routingControl = L.Routing.control({
                waypoints: [latlng, nearest.getLatLng()],
                router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                lineOptions: { styles: [{ weight: 4 }] },
                fitSelectedRoute: true,
                showAlternatives: true,
                addWaypoints: false,
                createMarker: (i, wp, n) => {
                    if (i === 0) return L.marker(wp.latLng, { icon: userIcon }).bindPopup('Bắt đầu');
                    else if (i === n-1) return L.marker(wp.latLng, { icon: busIcon }).bindPopup('Đích đến');
                }
            }).addTo(map);
        },
        err => {
            console.error("Geolocation error:", err);
            alert(`Lỗi lấy vị trí: ${err.message}. Vui lòng kiểm tra quyền truy cập vị trí, bật GPS, hoặc thử lại.`);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}

// Hàm tìm kiếm trạm theo tên hoặc tuyến
function searchStations(query) {
    query = query.toLowerCase().trim();
    return markers.filter(m => {
        const title = m._data.title.toLowerCase();
        const routes = m._data.routes.toLowerCase();
        return title.includes(query) || routes.includes(query);
    });
}

// Hàm vẽ đường đến trạm được chọn
function routeToStation(stationMarker) {
    if (!navigator.geolocation) {
        alert('Trình duyệt không hỗ trợ Geolocation. Vui lòng kiểm tra cài đặt trình duyệt.');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const latlng = L.latLng(coords.latitude, coords.longitude);
            const accuracy = coords.accuracy;
            console.log(`User position for routing: lat=${coords.latitude}, lng=${coords.longitude}, accuracy=${accuracy}m`);
            if (accuracy > 100) {
                alert(`Độ chính xác vị trí thấp (${accuracy}m). Vui lòng bật GPS, kết nối Wi-Fi mạnh, hoặc kiểm tra quyền truy cập vị trí.`);
            }

            clearRoute();
            userMarker = L.marker(latlng, { icon: userIcon })
                .addTo(map)
                .bindPopup(`Bạn đang ở đây (độ chính xác: ${Math.round(accuracy)}m)`).openPopup();
            map.setView(latlng, ZOOM_THRESHOLD);

            routingControl = L.Routing.control({
                waypoints: [latlng, stationMarker.getLatLng()],
                router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                lineOptions: { styles: [{ weight: 4 }] },
                fitSelectedRoute: true,
                showAlternatives: true,
                addWaypoints: false,
                createMarker: (i, wp, n) => {
                    if (i === 0) return L.marker(wp.latLng, { icon: userIcon }).bindPopup('Bắt đầu');
                    else if (i === n-1) return L.marker(wp.latLng, { icon: busIcon }).bindPopup('Đích đến');
                }
            }).addTo(map);
            stationMarker.openPopup();
        },
        err => {
            console.error("Geolocation error:", err);
            alert(`Lỗi lấy vị trí: ${err.message}. Vui lòng kiểm tra quyền truy cập vị trí, bật GPS, hoặc thử lại.`);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}

// Xử lý tìm kiếm từ input HTML
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchInput && searchResults) {
    console.log("Search input and results elements found");
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        searchResults.innerHTML = '';
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        const matches = searchStations(query);
        console.log(`Search query: ${query}, found ${matches.length} results`);
        if (matches.length === 0) {
            searchResults.innerHTML = '<div style="padding: 10px; font-size: 14px; color: #555;">Không tìm thấy</div>';
            searchResults.style.display = 'block';
            return;
        }
        matches.forEach(m => {
            const div = document.createElement('div');
            Object.assign(div.style, {
                padding: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s'
            });
            div.innerText = `${m._data.title} (${m._data.routes})`;
            div.addEventListener('mouseover', () => { div.style.background = '#f5f5f5'; });
            div.addEventListener('mouseout', () => { div.style.background = 'white'; });
            div.addEventListener('click', () => {
                routeToStation(m);
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            searchResults.appendChild(div);
        });
        searchResults.style.display = 'block';
    });

    // Đóng danh sách khi nhấn Enter
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            const matches = searchStations(searchInput.value);
            if (matches.length > 0) {
                routeToStation(matches[0]);
                searchResults.style.display = 'none';
                searchInput.value = '';
            }
        }
    });

    // Đóng danh sách khi mất focus
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            searchResults.style.display = 'none';
        }, 200);
    });

    // Ngăn click trên searchResults lan truyền
    searchResults.addEventListener('click', e => e.stopPropagation());
} else {
    console.error("Search input or results element not found");
}

// Nút “Tìm trạm gần nhất”
const findBtn = L.control({ position: 'topright' });
findBtn.onAdd = () => {
    const btn = L.DomUtil.create('button', '');
    btn.innerText = 'Tìm trạm gần nhất';
    Object.assign(btn.style, {
        padding: '6px',
        marginRight: '4px',
        marginTop: '10px',
        background: 'white',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: '1000'
    });
    btn.onclick = locateAndRoute;
    return btn;
};
findBtn.addTo(map);

// Nút “Tắt chỉ đường”
const clearBtn = L.control({ position: 'topright' });
clearBtn.onAdd = () => {
    const btn = L.DomUtil.create('button', '');
    btn.innerText = 'Tắt chỉ đường';
    Object.assign(btn.style, {
        padding: '6px',
        marginRight: '4px',
        marginTop: '10px',
        background: 'white',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: '1000'
    });
    btn.onclick = clearRoute;
    return btn;
};
clearBtn.addTo(map);