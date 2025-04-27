// Cấu hình bản đồ (minZoom, maxZoom)
const config = {
    minZoom: 7,
    maxZoom: 18,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft',                    // vị trí như ý muốn
        title: 'Phóng to toàn màn hình',         // tooltip khi hover
        titleCancel: 'Thoát toàn màn hình'       // tooltip khi hover khi đang fullscreen
    }
};

// Ngưỡng zoom để hiển thị marker (nếu zoom dưới giá trị này thì ẩn)
const ZOOM_THRESHOLD = 15;

// Bán kính tìm kiếm trạm gần nhất (mét)
const SEARCH_RADIUS = 100000;
  
// Khởi tạo bản đồ với tọa độ trung tâm và độ zoom mặc định
const map = L.map("map", config).setView(
    [CENTER_LAT, CENTER_LNG],
    DEFAULT_ZOOM
);
map.attributionControl.setPrefix(false);

// Thêm layer OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="#">LT GIS</a>',
}).addTo(map);
  
// Click lên bản đồ (nếu cần)
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

// Mảng để lưu các marker, dùng cho ẩn/hiện theo zoom
const markers = [];
  
// Thêm marker động dựa trên mảng POINTS từ template
POINTS.forEach(p => {
    const m = L.marker([p.latitude, p.longitude], { icon: busIcon })
      .bindPopup(
        `<b>${p.title}</b>` +
        (p.address ? `<br>${p.address}` : '') +
        (p.routes  ? `<br><br>Các tuyến: ${p.routes}` : '')
      )
      .on("mouseover", () => m.setZIndexOffset(1000))
      .on("mouseout",  () => m.setZIndexOffset(0))
      .addTo(stationsLayer);     // <-- thêm vào stationsLayer
  
    m._data = p;
    markers.push(m);
});
  
// Hàm ẩn/hiện marker theo ngưỡng zoom
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
    // 1. Xoá control chỉ đường
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
  
    // 2. Xoá marker người dùng
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
  
    // 3. Xoá vòng tròn tìm kiếm
    if (searchCircle) {
      map.removeLayer(searchCircle);
      searchCircle = null;
    }
  
    // (Tuỳ chọn) đưa map về center/zoom ban đầu
    map.setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
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
        alert('Trình duyệt không hỗ trợ Geolocation');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const latlng = L.latLng(coords.latitude, coords.longitude);

            // Xóa cũ trước khi thêm mới
            clearRoute();

            // Thêm marker user và vòng tròn tìm kiếm
            userMarker = L.marker(latlng, { icon: userIcon })
                .addTo(map)
                .bindPopup('Bạn đang ở đây').openPopup();
            searchCircle = L.circle(latlng, {
                radius: SEARCH_RADIUS,
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.1
            }).addTo(map);
            map.setView(latlng, ZOOM_THRESHOLD);

            // Tìm trạm gần nhất
            const { nearest } = findNearestStation(latlng);
            if (!nearest) {
                alert(`Không có trạm trong bán kính ${SEARCH_RADIUS}m`);
                return;
            }
            nearest.openPopup();

            // Vẽ đường đi
            routingControl = L.Routing.control({
                waypoints: [latlng, nearest.getLatLng()],
                router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                lineOptions: { styles: [{ weight: 4 }] },
                fitSelectedRoute: true,
                showAlternatives: true,
                addWaypoints: false,
                createMarker: (i, wp, n) => {
                    if (i === 0)      return L.marker(wp.latLng, { icon: userIcon }).bindPopup('Bắt đầu');
                    else if (i === n-1) return L.marker(wp.latLng, { icon: busIcon  }).bindPopup('Đích đến');
                }
            }).addTo(map);
        },
        err => alert(`Lỗi lấy vị trí: ${err.message}`),
        { enableHighAccuracy: true }
    );
}

// Nút “Tìm trạm gần nhất”
const findBtn = L.control({ position: 'topright' });
findBtn.onAdd = () => {
    const btn = L.DomUtil.create('button', '');
    btn.innerText = 'Tìm trạm gần nhất';
    Object.assign(btn.style, {
        padding: '6px',
        marginRight: '4px',
        background: 'white',
        cursor: 'pointer'
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
        background: 'white',
        cursor: 'pointer'
    });
    btn.onclick = clearRoute;
    return btn;
};
clearBtn.addTo(map);