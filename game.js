document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 400;

  let score = 0;
  let best = localStorage.getItem("best") || 0;
  let time = 1500;
  let active = false;
  let rageMode = false;

  let circles = [];
  const radius = 50;

  document.getElementById("bestScore").innerText = best;

  function randomPosition() {
    return {
      x: Math.random() * (canvas.width - 2*radius) + radius,
      y: Math.random() * (canvas.height - 2*radius) + radius
    };
  }

  function spawnCircles() {
    circles = [randomPosition(), randomPosition()];
    drawCircles();
  }

  function drawCircles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    circles.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x,c.y,radius,0,2*Math.PI);
      ctx.fillStyle = "cyan";
      ctx.fill();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "cyan";
    });
  }

  canvas.addEventListener("touchstart", (e) => {
    if(!active) return;
    if(e.touches.length !== 2) return;

    let ok = circles.every((c, i) => {
      const t = e.touches[i];
      let rect = canvas.getBoundingClientRect();
      let dx = t.clientX - rect.left - c.x;
      let dy = t.clientY - rect.top - c.y;
      return dx*dx + dy*dy <= radius*radius;
    });

    if(ok) {
      score++;
      if(score % 10 === 0) {
        rageMode = true;
        canvas.style.background = "#2d0cff";
      }
      document.getElementById("score").innerText = score;
      if(typeof playClickSound === "function") playClickSound();
      active = false;
      time *= 0.95;
      setTimeout(() => {
  active = true;
  spawnAndActivate();
}, 300);
    }
  });

  function spawnAndActivate() {
    spawnCircles();
    active = true;
    setTimeout(() => { if(active) gameOver(); }, time);
  }

  window.startGame = function() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("score").innerText = score;
    active = true;
    spawnAndActivate();
  }

  window.gameOver = function() {
    active = false;
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("score").innerText = score;
    if(score > best) localStorage.setItem("best", score);
  }

  window.restartGame = function() { location.reload(); }
});
