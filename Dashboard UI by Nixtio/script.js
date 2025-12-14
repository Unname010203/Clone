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
const barChartContainer = document.querySelector(".bar-chart");
const ctx = barChartContainer.getContext("2d");

// Dữ liệu ảo cho biểu đồ
const barChartData = [
	{first: 52, second: 81, type: "Valid"},
	{first: 96, second: 25, type: "Resources"},
	{first: 48, second: 51, type: "Invalid"},
	{first: 80, second: 49, type: "Resources"},
	{first: 34, second: 67, type: "Resources"},
	{first: 92, second: 28, type: "Invalid"},
	{first: 58, second: 20, type: "Resources"},
	{first: 84, second: 39, type: "Resources"},
	{first: 36, second: 72, type: "Valid"},
]



// Các hàm vẽ
// Hàm vẽ hình chữ nhật bo tròn (Pill)
function drawPill(x, y, width, height, color, textValue) {
	ctx.fillStyle = color;
	ctx.beginPath();
	// Dùng roundRect (hỗ trợ trình duyệt mới) hoặc vẽ arc thủ công
	// Ở đây bo góc = width/2 để tròn tuyệt đối
	ctx.roundRect(x - width/2, y, width, height, width/2); 
	ctx.fill();

	// Vẽ số bên trong
	ctx.fillStyle = "#000"; // Màu của số
	ctx.font = "bold 16px Roboto";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(textValue, x, y + height/2);
}
// Hàm vẽ chấm tròn (Dot)
function drawDot(x, y, color) {
	ctx.beginPath();
	ctx.arc(x, y, 5, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
}
// Hàm vẽ đường kẻ dọc mờ
function drawVerticalLine(x) {
	ctx.beginPath();
	ctx.moveTo(x, 0);
	ctx.lineTo(x, 320);
	ctx.strokeStyle = "#424242"; // Màu đường kẻ
	ctx.lineWidth = 1;
	ctx.stroke();
}

const barGap = 1.6; // Khoảng cách giữa các cột (đơn vị %)
// Công thức tính độ rộng:
// Độ rộng cột = (độ rộng khung - độ lớn của tổng các khoảng cách) / số cột 
const barWidth = (barChartContainer.clientWidth - barChartContainer.clientWidth*2/100 * (barChartData.length - 1)) / barChartData.length;

const x = barWidth / 2;
drawVerticalLine(x);