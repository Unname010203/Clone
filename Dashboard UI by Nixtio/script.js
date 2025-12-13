function getRandomInt(min, max) {
	// Hàm ngẫu nhiên một số trong một khoảng xác định
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const chartContainer = document.querySelector(".dot-chart-container");

// 1. Dữ liệu giả lập (Số lượng chấm trong mỗi cột)
const dotsNumber = Math.ceil(chartContainer.clientWidth / 18);
const data = [];
for (let i = 0; i < dotsNumber; i++) {
	// Không để liên tiếp 2 cột có độ lớn đều là lớn nhất hay bé nhất
	// Để tạo sự cân bằng cho biều đồ
	data.push(getRandomInt(3 + (data[data.length - 1] == 3), 6 - (data[data.length - 1] == 5)));
}

// 2. Hàm lấy màu ngẫu nhiên (để giống hình mẫu)
function getRandomColor() {
	const colors = ["green", "orange", "white", "orange", "green"];
	return colors[getRandomInt(0, colors.length)];
}

// 3. Vòng lặp tạo giao diện
data.forEach((count) => {
	// Tạo cột
	const colDiv = document.createElement("div");
	colDiv.className = "col";

	// Tạo các chấm trong cột đó
	for (let i = 0; i < count; i++) {
		const dotDiv = document.createElement("div");
		dotDiv.className = `dot ${getRandomColor()}`;
		colDiv.appendChild(dotDiv);
	}

	// Gắn cột vào biểu đồ
	chartContainer.appendChild(colDiv);
});
