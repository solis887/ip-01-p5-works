// ============================================================
// 作品二：圆的呼吸（交互动态）
// 三种交互：
//   1) 鼠标左右移动 —— 控制整体运动速度
//   2) 鼠标点击     —— 在点击位置引爆一次冲击波，推开周围的圆
//   3) 随时间变化   —— 圆形大小持续呼吸
// ============================================================

// ---- 参数集中放这里，方便调 ----
const CANVAS_W = 380;
const CANVAS_H = 570;
const ENTER_FRAMES = 120;   // 出场动画总帧数
const BALL_COUNT = 16;      // 小球数量
const BREATH_SPEED = 0.035; // 呼吸速度
const BREATH_AMOUNT = 12;   // 呼吸幅度（像素）
const SHOCK_STRENGTH = 14;  // 点击冲击波的推力

// ---- 固定配色 ----
const PALETTE = [
  [230, 60, 60],   // 红
  [255, 140, 30],  // 橙
  [255, 210, 40],  // 黄
  [60, 190, 80],   // 绿
  [40, 120, 210],  // 蓝
  [245, 110, 140], // 粉
  [200, 50, 160],  // 紫
];

let balls = [];

function setup() {
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("sketch-holder");
  noStroke();

  // 用 for 循环批量生成小球，避免手写 16 遍
  for (let i = 0; i < BALL_COUNT; i++) {
    const angle = random(TWO_PI);
    const startSpeed = random(2.2, 4.5);
    balls.push({
      originX: width / 2,
      originY: height / 2,
      x: width / 2,
      y: height / 2,
      targetX: width / 2 + cos(angle) * random(100, 220),
      targetY: height / 2 + sin(angle) * random(100, 240),
      vx: cos(angle) * startSpeed,
      vy: sin(angle) * startSpeed,
      baseSize: random(22, 75),
      size: 0,
      color: PALETTE[i % PALETTE.length],
      alpha: 0,
    });
  }
}

function draw() {
  background(30, 30, 30, 42); // 半透明底色，留下拖影

  // 交互 1：鼠标左右移动 → 整体速度 0.2 ~ 1.6 倍
  const speedScale = map(mouseX, 0, width, 0.2, 1.6);

  for (const b of balls) {
    if (frameCount < ENTER_FRAMES) {
      // 出场动画：从中心弹性散开
      const t = constrain(frameCount / ENTER_FRAMES, 0, 1);
      const eased = easeOutBack(t);
      b.x = lerp(b.originX, b.targetX, eased);
      b.y = lerp(b.originY, b.targetY, eased);
      b.size = lerp(0, b.baseSize, t);
      b.alpha = lerp(0, 255, t);
    } else {
      // 持续运动
      b.x += b.vx * speedScale;
      b.y += b.vy * speedScale;

      // 撞到画布边缘就反弹
      if (b.x - b.size / 2 < 0 || b.x + b.size / 2 > width) {
        b.vx *= -1;
        b.x = constrain(b.x, b.size / 2, width - b.size / 2);
      }
      if (b.y - b.size / 2 < 0 || b.y + b.size / 2 > height) {
        b.vy *= -1;
        b.y = constrain(b.y, b.size / 2, height - b.size / 2);
      }

      // 交互 3：随时间呼吸
      b.size = b.baseSize + sin(frameCount * BREATH_SPEED) * BREATH_AMOUNT;
    }

    fill(b.color[0], b.color[1], b.color[2], b.alpha);
    circle(b.x, b.y, b.size);
  }
}

// 交互 2：点击 → 以点击点为圆心给所有小球一个向外的推力
function mousePressed() {
  for (const b of balls) {
    const dx = b.x - mouseX;
    const dy = b.y - mouseY;
    const dist = sqrt(dx * dx + dy * dy) || 1;
    if (dist < 220) {
      const push = SHOCK_STRENGTH * (1 - dist / 220);
      b.vx += (dx / dist) * push;
      b.vy += (dy / dist) * push;
    }
  }
}

// 弹性缓动：出场时轻微过冲再回弹
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
}
