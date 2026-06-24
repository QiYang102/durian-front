import React, { useState, useEffect } from "react";

export default function SuccessCelebration() {
  const [fireworks, setFireworks] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(true);

    const interval = setInterval(() => {
      const newFirework = {
        id: Math.random(),
        x: Math.random() * 100,
        y: 20 + Math.random() * 30,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        size: 30 + Math.random() * 50,
      };

      setFireworks((prev) => [...prev, newFirework]);

      setTimeout(() => {
        setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id));
      }, 2000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-50 h-50 overflow-hidden">
      {/* Fireworks */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute animate-ping"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            width: `${firework.size}px`,
            height: `${firework.size}px`,
            backgroundColor: firework.color,
            borderRadius: "50%",
            opacity: 0.7,
            boxShadow: `0 0 ${firework.size / 2}px ${firework.color}`,
          }}
        />
      ))}

      {/* Success Message */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div
          className={`transition-all duration-1000 ${showMessage ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="mb-3">
            <svg
              className="w-16 h-16 mx-auto text-green-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-green-400 mb-4 drop-shadow-lg animate-pulse">
            SUCCESS!
          </h1>

          <p className="text-2xl md:text-2xl text-pink-300 mb-8">
            🎉 Good job everyone, we survived another week! 🎉
          </p>

          <div className="space-y-4 text-lg md:text-xl text-purple-300 max-w-2xl">
            <p>You did it! Your hard work and dedication have paid off.</p>
            <p className="text-yellow-300 font-semibold">
              Keep up the amazing work!
            </p>
          </div>
        </div>
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
}
