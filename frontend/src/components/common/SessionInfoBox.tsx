// components/SessionInfoBox.jsx (Client Component)
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SessionInfoBox({ session }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Hover trigger button */}
      <div
        className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Session info popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-0 w-72 bg-slate-800 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-xl border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3 border-b border-slate-700 pb-2">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-pink-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h3 className="text-white font-medium">
                  {session.user?.name || "User"}
                </h3>
                <p className="text-gray-300 text-sm truncate">
                  {session.user?.email || "No email"}
                </p>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <pre className="text-gray-200 font-mono text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-700">
              <p className="text-xs text-gray-400">
                Session expires: {new Date(session.expires).toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
