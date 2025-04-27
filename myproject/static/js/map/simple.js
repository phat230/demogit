// Cấu hình bản đồ (minZoom, maxZoom)
const config = {
    minZoom: 7,
    maxZoom: 18,
  };
  
  // Ngưỡng zoom để hiển thị marker (nếu zoom dưới giá trị này thì ẩn)
  const ZOOM_THRESHOLD = 15;
  
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
  
  // Xử lý click lên bản đồ (nếu cần)
  map.on("click", function (e) {
    alert("You clicked the map at " + e.latlng);
  });
  
  // Định nghĩa icon tuỳ chỉnh (bus)
  const leafletIcon = L.icon({
    iconUrl: "/static/leaflet/images/bus.png",
    iconSize: [30, 40],
    iconAnchor: [15, 38],
  });
  
  // Mảng để lưu các marker, dùng cho ẩn/hiện theo zoom
  const markers = [];
  
  // Thêm marker động dựa trên mảng POINTS từ template
  POINTS.forEach((p) => {
    // Xây popup HTML, có kiểm tra tránh undefined
    let popupHtml = `<b>${p.title}</b>`;
    if (p.address) {
      popupHtml += `<br>${p.address}`;
    }
    if (p.routes) {
      popupHtml += `<br><br>Các tuyến đi qua: ${p.routes}`;
    }
  
    const marker = L.marker([p.latitude, p.longitude], { icon: leafletIcon })
      .addTo(map)
      .bindPopup(popupHtml);
  
    // Hover effect: nâng marker lên phía trước khi di chuột vào
    marker.on("mouseover", () => marker.setZIndexOffset(1000));
    marker.on("mouseout", () => marker.setZIndexOffset(0));
  
    // Đưa vào mảng để quản lý hiển thị theo zoom
    markers.push(marker);
  });
  
  // Hàm ẩn/hiện marker theo ngưỡng zoom
  function updateMarkersVisibility() {
    const currentZoom = map.getZoom();
    markers.forEach(marker => {
      marker.setOpacity(currentZoom < ZOOM_THRESHOLD ? 0 : 1);
    });
  }
  
  // Gắn sự kiện zoomend và gọi lần đầu
  map.on('zoomend', updateMarkersVisibility);
  updateMarkersVisibility();