const p5 = require("node-p5");
let startAngle = 45;
let startAngleIncrement = 360;
let canvas;

const getCanvas = () => {
  return canvas;  
}

toNumber = (s) => {
  return s.split('').map(X => X.toString().charCodeAt(0)).reduce((a, b) => a + b, 0);
}

const sketch = (p) => {
  p.setup = () => {
    const pr = pullRequest.pr;
    canvas = p.createCanvas(800, 800); // canvas
    p.angleMode(p.DEGREES);
    p.rectMode(p.DEGREES);
    const ctx = p.drawingContext;
    const x = p.width / 2;
    const y = p.height / 2;

    const squareSideDotsCount = 15;

    const squareVertices = [];

    for (let i = 0; i < 4; i += 1) {
      squareVertices.push({
        x: p.width * p.cos(startAngle),
        y: p.height * p.sin(startAngle),
      });
      startAngle += startAngleIncrement / 4;
    }

    const square = [];
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < squareSideDotsCount; j += 1) {
        const x = p.lerp(
          squareVertices[i].x,
          squareVertices[(i + 1) % squareVertices.length].x,
          j / squareSideDotsCount
        );
        const y = p.lerp(
          squareVertices[i].y,
          squareVertices[(i + 1) % squareVertices.length].y,
          j / squareSideDotsCount
        );
        square.push({ x, y });
      }
    }

    p.push();
    p.translate(x, y);
    for (let i = 0; i < square.length; i += 1) {
      p.push();
      p.noStroke();
      if (i % 2 === 0) {
        let rIndex = pr.id % 255;
        let gIndex = 0;
        let bIndex = 0;
        p.fill(rIndex, gIndex, bIndex);
      } else {
        let rIndex = 0;
        let gIndex = toNumber(pr.url) % 255;
        let bIndex = 0;
        p.fill(rIndex, gIndex, bIndex);
      }
      p.beginShape();
      p.vertex(square[i].x, square[i].y);
      p.vertex(0, 0);
      p.vertex(
        square[(i + 1) % square.length].x,
        square[(i + 1) % square.length].y
      );
      p.endShape(p.CLOSE);
      p.pop();
    }
    p.pop();

    for (let xx = 0; xx < p.width; xx += 20) {
      for (let yy = 0; yy < p.height; yy += 20) {
        let gap = 20;
        p.strokeWeight(2);
        if (Math.random() < 0.5) {
          let rIndex = toNumber(pr.created_at) % 255;
          let gIndex = toNumber(pr.html_url) % 255;
          let bIndex = toNumber(pr.title) % 255;

          p.stroke(255);
          p.line(xx, yy, xx + gap, yy + gap);
          
          p.stroke(rIndex, gIndex, bIndex);
          p.circle(xx, yy, gap/3);
        } else {
          let rIndex = toNumber(pr.closed_at) % 255;
          let gIndex = pr.number % 255;
          let bIndex = pr.user.id % 255;
          p.stroke(rIndex, gIndex, bIndex);
          p.line(xx, yy + gap, xx + gap, yy);
          
          p.stroke(0);
          p.square(xx, yy, gap/4);
        }
      }
    }
  };
};

const pullRequest = {};

module.exports = {
  sketch, 
  p5,
  getCanvas,
  pullRequest
}