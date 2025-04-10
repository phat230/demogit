// Cấu hình bản đồ
let config = {
    minZoom: 7,
    maxZoom: 18,
};

// Độ phóng đại khi bản đồ được mở
const zoom = 16;

// tọa độ trung tâm
const lat = 10.773994;
const lng = 106.697114;

// Khởi tạo bản đồ
const map = L.map("map", config).setView([lat, lng], zoom);
map.attributionControl.setPrefix(false);

// Được dùng để tải và trình các layer trên bản đồ
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="#">LT GIS</a> có bản',
}).addTo(map);

map.on("click", function (e) {
    alert("You clicked the map at " + e.latlng);
});

var leafletIcon = L.icon({
    iconUrl: '/static/leaflet/images/bus.png',
    iconSize: [30, 40],
    iconAnchor: [15,38],
});

// Khởi tạo mảng để lưu trữ các marker
let markers = [];

// Tạo danh sách các địa điểm gồm vị độ, kinh độ và tên của địa điểm đó
let points = [
    [10.767667, 106.689549, `<b>[BX 01-2] Bến xe buýt Sài Gòn - 2</b><br>
BẾN XE BUÝT SÀI GÒN Lê Lai, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua:`],
    [10.767847, 106.689978, `<b>[BX 01] Bến xe buýt Sài Gòn</b><br>
BẾN XE BUÝT SÀI GÒN Lê Lai, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 13, 140, 18, 19, 20, 27, 28, 34, 36, 39, 52, 65, 69, 72, 75, 88, 93, D4, DL03, DL04`],
    [10.784146, 106.7022474, `<b>[Q1 084] Khách sạn Sofitel</b><br>
Sofitel Plaza Lê Duẩn, Quận 1<br><br>
Các tuyến đi qua: 18, 19, 30`],
    [10.7776675, 106.7070246, `<b>[Q1 025] Bảo tàng Tôn Đức Thắng</b><br>
số 5B (The Landmarrk) Tôn Đức Thắng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 56, 88`],
    [10.7869042, 106.6941735, `<b>[Q1 008] Công Viên Lê Văn Tám</b><br>
179 - 181 Điện Biên Phủ, Quận 1<br><br>
Các tuyến đi qua: 10, 150, 72-1, 91, 93`],
    [10.789511, 106.6967242, `<b>[Q1 009] Đinh Tiên Hoàng</b><br>
87 Điện Biên Phủ, Quận 1<br><br>
Các tuyến đi qua: 10, 150, 72-1, 91, 93`],
    [10.7733704, 106.7063876, `<b>[Q1 031] Bến Bạch Đằng</b><br>
21 Tôn Đức Thắng, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 45, 53, 56, 88, DL01`],
    [10.7622515, 106.6830377, `<b>[Q1 141] ĐH Khoa Học Tự Nhiên</b><br>
Đối diện số 217 Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 06, 38`],
    [10.757051, 106.68587, `<b>[Q1 131] Chợ Nancy</b><br>
559-561 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7669423, 106.6875927, `<b>[Q1 007] Chợ Thái Bình</b><br>
187A Cống Quỳnh, Quận 1<br><br>
Các tuyến đi qua: 156V, 27`],
    [10.7912747, 106.6952364, `<b>[Q1 073] Đền Trần Hưng Đạo</b><br>
18 Võ Thị Sáu, Quận 1<br><br>
Các tuyến đi qua: 10, 18, 91`],
    [10.7888286, 106.6927829, `<b>[Q1 074] Công viên Lê Văn Tám</b><br>
78 Võ Thị Sáu, Quận 1<br><br>
Các tuyến đi qua: 10, 18, 91`],
    [10.7699494, 106.6934155, `<b>[Q1 188] Nguyễn Thị Nghĩa</b><br>
94-96 Lê Lai, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 13, 140, 156D, 18, 19, 20, 34, 36, 39, 52, 53, 69, 72, 75, 88, 93, D4`],
    [10.7726204, 106.6992917, `<b>[Q1 049] Chợ Bến Thành</b><br>
106 Lê Lợi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 155, 156D`],
    [10.7835232, 106.7073585, `<b>[Q1 032] Nguyễn Hữu Cảnh</b><br>
Cây xanh số 15 Nguyễn Hữu Cảnh, Quận 1<br><br>
Các tuyến đi qua: 44, 53, 56, 88`],
    [10.7780395, 106.7035068, `<b>[Q1 058] Nhà Hát Thành Phố</b><br>
74/A2-74/A4 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.7798555, 106.701527, `<b>[Q1 059] Bệnh viện Nhi Đồng 2</b><br>
Đối diện 115Ter Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.7678522, 106.6992533, `<b>[Q1 001] Calmette</b><br>
97 Calmette, Quận 1<br><br>
Các tuyến đi qua: 102, 34, 38, 44`],
    [10.7892203, 106.6903304, `<b>[Q1 063] Nhà thờ Tân Định</b><br>
298 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 31, 36`],
    [10.7924976, 106.6948579, `<b>[Q1 072] Chợ Đakao</b><br>
45-47 Trần Quang Khải, Quận 1<br><br>
Các tuyến đi qua: 31, 36`],
    [10.777076, 106.699669, `<b>[Q1 080] Lý Tự Trọng</b><br>
158D Pasteur, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 18, 31, 36, 52, 93`],
    [10.7782907, 106.6983598, `<b>[Q1 081] Lê Duẫn</b><br>
178 Pasteur, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 18, 31, 36, 52, 93`],
    [10.7798086, 106.6967169, `<b>[Q1 082] Nguyễn Thị Minh Khai</b><br>
184 Pasteur, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 31, 93`],
    [10.7740107, 106.6997984, `<b>[Q1 076] Chùa Ông</b><br>
Đối diện 96A Nam Kỳ Khởi Nghĩa, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 155, 156D, 18, 31, 36, 44, 52, 93`],
    [10.7667542, 106.6960483, `<b>[Q1 119] Cầu Ông Lãnh</b><br>
65G (75) Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1<br><br>
Các tuyến đi qua: 139, 140, 31, 46, 72`],
    [10.7662479, 106.6965412, `<b>[Q1 120] Cầu Ông Lãnh</b><br>
82 - 84 (82A) Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1<br><br>
Các tuyến đi qua: 139, 140, 31, 46, 72`],
    [10.7693473, 106.6879224, `<b>[Q1 169] Trường Bùi Thị Xuân</b><br>
126 Bùi Thị Xuân, Quận 1<br><br>
Các tuyến đi qua: 156D`],
    [10.7912552, 106.7005492, `<b>[Q1 087] Nguyễn Văn Thủ</b><br>
75 Nguyễn Bỉnh Khiêm, Quận 1<br><br>
Các tuyến đi qua: 150, 45, 93`],
    [10.7599322, 106.6946981, `<b>[Q1 165] Hồ Hảo Hớn</b><br>
Đối diện 414 Võ Văn Kiệt, Quận 1<br><br>
Các tuyến đi qua: 39`],
    [10.7582536, 106.6915957, `<b>[Q1 163] Trường Tiểu học Chương Dương</b><br>
490 Võ Văn Kiệt, Quận 1<br><br>
Các tuyến đi qua: 39`],
    [10.7857614, 106.7025976, `<b>[Q1 011] Đại học Khoa học xã hội nhân văn</b><br>
10 Đinh Tiên Hoàng, Quận 1<br><br>
Các tuyến đi qua: 18, 19`],
    [10.768731, 106.6903772, `<b>[Q1 189] Tôn Thất Tùng</b><br>
202-204 Lê Lai, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 13, 140, 156D, 18, 19, 20, 34, 36, 39, 52, 53, 69, 72, 75, 88, 93, D4`],
    [10.776917, 106.7058354, `<b>[BX 06] Công Trường Mê Linh</b><br>
Công trường Mê Linh Thi Sách, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 01`],
    [10.7760722, 106.7056997, `<b>[Q1 057] Công Trường Mê Linh</b><br>
2 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 45`],
    [10.7676758, 106.6908667, `<b>[Q1 190] Tôn Thất Tùng</b><br>
277-279-275Y Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 13, 140, 156V, 18, 19, 20, 28, 34, 36, 39, 46, 52, 65, 69, 72, 75, 88, 93, D4`],
    [10.7744984, 106.7047024, `<b>[Q1 173] Trạm Xe Bus Cityview Shuttle</b><br>
Đối diện 34-36 Đồng Khởi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua:`],
    [10.7596994, 106.6881941, `<b>[Q1 132] Tổng Công ty Samco</b><br>
393 bis Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7771741, 106.7003573, `<b>[Q1 109] Sở Tài nguyên và Môi trường</b><br>
63 Lý Tự Trọng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 155, 44`],
    [10.774068, 106.7066444, `<b>[Q1 024] Bến Bạch Đằng</b><br>
Bến thủy nội địa Thủ Thiêm Tôn Đức Thắng, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 45, 53, 56, 88, DL01, DL02`],
    [10.7624011, 106.6905879, `<b>[Q1 134] Hồ Hảo Hớn</b><br>
301F Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7674317, 106.6947718, `<b>[Q1 125] KTX Trần Hưng Đạo</b><br>
10 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152, 45, 56`],
    [10.7658046, 106.6933395, `<b>[Q1 126] Rạp Hưng Đạo</b><br>
112 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152, 45, 56`],
    [10.763058, 106.6882141, `<b>[Q1 156] Trần Đình Xu</b><br>
173 - 173B Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 45, 56`],
    [10.7691968, 106.6996581, `<b>[Q1 196] Bảo tàng Mỹ Thuật</b><br>
56 Nguyễn Thái Bình, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 102, 34, 38, 39, D4`],
    [10.7706801, 106.704864, `<b>[Q1 018] Tòa nhà Bitexco</b><br>
31-33-35 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 20, 75`],
    [10.7750733, 106.7007175, `<b>[Q1 079] Lê Thánh Tôn</b><br>
144 Pasteur, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 155, 18, 31, 36, 52, 93`],
    [10.7755096, 106.6988245, `<b>[Q1 108] Thư Viện Khoa Học Tổng Hợp</b><br>
69 Lý Tự Trọng, Quận 1<br><br>
Các tuyến đi qua: 156D, 44`],
    [10.7683789, 106.6957937, `<b>[Q1 138] Nguyễn Kim</b><br>
71C Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 102, 152, 31, 38, 45, 53, 56, 75, 88`],
    [10.7645291, 106.6874075, `<b>[Q1 149] City Plaza</b><br>
230 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 46`],
    [10.7594652, 106.6877808, `<b>[Q1 129] Tổng Công ty Samco</b><br>
262 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.768802, 106.693696, `<b>[Q1 191] Nguyễn Thị Nghĩa</b><br>
187 Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 13, 140, 156V, 18, 19, 20, 28, 34, 36, 39, 46, 52, 65, 69, 72, 93, D4, DL01, DL02`],
    [10.7574579, 106.6860184, `<b>[Q1 130] Chợ Nancy</b><br>
290-292-292A Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7707776, 106.7030582, `<b>[Q1 200] Giao lộ Hàm Nghi - Tôn Thất Đạm</b><br>
81-83-83B Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19`],
    [10.7685405, 106.695205, `<b>[Q1 121] Trần Hưng Đạo</b><br>
Đối diện số 179 Nguyễn Thái Học, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 140, 28, 46, 69, 72`],
    [10.7603133, 106.6837907, `<b>[Q1 140] Nguyễn Trãi</b><br>
Đối diện số 205 - 207 Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 139, 45, 56`],
    [10.7632769, 106.6882978, `<b>[Q1 155] Trần Đình Xu</b><br>
184 Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 45, 56`],
    [10.7874018, 106.6926157, `<b>[Q1 062] Công viên Lê Văn Tám</b><br>
Đối diện 245 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 31, 36`],
    [10.76735, 106.6982744, `<b>[Q1 167] Chợ dân sinh - Ký Con</b><br>
125-127 Ký Con, Quận 1<br><br>
Các tuyến đi qua: 39, D4`],
    [10.7709974, 106.6959714, `<b>[Q1 187] Khách sạn New World</b><br>
Số 76 Lê Lai, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 102, 109, 18, 19, 20, 34, 36, 39, 52, 53, 75, 88, 93, D4`],
    [10.7712473, 106.6957873, `<b>[Q1 040] Khách sạn New World</b><br>
40 Phạm Hồng Thái, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 13, 152, 31, 38, 56, 65`],
    [10.7695735, 106.6956974, `<b>[Q1 192] Trường Trung học Phổ thông Ernst Thälmann</b><br>
Trường Emst Thalmann Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 03, 04, 109, 13, 156V, 18, 19, 20, 28, 34, 36, 39, 52, 65, 69, 93, D4`],
    [10.7707209, 106.7040322, `<b>[Q1 017] Hồ Tùng Mậu</b><br>
67 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 20, 45, 56, 75, 88, DL01`],
    [10.7706453, 106.70577, `<b>[Q1 019] Cục Hải Quan Thành Phố</b><br>
1 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 20, 75`],
    [10.7708759, 106.7055179, `<b>[Q1 020] Cục Hải Quan Thành Phố</b><br>
2-4 Hàm Nghi, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 45, 56, 88`],
    [10.782509, 106.7052866, `<b>[Q1 112] Tòa án nhân dân Q1</b><br>
3B Lý Tự Trọng, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.773505, 106.7013922, `<b>[Q1 078] Đền Thờ Ấn Giáo</b><br>
Đền Thờ Ấn Giáo Pasteur, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 155, 18, 31, 36, 52, 93`],
    [10.7905929, 106.7052576, `<b>[Q1 098] Thảo Cầm Viên</b><br>
2A Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 19, 52`],
    [10.7872273, 106.7021055, `<b>[Q1 099] Đài truyền hình Thành phố</b><br>
Đối diện 9 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 45, 52`],
    [10.7862677, 106.7014207, `<b>[Q1 095] Đinh Tiên Hoàng</b><br>
15C-15D Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 45, 52`],
    [10.7839711, 106.6986809, `<b>[Q1 101] Phùng Khắc Khoan</b><br>
2 - 4 Phùng Khắc Khoan, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 52`],
    [10.7661864, 106.6825413, `<b>[Q1 088] Phạm Viết Chánh</b><br>
Đối diện 492 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 38, 69`],
    [10.7687115, 106.684986, `<b>[Q1 089] Bệnh viện Từ Dũ</b><br>
Đối diện 446 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 38, 69`],
    [10.7718402, 106.6879277, `<b>[Q1 090] Tôn Thất Tùng</b><br>
99 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 38, 69`],
    [10.7741294, 106.6900059, `<b>[Q1 091] Sở Y Tế</b><br>
Đối diện 214-216 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 28`],
    [10.7770334, 106.6927845, `<b>[Q1 092] Nhà Văn Hóa Lao Động</b><br>
Đối diện số 138 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 156D, 28`],
    [10.7810063, 106.6963991, `<b>[Q1 093] Pasteur</b><br>
43 - 45 - 47 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 31`],
    [10.7841809, 106.6994719, `<b>[Q1 094] Mạc Đỉnh Chi</b><br>
21 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 45, 52`],
    [10.7863396, 106.7012507, `<b>[Q1 100] Nhà thờ Mạc Ti Nho</b><br>
16A Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 45, 52`],
    [10.7896064, 106.7045903, `<b>[Q1 096] Thảo Cầm Viên</b><br>
3 Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 19, 52`],
    [10.7907001, 106.7056329, `<b>[Q1 097] Cầu Thị Nghè</b><br>
1A Nguyễn Thị Minh Khai, Quận 1<br><br>
Các tuyến đi qua: 05, 06, 14, 19, 52`],
    [10.770873, 106.7009383, `<b>[Q1 161] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 15 (99) Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 102, 20`],
    [10.7709257, 106.7008574, `<b>[Q1 180] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 7 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 04, 19, 56, 88`],
    [10.7708875, 106.7006065, `<b>[Q1 181] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 11 (115) Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 38`],
    [10.7708789, 106.7007985, `<b>[Q1 182] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 13 (102) Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 34, 39`],
    [10.7709943, 106.7005183, `<b>[Q1 015] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 1 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 109, 152, 52, 93`],
    [10.7709777, 106.7008529, `<b>[Q1 178] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 3 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 18, 31, 36, 44, 65`],
    [10.7710347, 106.6999115, `<b>[Q1 021] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 2 Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 34, 38, 39, 45, 75`],
    [10.771049, 106.6994948, `<b>[Q1 102] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 4 Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 01, 102, 44, 65`],
    [10.7711574, 106.6994198, `<b>[Q1 023] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 16 (140) Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 04, 18, 20`],
    [10.7711007, 106.6994943, `<b>[Q1 183] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 8 Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 56, 88`],
    [10.7710925, 106.6999191, `<b>[Q1 184] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 6 Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 03, 53, D4`],
    [10.7709914, 106.7030831, `<b>[Q1 193] Chợ Cũ</b><br>
84 Hàm Nghi, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 19, 45, 56, 88`],
    [10.7710549, 106.7018406, `<b>[Q1 194] Trường Cao đẳng Kỹ Thuật Cao Thắng</b><br>
Trường Cao Thắng Hàm Nghi, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 102, 19, 20, 34, 38, 39, 45, 56, 75, 88, D4`],
    [10.762287, 106.6902514, `<b>[Q1 128] Trần Đình Xu</b><br>
210 - 212 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.760673, 106.6890393, `<b>[Q1 133] Phòng Cảnh sát Phòng cháy Chữa cháy</b><br>
359 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7708611, 106.7015057, `<b>[Q1 1950] Nam Kỳ Khởi Nghĩa</b><br>
93-95 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 04, 19, 88`],
    [10.7708361, 106.7019523, `<b>[Q1 195] Chợ Cũ</b><br>
89A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 01, 03, 04, 152, 18, 19, 31, 36, 45, 52, 56, 75, 88, 93`],
    [10.7708507, 106.6938218, `<b>[Q1 123] Ngã sáu Phù Đổng</b><br>
Đối diện số 26 Nguyễn Thị Nghĩa, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 28, 46, 69`],
    [10.7708393, 106.6936333, `<b>[Q1 122] Nguyễn Thị Nghĩa</b><br>
26 - 32 Nguyễn Thị Nghĩa, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 13, 152, 31, 38, 56, 69`],
    [10.7710326, 106.6927759, `<b>[Q1 145] Nguyễn Trãi</b><br>
22 Nguyễn Trãi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 28, 46, 65`],
    [10.7731615, 106.6960137, `<b>[Q1 106] Khách sạn Golden</b><br>
189 - 191 Lý Tự Trọng, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7687864, 106.6959537, `<b>[Q1 124] Trường Trung học Phổ thông Ernst Thälmann</b><br>
8 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 28, 45, 69`],
    [10.7639299, 106.6917049, `<b>[Q1 127] Bệnh viện Răng Hàm Mặt</b><br>
150 Trần Hưng Đạo, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7636355, 106.6916529, `<b>[Q1 135] Bệnh Viện Răng Hàm Mặt</b><br>
263 Trần Hưng Đạo, Phường Cô Giang, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.7671569, 106.6947089, `<b>[Q1 137] KTX Trần Hưng Đạo</b><br>
135 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152, 45, 53, 56, 88`],
    [10.7709376, 106.700515, `<b>[Q1 179] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 5 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 03, 45, 53`],
    [10.7806054, 106.7006741, `<b>[Q1 060] Bưu Điện Thành Phố</b><br>
86 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.784299, 106.6964768, `<b>[Q1 061] Sở Công Thương</b><br>
142 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 31`],
    [10.7904513, 106.6887854, `<b>[Q1 064] Chợ Tân Định</b><br>
372-374 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 31, 36`],
    [10.7840612, 106.6966375, `<b>[Q3 032] Trần Cao Vân</b><br>
157 Hai Bà Trưng, Quận 3<br><br>
Các tuyến đi qua: 03, 18`],
    [10.7819798, 106.6990284, `<b>[Q1 065] Lê Duẩn</b><br>
Đối diện Lãnh sự quán Pháp Hai Bà Trưng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 03, 18`],
    [10.7793394, 106.7018959, `<b>[Q1 066] Bệnh viện Nhi Đồng 2</b><br>
Kế 115 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.7778905, 106.7035256, `<b>[Q1 067] Nhà Hát Thành Phố</b><br>
101 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.7759881, 106.7056045, `<b>[Q1 068] Công Trường Mê Linh</b><br>
Đối diện 2 Hai Bà Trưng, Quận 1<br><br>
Các tuyến đi qua: 03, 19, 45`],
    [10.7759926, 106.6987823, `<b>[Q1 075] Tòa án Nhân dân Thành Phố</b><br>
131 Nam Kỳ Khởi Nghĩa, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 155, 18, 31, 36, 52, 93`],
    [10.771523, 106.700882, `<b>[Q1 077] Trường CĐKT Cao Thắng</b><br>
Đối diện 86 Nam Kỳ Khởi Nghĩa, Quận 1<br><br>
Các tuyến đi qua: 04, 109, 152, 18, 31, 36, 44, 52, 93`],
    [10.7644625, 106.6821634, `<b>[Q1 142] Trường Trung học Phổ thông Chuyên Lê Hồng Phong</b><br>
Đối diện số 235 (trước NowZone) Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 06, 38`],
    [10.7730138, 106.6906711, `<b>[Q1 003] Trống Đồng</b><br>
Đối diện số 89 Cách Mạng Tháng Tám, Quận 1<br><br>
Các tuyến đi qua: 13, 28, 38, 65, 69`],
    [10.7723938, 106.6914603, `<b>[Q1 004] Trống Đồng</b><br>
85 Cách Mạng Tháng Tám, Quận 1<br><br>
Các tuyến đi qua: 13, 28, 38, 65, 69`],
    [10.78092, 106.6991745, `<b>[Q1 083] Diamond Plaza</b><br>
47 Lê Duẩn, Quận 1<br><br>
Các tuyến đi qua: 18, 30`],
    [10.7870723, 106.7011757, `<b>[Q1 012] SVĐ Hoa Lư</b><br>
2 Đinh Tiên Hoàng, Quận 1<br><br>
Các tuyến đi qua: 18, 45`],
    [10.7892725, 106.6987568, `<b>[Q1 013] Trường Trung cấp kỹ thuật nông nghiệp Tp HCM</b><br>
40 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1<br><br>
Các tuyến đi qua: 18, 45`],
    [10.7807618, 106.6988192, `<b>[Q1 086] Diamond Plaza</b><br>
34 Lê Duẩn, Quận 1<br><br>
Các tuyến đi qua: 155, 18, 30`],
    [10.7866918, 106.7043355, `<b>[Q1 202] Bảo tàng Lịch sử Việt Nam</b><br>
Cây xanh số 16 Lê Duẩn, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 19, DL01, DL02`],
    [10.7842282, 106.7020227, `<b>[Q1 085] Khách sạn Sofitel</b><br>
Đối diện Central Plaza Lê Duẩn, Quận 1<br><br>
Các tuyến đi qua: 19, 30`],
    [10.767705, 106.6886561, `<b>[Q1 147] Nhà thờ Huyện Sỹ</b><br>
206Bis Nguyễn Trãi, Quận 1<br><br>
Các tuyến đi qua: 27, 46, 53`],
    [10.7669365, 106.6877782, `<b>[Q1 006] Chợ Thái Bình</b><br>
244 Cống Quỳnh, Quận 1<br><br>
Các tuyến đi qua: 27`],
    [10.7660683, 106.6827041, `<b>[Q1 143] Nhà Sách Minh Khai</b><br>
59-61 Phạm Viết Chánh, Quận 1<br><br>
Các tuyến đi qua: 27, 53`],
    [10.7675866, 106.6849954, `<b>[Q1 144] Bệnh viện Truyền máu huyết học</b><br>
19-21 Phạm Viết Chánh, Quận 1<br><br>
Các tuyến đi qua: 27`],
    [10.7696619, 106.6907636, `<b>[Q1 146] Tôn Thất Tùng</b><br>
136 Nguyễn Trãi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 28, 46, 65`],
    [10.7841719, 106.7075841, `<b>[Q1 034] Mầm non Hoa Lư</b><br>
1 Nguyễn Hữu Cảnh, Quận 1<br><br>
Các tuyến đi qua: 30, 44, 53, 56, 88`],
    [10.7842885, 106.7043223, `<b>[Q1 028] TTTM Sài Gòn</b><br>
6 Tôn Đức Thắng, Quận 1<br><br>
Các tuyến đi qua: 30, 44`],
    [10.7917146, 106.6902974, `<b>[Q1 071] Bà Lê Chân</b><br>
151Bis Trần Quang Khải, Quận 1<br><br>
Các tuyến đi qua: 31, 36`],
    [10.7926083, 106.6951283, `<b>[Q1 069] Đa Kao</b><br>
30 Trần Quang Khải, Quận 1<br><br>
Các tuyến đi qua: 31, 36`],
    [10.7922021, 106.6928116, `<b>[Q1 070] Nguyễn Hữu Cầu</b><br>
98-100 Trần Quang Khải, Phường Tân Định, Quận 1<br><br>
Các tuyến đi qua: 31, 36`],
    [10.7711507, 106.6996046, `<b>[Q1 186] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 14 (138) Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 31, 36`],
    [10.7711451, 106.6998113, `<b>[Q1 185] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 12 (136) Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 109, 152`],
    [10.7711359, 106.7000466, `<b>[Q1 022] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 10 (134) Hàm Nghi, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 52, 93`],
    [10.7708974, 106.7003947, `<b>[Q1 016] Trạm Trung chuyển trên đường Hàm Nghi</b><br>
Hàm Nghi 9 (129-133) Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 75, D4, DL01`],
    [10.7685577, 106.6949906, `<b>[Q1 118] Trần Hưng Đạo</b><br>
197 Nguyễn Thái Học, Quận 1<br><br>
Các tuyến đi qua: 102, 140, 152, 31, 38, 46, 56, 72`],
    [10.7792374, 106.6991514, `<b>[Q1 005] Nhà Thờ Đức Bà</b><br>
1 Công xã Paris, Quận 1<br><br>
Các tuyến đi qua: 36, DL02`],
    [10.7782822, 106.6992407, `<b>[Q1 159] Pasteur</b><br>
84 Nguyễn Du, Quận 1<br><br>
Các tuyến đi qua: 36`],
    [10.777234, 106.6983113, "Nam Kỳ Khởi Nghĩa"],
    [10.7617427, 106.6962616, `<b>[Q1 162] Chợ Nga</b><br>
324 Võ Văn Kiệt, Quận 1<br><br>
Các tuyến đi qua: 39`],
    [10.7559639, 106.689258, `<b>[Q1 164] Cầu Nguyễn Văn Cừ</b><br>
Đối diện 354 Võ Văn Kiệt, Quận 1<br><br>
Các tuyến đi qua: 39`],
    [10.7618691, 106.6966726, `<b>[Q1 166] Chợ Nga</b><br>
Đối diện 324 Võ Văn Kiệt, Quận 1<br><br>
Các tuyến đi qua: 39`],
    [10.7691258, 106.698333, `<b>[Q1 002] Lê Thị Hồng Gấm</b><br>
134 (đối diện 141) Calmette, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7785767, 106.7016647, `<b>[Q1 110] TTTM Vincom</b><br>
47 Lý Tự Trọng, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7807246, 106.7036308, `<b>[Q1 111] Bệnh viện Nhi Đồng 2</b><br>
23 Lý Tự Trọng, Quận 1<br><br>
Các tuyến đi qua: 155, 44`],
    [10.7815207, 106.7068305, `<b>[Q1 026] Ba Son</b><br>
Đối diện số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 44, 56, 88`],
    [10.7818263, 106.7071024, `<b>[Q1 027] Ba Son</b><br>
2 Tôn Đức Thắng, Quận 1<br><br>
Các tuyến đi qua: 44, 56, 88`],
    [10.7838212, 106.7043628, `<b>[Q1 029] TTTM Sài Gòn</b><br>
35 Tôn Đức Thắng, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.780897, 106.7049261, `<b>[Q1 035] Chu Mạnh Trinh</b><br>
Đối diện 15 (dd 15/3) Lê Thánh Tôn, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7790053, 106.7032821, `<b>[Q1 036] Sở Kế Hoạch và Đầu Tư</b><br>
32 Lê Thánh Tôn, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7778204, 106.702246, `<b>[Q1 037] Trung tâm Vincom</b><br>
70 Lê Thánh Tôn, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7754135, 106.7001378, `<b>[Q1 038] Phố đi bộ Nguyễn Huệ</b><br>
86Bis Lê Thánh Tôn, Quận 1<br><br>
Các tuyến đi qua: 44`],
    [10.7620222, 106.6863007, `<b>[Q1 151] Nhà Khách Bộ Công An</b><br>
333 Nguyễn Trãi, Quận 1<br><br>
Các tuyến đi qua: 45, 46, 56`],
    [10.7645395, 106.6918772, `<b>[Q1 157] Trần Hưng Đạo</b><br>
37 Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 45, 53, 56`],
    [10.7898169, 106.7021296, `<b>[Q1 177] Nguyễn Đình Chiểu</b><br>
35 Nguyễn Bỉnh Khiêm, Phường Đa Kao, Quận 1<br><br>
Các tuyến đi qua: 45`],
    [10.7646555, 106.69179, `<b>[Q1 153] Nguyễn Cư Trinh</b><br>
34 - 36 Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 45, 56`],
    [10.7638709, 106.6896949, `<b>[Q1 154] Cống Quỳnh</b><br>
118 Nguyễn Cư Trinh, Quận 1<br><br>
Các tuyến đi qua: 45, 56`],
    [10.7657514, 106.6879201, `<b>[Q1 152] Chùa Lâm Tế</b><br>
217 Nguyễn Trãi, Quận 1<br><br>
Các tuyến đi qua: 46`],
    [10.7772275, 106.707092, `<b>[Q1 0250] Bảo tàng Tôn Đức Thắng</b><br>
Đối diện số 1A (đối diện Doanh trại Quân đội) Tôn Đức Thắng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 56, 88`],
    [10.7888191, 106.6998278, `<b>[Q1 114] UBND Phường Đakao</b><br>
52 - 54 Nguyễn Đình Chiểu, Quận 1<br><br>
Các tuyến đi qua: 150, 93`],
    [10.7869617, 106.6980755, `<b>[Q1 115] Mạc Đỉnh Chi</b><br>
102 Nguyễn Đình Chiểu, Quận 1<br><br>
Các tuyến đi qua: 150, 93`],
    [10.7852597, 106.6964717, `<b>[Q1 116] Hai Bà Trưng</b><br>
116 - 118 Nguyễn Đình Chiểu, Quận 1<br><br>
Các tuyến đi qua: 150, 93`],
    [10.7676443, 106.6962379, `<b>[Q1 171] Trường Nguyễn Thái Học</b><br>
141-149 Lê Thị Hồng Gấm, Quận 1<br><br>
Các tuyến đi qua: 139`],
    [10.7575307, 106.6848655, `<b>[Q1 139] Nhà Sách Nguyễn Văn Cừ</b><br>
102 (110-112) Nguyễn Văn Cừ, Quận 1<br><br>
Các tuyến đi qua: 139`],
    [10.7662108, 106.6994332, `<b>[Q1 168] Chợ Dân Sinh</b><br>
48 - 50 Ký Con, Quận 1<br><br>
Các tuyến đi qua: D4`],
    [10.7687202, 106.70154, `<b>[Q1 199] Sở Giao dịch chứng khoáng</b><br>
Đối diện 162-164 Nguyễn Công Trứ, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 155, D4`],
    [10.7764276, 106.7068992, `<b>[Q1 0251] Bến Bạch Đằng</b><br>
Đối diện số 1A (đối diện Doanh trại Quân đội) Tôn Đức Thắng, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 56, 88`],
    [10.7599004, 106.6850186, `<b>[Q1 150] Báo An Ninh Thế Giới</b><br>
371A Nguyễn Trãi, Quận 1<br><br>
Các tuyến đi qua: 45, 46, 56`],
    [10.7648329, 106.6926828, `<b>[Q1 136] Rạp Trần Hưng Đạo</b><br>
227 - 229 (255) Trần Hưng Đạo, Phường Cô Giang, Quận 1<br><br>
Các tuyến đi qua: 01, 139, 152`],
    [10.776776, 106.7022438, `<b>[Q1 172] Trung tâm VinCom</b><br>
171 Đồng Khởi, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 155`],
    [10.7753669, 106.7038026, `<b>[Q1 174] Nhà hát Thành phố</b><br>
127-129 Đồng Khởi, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 155`],
    [10.778308, 106.6965283, `<b>[Q1 203] Dinh Độc Lập</b><br>
Cây xanh số 10 Lê Duẩn, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 155, DL01`],
    [10.7762661, 106.6943088, `<b>[Q1 103] Sân vận động Tao Đàn</b><br>
3 Huyền Trân Công Chúa, Quận 1<br><br>
Các tuyến đi qua: 156D`],
    [10.7743451, 106.6967129, `<b>[Q1 104] Thủ Khoa Huân</b><br>
55 - 57 Thủ Khoa Huân, Quận 1<br><br>
Các tuyến đi qua: 156D`],
    [10.772314, 106.695901, `<b>[Q1 105] Chùa Bà Ấn</b><br>
42 Trương Định, Quận 1<br><br>
Các tuyến đi qua: 156V, DL02`],
    [10.7814708, 106.6972392, `<b>[H07_02] Nhà Văn Hóa Thanh Niên</b><br>
1 Phạm Ngọc Thạch, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 30, 36, 52`],
    [10.7814056, 106.697177, `<b>[H12_02] Nhà Văn Hóa Thanh Niên</b><br>
Đối diện số 1 Phạm Ngọc Thạch, Phường Bến Nghé, Quận 1<br><br>
Các tuyến đi qua: 30, 52`],
    [10.7662302, 106.6986479, `<b>[Q1 210] Chợ Dân sinh</b><br>
331-333 Nguyễn Công Trứ, Phường Nguyễn Thái Bình, Quận 1<br><br>
Các tuyến đi qua: 155`],
    [10.7700679, 106.6966362, `<b>[BX95] Ga Bến Thành</b><br>
Cây xanh 2-4 Phạm Ngũ Lão, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 155, 156D, 156V`],
    [10.774328, 106.6937052, `<b>[Q1 211] Công viên Tao Đàn</b><br>
Cây xanh 251 - trụ chiếu sáng số 6 Trương Định, Phường Bến Thành, Quận 1<br><br>
Các tuyến đi qua: 156V`],
    [10.769969, 106.696688, `<b>[Q1 212] Ga Bến Thành</b><br>
Cây xanh số 5 Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1<br><br>
Các tuyến đi qua: 156V`],
];

// Lặp qua danh sách các điểm để thêm marker vào bản đồ
points.forEach(point => {
    let marker = L.marker([point[0], point[1]], { icon: leafletIcon }).addTo(map)
        .bindPopup(point[2]);

    // Khi hover vào marker, đưa marker lên trên cùng
    marker.on("mouseover", function () {
        this.setZIndexOffset(1000);
    });

    // Khi rời khỏi marker, đặt lại thứ tự mặc định
    marker.on("mouseout", function () {
        this.setZIndexOffset(0);
    });

    // Lưu marker vào mảng
    markers.push(marker);
});

// Hàm để ẩn hoặc hiển thị marker dựa trên mức zoom
function updateMarkersVisibility() {
    let currentZoom = map.getZoom();
    let zoomThreshold = 15; // Mức zoom mà dưới đó sẽ ẩn marker

    markers.forEach(marker => {
        if (currentZoom < zoomThreshold) {
            marker.setOpacity(0); // Ẩn marker
        } else {
            marker.setOpacity(1); // Hiển thị marker
        }
    });
}

// Gọi hàm khi zoom kết thúc
map.on('zoomend', updateMarkersVisibility);

// Gọi hàm lần đầu để thiết lập trạng thái ban đầu
updateMarkersVisibility();

