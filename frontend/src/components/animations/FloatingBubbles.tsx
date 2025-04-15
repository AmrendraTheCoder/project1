"use client";
import React, { useEffect, useRef } from "react";

const FloatingBubbles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Reduced number of bubbles
    const bubbles = [];
    const bubbleCount = 15; // Reduced from 40

    // Create bubbles with simpler properties
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20, // Smaller radius range
        dx: (Math.random() - 0.5) * 0.5, // Slower movement
        dy: (Math.random() - 0.5) * 0.5, // Slower movement
        opacity: Math.random() * 0.3 + 0.1, // Lower opacity
        color: i % 2 === 0 ? "rgba(147, 51, 234, " : "rgba(192, 132, 252, ", // Just 2 colors
      });
    }

    // Simplified animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        // Move bubble
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;

        // Simple boundary check
        if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
        if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;
        if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;

        // Draw simple bubble
        ctx.beginPath();
        ctx.fillStyle = bubble.color + bubble.opacity + ")";
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{
        filter: "blur(4px)", // Reduced blur
        opacity: 0.5, // Reduced opacity
      }}
    />
  );
};

export default FloatingBubbles;
