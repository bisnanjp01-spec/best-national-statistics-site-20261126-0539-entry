// Canvas chart helpers for the Valdoria statistics site. No libraries, no
// network — every chart is drawn in code. All helpers scale by
// devicePixelRatio so charts stay crisp on desktop and phone screens.

const TEAL = "#0f5f5c";
const TEAL_LIGHT = "#2e8b86";
const AMBER = "#e8a33d";
const AMBER_DARK = "#c47f1a";
const INK = "#1d2b2a";
const MUTED = "#6b7a78";
const GRID = "#e3e0d5";
const PALETTE = [TEAL, AMBER, "#4a7fa5", "#8a6fb8", "#c96a4a", "#5da271"];

function rr(ctx, x, y, w, h, r) {
  // roundRect with a fallback for older canvas implementations.
  if (typeof ctx.roundRect === "function") { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  else { ctx.beginPath(); ctx.rect(x, y, w, h); }
}

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function axes(ctx, x0, y0, x1, y1) {
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y1);
  ctx.stroke();
}

function yTicks(ctx, x0, yTop, yBottom, min, max, steps, format) {
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= steps; i++) {
    const v = min + ((max - min) * i) / steps;
    const y = yBottom - ((yBottom - yTop) * i) / steps;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x0 + 8, y);
    ctx.stroke();
    ctx.fillText(format(v), x0 - 6, y);
  }
}

function niceBounds(values, pad = 0.08) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  min = Math.max(0, min - span * pad);
  max = max + span * pad;
  return { min, max };
}

export function lineChart(canvas, series, opts = {}) {
  const height = opts.height || 260;
  const { ctx, width } = setup(canvas, height);
  const labels = series.map((d) => String(d.year ?? d.label));
  const values = series.map((d) => d.value);
  const { min, max } = niceBounds(values);
  const padL = 52, padR = 14, padT = 14, padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const x = (i) => padL + (plotW * i) / Math.max(1, series.length - 1);
  const y = (v) => padT + plotH * (1 - (v - min) / (max - min));
  yTicks(ctx, padL, padT, padT + plotH, min, max, 4, (v) => opts.format ? opts.format(v) : v.toFixed(1));
  axes(ctx, padL, padT + plotH, width - padR, padT);
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  labels.forEach((lab, i) => ctx.fillText(lab, x(i), padT + plotH + 8));
  // Area fill under the line.
  ctx.beginPath();
  series.forEach((d, i) => (i === 0 ? ctx.moveTo(x(i), y(d.value)) : ctx.lineTo(x(i), y(d.value))));
  ctx.lineTo(x(series.length - 1), padT + plotH);
  ctx.lineTo(x(0), padT + plotH);
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 95, 92, 0.10)";
  ctx.fill();
  // Line and points.
  ctx.beginPath();
  series.forEach((d, i) => (i === 0 ? ctx.moveTo(x(i), y(d.value)) : ctx.lineTo(x(i), y(d.value))));
  ctx.strokeStyle = opts.color || TEAL;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  series.forEach((d, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(d.value), d.year === opts.highlightYear ? 5.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = d.year === opts.highlightYear ? AMBER_DARK : opts.color || TEAL;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  // Value labels on the first and last points.
  ctx.fillStyle = INK;
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(opts.format ? opts.format(values[0]) : values[0], x(0) + 6, y(values[0]) - 16);
  ctx.textAlign = "right";
  ctx.fillText(opts.format ? opts.format(values[values.length - 1]) : values[values.length - 1], x(series.length - 1) - 6, y(values[values.length - 1]) - 16);
}

export function barChart(canvas, series, opts = {}) {
  const height = opts.height || 260;
  const { ctx, width } = setup(canvas, height);
  const values = series.map((d) => d.value);
  const max = Math.max(...values) * 1.12;
  const padL = 52, padR = 14, padT = 16, padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  yTicks(ctx, padL, padT, padT + plotH, 0, max, 4, (v) => opts.format ? opts.format(v) : v.toFixed(1));
  axes(ctx, padL, padT + plotH, width - padR, padT);
  const slot = plotW / series.length;
  const barW = Math.min(56, slot * 0.62);
  series.forEach((d, i) => {
    const bx = padL + slot * i + (slot - barW) / 2;
    const bh = (plotH * d.value) / max;
    const by = padT + plotH - bh;
    const isHi = opts.highlight ? opts.highlight(d) : false;
    ctx.fillStyle = isHi ? AMBER : (opts.color || TEAL);
    rr(ctx, bx, by, barW, bh, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(opts.format ? opts.format(d.value) : d.value, bx + barW / 2, by - 4);
    ctx.fillStyle = MUTED;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(String(d.label ?? d.year), bx + barW / 2, padT + plotH + 8);
  });
}

export function donutChart(canvas, segments, opts = {}) {
  const height = opts.height || 260;
  const { ctx, width } = setup(canvas, height);
  const cx = opts.legend === false ? width / 2 : Math.min(150, width * 0.32);
  const cy = height / 2;
  const radius = Math.min(92, height / 2 - 18);
  const inner = radius * 0.58;
  const total = segments.reduce((a, s) => a + s.share, 0);
  let angle = -Math.PI / 2;
  segments.forEach((seg, i) => {
    const sweep = (seg.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    // Share label outside the slice.
    const mid = angle + sweep / 2;
    const lx = cx + Math.cos(mid) * (radius + 18);
    const ly = cy + Math.sin(mid) * (radius + 18);
    ctx.fillStyle = INK;
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(seg.share.toFixed(1) + "%", lx, ly);
    angle += sweep;
  });
  // Donut hole with the total.
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#fffdf6";
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(opts.centerLabel || "100%", cx, cy - 8);
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText(opts.centerSub || "of GDP", cx, cy + 10);
  // Legend.
  if (opts.legend !== false) {
    const lx = cx + radius + 42;
    let ly = cy - ((segments.length * 22) / 2) + 8;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    segments.forEach((seg, i) => {
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      rr(ctx, lx, ly - 6, 12, 12, 3);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(seg.name, lx + 18, ly);
      ly += 22;
    });
  }
}

export function pyramidChart(canvas, groups, opts = {}) {
  const height = opts.height || 280;
  const { ctx, width } = setup(canvas, height);
  const maxVal = Math.max(...groups.flatMap((g) => [g.male, g.female])) * 1.15;
  const padT = 30, padB = 26, rowH = (height - padT - padB) / groups.length;
  const midX = width / 2;
  const halfW = width / 2 - 66;
  ctx.fillStyle = MUTED;
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Male", midX - halfW / 2, 8);
  ctx.fillText("Female", midX + halfW / 2, 8);
  groups.forEach((g, i) => {
    const cy = padT + rowH * i + rowH / 2;
    const bh = Math.min(26, rowH * 0.62);
    const mw = (g.male / maxVal) * halfW;
    const fw = (g.female / maxVal) * halfW;
    ctx.fillStyle = TEAL;
    rr(ctx, midX - mw, cy - bh / 2, mw, bh, [3, 0, 0, 3]);
    ctx.fill();
    ctx.fillStyle = AMBER;
    rr(ctx, midX, cy - bh / 2, fw, bh, [0, 3, 3, 0]);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillText(g.male.toFixed(2), midX - 6, cy);
    ctx.textAlign = "left";
    ctx.fillText(g.female.toFixed(2), midX + 6, cy);
    ctx.fillStyle = INK;
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(g.group, midX, cy + bh / 2 + 2);
  });
  ctx.fillStyle = MUTED;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("Millions of people, 2025 — " + (opts.source || ""), midX, height - 4);
}
