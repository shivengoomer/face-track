"use client";

import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className = "",
  containerClassName = "",
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}) => {
  const canvasRef = useRef(null);
  const noise = createNoise3D();
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    let ctx, w, h, nt = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getSpeed = () => (speed === "slow" ? 0.001 : 0.002);

    const drawWave = (n) => {
      nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    let animationId;
    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave(5);
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [colors, waveWidth, backgroundFill, blur, speed, waveOpacity, noise]);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div className={`relative h-screen flex items-center justify-center ${containerClassName}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      />
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
};
