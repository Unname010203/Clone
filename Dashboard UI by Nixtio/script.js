function getRandomInt(min, max) {
	// Hàm ngẫu nhiên một số trong một khoảng xác định
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
// Biểu đồ chấm
const dotsChartContainer = document.querySelector(".dot-chart-container");

// 1. Dữ liệu giả lập (Số lượng chấm trong mỗi cột)
const dotsNumber = Math.ceil(dotsChartContainer.clientWidth / 18);
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
	dotsChartContainer.appendChild(colDiv);
});

// Biểu đồ thanh
const barChartCanvas = document.querySelector(".bar-chart");
const barChartContainer = barChartCanvas.parentNode;
const ctx = barChartCanvas.getContext("2d");

// Dữ liệu ảo cho biểu đồ
const barChartData = [
	{ first: 52, firstType: "Resources", second: 81, secondType: "Invalid", type: "Valid" },
	{ first: 96, firstType: "Valid", second: 25, secondType: "Invalid", type: "Resources" },
	{ first: 48, firstType: "Valid", second: 51, secondType: "Resources", type: "Invalid" },
	{ first: 80, firstType: "Valid", second: 49, secondType: "Invalid", type: "Resources" },
	{ first: 34, firstType: "Invalid", second: 67, secondType: "Valid", type: "Resources" },
	{ first: 92, firstType: "Valid", second: 28, secondType: "Resources", type: "Invalid" },
	{ first: 58, firstType: "Valid", second: 20, secondType: "Invalid", type: "Resources" },
	{ first: 84, firstType: "Invalid", second: 39, secondType: "Valid", type: "Resources" },
	{ first: 36, firstType: "Resources", second: 72, secondType: "Invalid", type: "Valid" },
];

const typesColor = {
	Valid: "#B8FF68",
	Invalid: "#FF9A23",
	Resources: "#fff",
};

// Các hàm vẽ
// Hàm vẽ hình chữ nhật bo tròn (Pill)
function drawPill(x, y, width, height, color, textValue) {
	ctx.fillStyle = color;
	ctx.beginPath();
	// Dùng roundRect (hỗ trợ trình duyệt mới) hoặc vẽ arc thủ công
	// Ở đây bo góc = width/2 để tròn tuyệt đối
	ctx.roundRect(x - width / 2, y, width, height, width / 2);
	ctx.fill();

	// Vẽ số bên trong
	ctx.fillStyle = "#000"; // Màu của số
	ctx.font = "bold 14px Roboto";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(textValue, x, y + height / 2);
}
// Hàm vẽ chấm tròn (Dot)
function drawDot(x, y, radius, color) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
}
// Hàm vẽ đường kẻ dọc mờ
function drawVerticalLine(x, y, lineLength) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x, y + lineLength);
	ctx.strokeStyle = "#424242"; // Màu đường kẻ
	ctx.lineWidth = 0.5;
	ctx.stroke();
}

function renderBarChart() {
	// Xóa canvas cũ (nếu vẽ lại)
	barChartCanvas.width =
		barChartContainer.clientWidth -
		parseFloat(window.getComputedStyle(barChartContainer).paddingLeft) -
		parseFloat(window.getComputedStyle(barChartContainer).paddingRight);
	barChartCanvas.height =
		barChartContainer.clientHeight -
		parseFloat(window.getComputedStyle(barChartContainer).paddingTop) -
		parseFloat(window.getComputedStyle(barChartContainer).paddingBottom);
	const pillsGap = (barChartCanvas.width * 0.6) / (barChartData.length - 1); // Khoảng cách giữa các cột (đơn vị %)
	// Công thức tính độ rộng:
	// Độ rộng cột = (độ rộng khung - độ lớn của tổng các khoảng cách) / số cột
	const pillWidth = (barChartCanvas.clientWidth - pillsGap * (barChartData.length - 1)) / barChartData.length;

	const lineLength = barChartContainer.clientHeight * 0.7;
	const dotRadius = 5;
	const dotPadding = 10;
	const pillLength = lineLength * 0.7;

	const randomTopMarginRange = 30;

	barChartData.forEach((item, index) => {
		const totalValue = item.first + item.second;

		// Vẽ đường kẻ mờ
		const x = pillWidth / 2 + (pillWidth + pillsGap) * index;
		const y = getRandomInt(0, randomTopMarginRange);
		drawVerticalLine(x, y, lineLength);

		// Vẽ cột
		const topY = (lineLength - pillLength) / 2 + y;
		const topHeight = Math.max(pillLength * (item.first / totalValue) - (dotRadius + dotPadding), pillWidth);
		console.log(topHeight);

		const bottomY = topY + topHeight + (dotRadius + dotPadding) * 2;
		const bottomHeight = Math.max(pillLength * (item.second / totalValue) - (dotRadius + dotPadding), pillWidth);

		drawPill(x, topY, pillWidth, topHeight, typesColor[item.firstType] ?? "#fff", item.first);
		drawPill(x, bottomY, pillWidth, bottomHeight, typesColor[item.secondType] ?? "#fff", item.second);

		// Vẽ chấm tròn ở giữa
		drawDot(x, topY + topHeight + dotRadius + dotPadding, dotRadius, typesColor[item.type] ?? "#fff");
	});
}

renderBarChart();

window.onresize = renderBarChart;
