"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const bubbleRefs = useRef([]);

  // Generate random bubble positions
  useEffect(() => {
    const bubbleCount = 15;
    bubbleRefs.current = Array(bubbleCount)
      .fill()
      .map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 150 + 50, // Size between 50-200px
        color: Math.random() > 0.5 ? "purple" : "indigo", // Randomly choose color
      }));
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center"
    >
      {/* Cursor-reactive bubbles */}
      {bubbleRefs.current.map((bubble, index) => {
        // Calculate position based on mouse and initial position
        const offsetX = (mousePosition.x - 50) / 10;
        const offsetY = (mousePosition.y - 50) / 10;

        // Different bubbles move at different rates
        const moveFactor = ((index % 3) + 1) * 0.5;

        return (
          <div
            key={index}
            className="absolute rounded-full blur-xl opacity-20 transition-transform duration-1000"
            style={{
              left: `${bubble.x + offsetX * moveFactor}%`,
              top: `${bubble.y + offsetY * moveFactor}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: `radial-gradient(circle, ${
                bubble.color === "purple" ? "#a855f7" : "#6366f1"
              } 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${
                1 + Math.abs(offsetX + offsetY) / 100
              })`,
            }}
          />
        );
      })}

      {/* Content container - centered vertically and horizontally */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Text and button container - centered */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
              Rumors
            </span>
          </h1>

          {/* Content lines */}
          <div className="mb-10 space-y-4">
            <p className="text-xl text-gray-200 leading-relaxed">
              <span className="text-purple-300">⚡</span> Where gossip meets
              fact-checking in digital pajamas
            </p>
            <p className="text-xl text-gray-200 leading-relaxed">
              <span className="text-purple-300">🔍</span> Because believing
              everything you read is so 1995
            </p>
            <p className="text-xl text-gray-200 leading-relaxed">
              <span className="text-purple-300">🛡️</span> Your personal BS
              detector when scrolling gets wild
            </p>
          </div>

          {/* Get Started button with funny text */}
          <div
            className="inline-block relative mb-8 p-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{
              transform: `perspective(1000px) rotateX(${
                (mousePosition.y - 50) / 15
              }deg) rotateY(${(mousePosition.x - 50) / -15}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <Link href="/login">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white py-6 px-20 rounded-full text-xl font-semibold">
                <span className="mr-2">Unleash Truth Mode</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Account options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-300">
            <span>Already a truth seeker?</span>
            <Link
              href="/login"
              className="text-purple-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <span className="hidden sm:block">•</span>
            <Link
              href="/register"
              className="text-purple-300 hover:text-white transition-colors"
            >
              Join the fact squad
            </Link>
          </div>
        </div>
      </div>

      {/* Simple gradient footer */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
    </section>
  );
}

export default HeroSection;
