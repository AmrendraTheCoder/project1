"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Login from "@/components/auth/Login";

function LoginPage() {
  // Animation for background particles
  useEffect(() => {
    // Create canvas context and animation
    const canvas = document.getElementById(
      "particles-canvas"
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }> = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 10);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`, // Reduced opacity
          speedX: Math.random() * 0.8 - 0.4, // Slowed down movement
          speedY: Math.random() * 0.8 - 0.4, // Slowed down movement
        });
      }
    };

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      // Draw connections between particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              0.1 * (1 - distance / 100) // Reduced opacity
            })`;
            ctx.lineWidth = 0.3; // Thinner lines
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(drawParticles);
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    resizeCanvas();
    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950 overflow-hidden">
      {/* Background canvas for particles animation */}
      <canvas id="particles-canvas" className="absolute inset-0 z-0"></canvas>

      {/* Decorative circles - reduced opacity */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Card container - improved contrast and opacity */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700 py-8 px-6 md:px-10 transform transition-all duration-500 hover:scale-[1.01]">
        {/* Logo section */}
        <div className="mb-6 text-center">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text mb-2">
            Rumors
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Form section - improved text contrast */}
        <div className="mt-6">
          <h2 className="font-bold text-2xl text-white text-center mb-1">
            Log In
          </h2>
          <p className="text-center text-gray-200 mb-6">Welcome back!</p>

          <Login />

          <div className="text-center mt-6">
            <p className="text-gray-200">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                Register!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
