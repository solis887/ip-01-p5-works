// ============================================================
// 作品一：几何构成（静态）
// 只用形状、颜色、位置组织画面，不使用 draw() 动画循环。
// 配色：暖（橘红 / 浅黄）× 冷（浅蓝）× 中性（米白 / 深灰）
// ============================================================

// ---- 画布参数 ----
const CANVAS_W = 380;
const CANVAS_H = 570;

// ---- 配色（共 5 个）----
const COLORS = {
  bg:     "#222222", // 深灰底
  orange: "#e66a33", // 橘红（暖）
  yellow: "#f2c878", // 浅黄（暖）
  blue:   "#7fa8c2", // 浅蓝（冷）
  cream:  "#f7eed9", // 米白（中性）
};

// ---- 圆形构成表：用 for 循环统一绘制，避免一个个手写 ----
// x, y 为圆心坐标，d 为直径，c 为 COLORS 里的颜色键名
const CIRCLES = [
  { x: 70,  y: 80,  d: 160, c: "orange" }, // 左上：暖色主圆，视觉起点
  { x: 240, y: 140, d: 280, c: "blue"   }, // 上方：最大冷色面，压住画面上半部
  { x: 270, y: 130, d: 220, c: "cream"  }, // 右上：米白叠压，与蓝圆咬合出月牙形
  { x: 190, y: 160, d: 110, c: "yellow" }, // 右上小圆：暖色点缀
  { x: 100, y: 400, d: 240, c: "blue"   }, // 左侧：冷色重量，平衡上方
  { x: 170, y: 360, d: 180, c: "bg"     }, // 中部：用底色挖空，制造前后层次
  { x: 230, y: 460, d: 260, c: "orange" }, // 下方：暖色主圆，与左上呼应
  { x: 250, y: 370, d: 140, c: "yellow" }, // 下方小圆：暖到冷的过渡
  { x: 330, y: 480, d: 160, c: "bg"     }, // 右下：再次挖空
  { x: 365, y: 340, d: 90,  c: "yellow" }, // 最右：贴边圆，暗示画外空间
];

function setup() {
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("sketch-holder");
  noStroke();
  frameRate(60);
}

function draw() {
  background(COLORS.bg);

  // 竖向米白长条：贯穿全图的中轴线，稳住构图
  fill(COLORS.cream);
  rect(115, 0, 30, CANVAS_H);

  // 循环绘制所有圆
  for (let i = 0; i < CIRCLES.length; i++) {
    const shape = CIRCLES[i];
    fill(COLORS[shape.c]);
    circle(shape.x, shape.y, shape.d);
  }
}
