"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPassword";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
}

function ResetPassword(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // Simulate form submission success for demo purposes
  const handleFormSuccess = useCallback((email: string | null): void => {
    setEmailSent(true);
  }, []);

  // Animation for background particles
  useEffect(() => {
    // Show content after a short delay for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Create canvas context and animation
    const canvas = document.getElementById(
      "particles-canvas"
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number | undefined;

    // Set canvas size
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles
    const initParticles = (): void => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 8); // More particles

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 0.5, // Varied sizes
          color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.05})`, // Varied opacity
          speedX: Math.random() * 0.6 - 0.3, // Gentle movement
          speedY: Math.random() * 0.6 - 0.3, // Gentle movement
        });
      }
    };

    // Draw particles
    const drawParticles = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges instead of bouncing (smoother effect)
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      // Draw connections between particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          if (distance < 120) {
            // Increased connection distance
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              0.08 * (1 - distance / 120) // Subtle connections
            })`;
            ctx.lineWidth = 0.4; // Slightly thicker lines
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = window.requestAnimationFrame(drawParticles);
    };

    const handleResize = (): void => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    resizeCanvas();
    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Background canvas for particles animation */}
      <canvas id="particles-canvas" className="absolute inset-0 z-0"></canvas>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-4000"></div>

      {/* Main content container */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 bg-slate-900 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/50 py-10 px-8 md:px-12 transform transition-all duration-700 ${
          isLoading ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
        } hover:shadow-purple-900/30`}
      >
        {/* Logo and branding section */}
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text mb-2">
              Rumors
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Dynamic content section */}
        <div className="mt-4">
          {emailSent ? (
            // Success state
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-2xl text-white">
                Check Your Email
              </h2>
              <p className="text-gray-300">
                We've sent you a password reset link. Please check your inbox
                and follow the instructions.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            // Form state
            <>
              <h2 className="font-bold text-2xl text-white text-center mb-2">
                Reset Your Password
              </h2>
              <p className="text-center text-gray-300 mb-6">
                Enter your email to receive a reset link
              </p>

              <ResetPasswordForm onSuccess={handleFormSuccess} />

              <div className="text-center mt-8 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-px bg-slate-700 w-full"></div>
                  <span className="px-4 text-sm text-slate-400">or</span>
                  <div className="h-px bg-slate-700 w-full"></div>
                </div>

                <div className="flex flex-col space-y-3">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full z-10">
        <p className="text-gray-400 text-sm">
          © 2025 Rumors. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
