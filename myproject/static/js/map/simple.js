// Cấu hình bản đồ (minZoom, maxZoom)
const config = {
    minZoom: 7,
    maxZoom: 18,
    fullscreenControl: true,
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

// Mảng để lưu các marker, dùng cho ẩn/hiện theo zoom
const markers = [];
  
// Thêm marker động dựa trên mảng POINTS từ template
POINTS.forEach((p) => {
    let popupHtml = `<b>${p.title}</b>`;
    if (p.address) {popupHtml += `<br>${p.address}`};
    if (p.routes) {popupHtml += `<br><br>Các tuyến đi qua: ${p.routes}`};
  
    const marker = L.marker([p.latitude, p.longitude], { icon: busIcon })
      .addTo(map)
      .bindPopup(popupHtml);
  
    // Hover effect: nâng marker lên phía trước khi di chuột vào
    marker.on("mouseover", () => marker.setZIndexOffset(1000));
    marker.on("mouseout", () => marker.setZIndexOffset(0));
  
    // Đưa vào mảng để quản lý hiển thị theo zoom
    marker._data = p;
    markers.push(marker);
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
  
  // Định vị và vẽ chỉ đường
function locateAndRoute() {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ Geolocation');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latlng = L.latLng(coords.latitude, coords.longitude);
  
        // Xóa cũ
        if (userMarker)    map.removeLayer(userMarker);
        if (searchCircle)  map.removeLayer(searchCircle);
        if (routingControl) map.removeControl(routingControl);
  
        // Thêm marker user và vòng tròn
        userMarker = L.marker(latlng, { icon: userIcon })
          .addTo(map)
          .bindPopup('Bạn đang ở đây').openPopup();
        searchCircle = L.circle(latlng, { radius: SEARCH_RADIUS }).addTo(map);
        map.setView(latlng, ZOOM_THRESHOLD);
  
        // Tìm trạm gần nhất
        const { nearest } = findNearestStation(latlng);
        if (!nearest) {
          alert(`Không có trạm trong bán kính ${SEARCH_RADIUS}m`);
          return;
        }
        nearest.openPopup();
  
        // Tạo control để vẽ route, phân biệt marker start/end
        routingControl = L.Routing.control({
            waypoints: [latlng, nearest.getLatLng()],
            router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: { styles: [{ weight: 4 }] },
            fitSelectedRoute: true,
            showAlternatives: true,
            addWaypoints: false,
            createMarker: function(i, wp, n) {
            // i === 0: start, i === n-1: end
            if (i === 0) {
                return L.marker(wp.latLng, { icon: userIcon })
                        .bindPopup('Bạn bắt đầu tại đây');
            } else if (i === n - 1) {
                return L.marker(wp.latLng, { icon: busIcon })
                        .bindPopup('Đích đến');
            }
            }
        }).addTo(map);
    },
    err => alert(`Lỗi lấy vị trí: ${err.message}`),
    { enableHighAccuracy: true }
    );
}
  
// Khi map sẵn sàng, định vị & chỉ đường
map.whenReady(locateAndRoute);

// Nút định vị thủ công
const locateBtn = L.control({ position: 'topright' });
locateBtn.onAdd = () => {
    const btn = L.DomUtil.create('button', 'locate-btn');
    btn.innerText = 'Định vị & Chỉ đường';
    btn.style.padding = '6px';
    btn.style.background = 'white';
    btn.onclick = locateAndRoute;
    return btn;
};
locateBtn.addTo(map);