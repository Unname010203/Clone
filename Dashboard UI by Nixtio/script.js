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
const dotsData = [];
for (let i = 0; i < dotsNumber; i++) {
	// Không để liên tiếp 2 cột có độ lớn đều là lớn nhất hay bé nhất
	// Để tạo sự cân bằng cho biều đồ
	dotsData.push(getRandomInt(3 + (dotsData[dotsData.length - 1] == 3), 6 - (dotsData[dotsData.length - 1] == 5)));
}

// 2. Hàm lấy màu ngẫu nhiên (để giống hình mẫu)
function getRandomColor() {
	const colors = ["green", "orange", "white", "orange", "green"];
	return colors[getRandomInt(0, colors.length)];
}

// 3. Vòng lặp tạo giao diện
dotsData.forEach((count) => {
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
const barChartCtx = barChartCanvas.getContext("2d");

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
	barChartCtx.fillStyle = color;
	barChartCtx.beginPath();
	// Dùng roundRect (hỗ trợ trình duyệt mới) hoặc vẽ arc thủ công
	// Ở đây bo góc = width/2 để tròn tuyệt đối
	barChartCtx.roundRect(x - width / 2, y, width, height, width / 2);
	barChartCtx.fill();

	// Vẽ số bên trong
	barChartCtx.fillStyle = "#000"; // Màu của số
	barChartCtx.font = "bold 14px Roboto";
	barChartCtx.textAlign = "center";
	barChartCtx.textBaseline = "middle";
	barChartCtx.fillText(textValue, x, y + height / 2);
}
// Hàm vẽ chấm tròn (Dot)
function drawDot(x, y, radius, color) {
	barChartCtx.beginPath();
	barChartCtx.arc(x, y, radius, 0, Math.PI * 2);
	barChartCtx.fillStyle = color;
	barChartCtx.fill();
}
// Hàm vẽ đường kẻ dọc mờ
function drawVerticalLine(x, y, lineLength) {
	barChartCtx.beginPath();
	barChartCtx.moveTo(x, y);
	barChartCtx.lineTo(x, y + lineLength);
	barChartCtx.strokeStyle = "#424242"; // Màu đường kẻ
	barChartCtx.lineWidth = 0.5;
	barChartCtx.stroke();
}

function drawLegendItem(x, y, color, label) {
	// Vẽ chấm tròn nhỏ
	barChartCtx.beginPath();
	barChartCtx.arc(x, y, 6, 0, Math.PI * 2);
	barChartCtx.fillStyle = color;
	barChartCtx.fill();

	// Vẽ chữ
	barChartCtx.fillStyle = "#fff"; // Màu chữ của chú thích
	barChartCtx.textAlign = "left";
	barChartCtx.font = "14px Roboto";
	barChartCtx.fillText(label, x + 15, y);
}

function renderBarChart() {
	// Thay đổi độ dài phù hợp với màn hình
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
	const pillWidth = (barChartCanvas.width - pillsGap * (barChartData.length - 1)) / barChartData.length;

	const chartRatio = 0.8; // Tỉ lệ giữa biểu đồ và chú thích (ở đây biểu đồ chiếm 70% chiều dài khung)
	const lineLength = barChartCanvas.height * chartRatio;
	const dotRadius = 5;
	const dotPadding = 10;
	const pillLength = lineLength * chartRatio;

	// Khoảng ngẫu nhiên chấp nhận được để các cột có thể chênh nhau về vị trí theo chiều dọc
	const randomTopMarginRange = 30;

	// Vẽ các cột biểu đồ
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

	// Vẽ chú thích
	const legendY = barChartCanvas.height * ((1 - chartRatio) / 1.5 + chartRatio);
	const legendGap = 80;
	Object.keys(typesColor).forEach((item, index) => {
		drawLegendItem(6 + legendGap * index, legendY, typesColor[item], item);
	});

	// Vẽ Tổng cộng
	barChartCtx.fillStyle = "#fff"; // Màu phần tổng cộng
	barChartCtx.textAlign = "right";
	barChartCtx.font = "bold 16px Arial";
	barChartCtx.fillText(
		`Total: ${barChartData.reduce((partialSum, current) => partialSum + current.first + current.second, 0)}`,
		barChartCanvas.width,
		legendY
	);
}

renderBarChart();

window.onresize = renderBarChart;

// Vẽ biểu đồ thanh ngang
const horizontalBarChartData = [
	{ date: "30.09", items: [{ start: 0, duration: 12, type: "green", label: "S" }] },
	{ date: "29.09", items: [{ start: 18, duration: 12, type: "orange", label: "X" }] },
	{ date: "28.09", items: [{ start: 8, duration: 15, type: "white", label: "U" }] },
	{ date: "27.09", items: [{ start: 6, duration: 21, type: "green", label: "B" }] },
	{ date: "26.09", items: [{ start: 2, duration: 10, type: "white", label: "D" }] },
	{
		date: "25.09",
		items: [
			{ start: 6, duration: 10, type: "orange", label: "F" }, // Thanh 1
			{ start: 18, duration: 12, type: "green", label: "U" }, // Thanh 2
		],
	},
	{ date: "24.09", items: [{ start: 10, duration: 8, type: "white", label: "T" }] },
];

const horizontalBarChartContainer = document.querySelector(".horizontal-bar-chart-container");
const horizontalBarChartBody = document.createElement("div");
horizontalBarChartBody.classList.add("horizontal-bar-chart-body");
const horizontalBarChartDataMax = Math.max(...horizontalBarChartData.map((d) => d.date));
const horizontalBarChartDataMin = Math.min(...horizontalBarChartData.map((d) => d.date));
const dividingXMax = 30;
const dividingXMin = 0;
const dividingX = 7; // Số lượng mốc ở cột X
const dividingY = 7; // Số lượng mốc ở cột Y

const xDividingContainer = document.createElement("div");
xDividingContainer.classList.add("x-axis");
const yDividingContainer = document.createElement("div");
yDividingContainer.classList.add("date-col"); // Thay đổi classname tùy theo tình huống cụ thể
const timelineArea = document.createElement("div");
timelineArea.classList.add("timeline-area"); // Thay đổi classname và tên biến tùy theo tình huống cụ thể

horizontalBarChartBody.appendChild(yDividingContainer);
horizontalBarChartBody.appendChild(timelineArea);
horizontalBarChartContainer.appendChild(xDividingContainer);

for (let i = dividingXMin; i <= dividingXMax; i += Math.floor((dividingXMax - dividingXMin) / (dividingY - 1))) {
	const dividing = document.createElement("span");
	dividing.textContent = i;
	xDividingContainer.appendChild(dividing);
}

horizontalBarChartData.forEach((row) => {
	// 1. Tạo Ngày tháng
	const dateDiv = document.createElement("div");
	dateDiv.className = "date-item";
	dateDiv.textContent = row.date;
	yDividingContainer.appendChild(dateDiv);

	// 2. Tạo Hàng chứa Bar
	const rowDiv = document.createElement("div");
	rowDiv.className = "timeline-row";

	// 3. Tạo các Bar trong hàng
	row.items.forEach((item) => {
		const bar = document.createElement("div");

		// Class màu sắc
		const bgClass = `bg-${item.type}`;
		bar.className = `bar ${bgClass}`;

		// Tính toán vị trí và độ rộng theo %
		const leftPercent = (item.start / horizontalBarChartDataMax) * 100;
		const widthPercent = (item.duration / horizontalBarChartDataMax) * 100;

		bar.style.left = `${leftPercent}%`;
		bar.style.width = `${widthPercent}%`;

		// Xử lý màu chữ cho icon và số
		// Nếu nền trắng -> chữ icon màu đen/xám, số màu đen
		// Nếu nền màu -> chữ icon màu của nền, số màu trắng hoặc đen tùy thiết kế
		const iconTextColor = item.type === "white" ? "#333" : `var(--${item.type})`;
		const valueTextColor = item.type === "white" ? "#000" : "#fff"; // Sửa lại logic màu chữ nếu cần

		// Nội dung HTML bên trong Bar
		bar.innerHTML = `
                    <div class="bar-icon" style="color: ${iconTextColor}">
                        ${item.label}
                    </div>
                    <span class="bar-value" style="color: ${valueTextColor}">${item.duration}</span>
                `;

		rowDiv.appendChild(bar);
	});

	timelineArea.appendChild(rowDiv);
});

horizontalBarChartContainer.appendChild(horizontalBarChartBody);

const horizontalLegendsData = {
	Customer: "#B8FF68",
	Product: "#FF9A23",
	Web: "#fff",
};
const horizontalBarChartFooter = document.createElement("div");
horizontalBarChartFooter.classList.add("horizontal-bar-footer");
horizontalBarChartContainer.appendChild(horizontalBarChartFooter);
const horizontalBarChartLegends = document.createElement("div");
horizontalBarChartLegends.classList.add("legend");
Object.keys(horizontalLegendsData).forEach((data) => {
	const horizontalBarChartLegendsItem = document.createElement("div");
	horizontalBarChartLegendsItem.classList.add("legend-item");
	horizontalBarChartLegendsItem.innerHTML = `
		<div class="dot" style="background-color:${horizontalLegendsData[data]};"></div>${data}
	`;
	horizontalBarChartLegends.appendChild(horizontalBarChartLegendsItem);
});

horizontalBarChartFooter.appendChild(horizontalBarChartLegends);
const horizontalBarChartTotal = document.createElement("span");
horizontalBarChartTotal.textContent = `Total: ${horizontalBarChartData.reduce(
	(prev, cur) => prev + cur.items.reduce((prev2, cur2) => prev2 + cur2.duration, 0),
	0
)}`; // Không hiểu thì đặt đại một con số nào vào cũng được
horizontalBarChartFooter.appendChild(horizontalBarChartTotal);
