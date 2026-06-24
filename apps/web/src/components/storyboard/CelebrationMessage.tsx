interface CelebrationMessageProps {
  variant?: "empty" | "banner";
  className?: string;
}

export default function CelebrationMessage({
  variant = "empty",
  className = "",
}: CelebrationMessageProps) {
  if (variant === "banner") {
    return (
      <div
        className={`border border-green-500 bg-green-100 text-green-700 p-3 rounded text-center font-semibold ${className}`}
      >
        🎉 Good job everyone, we survived another week! 🎉
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>
        <div className="relative text-6xl animate-bounce">🎉</div>
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
        Good job everyone, we survived another week!
      </h3>
      <div className="flex gap-2 justify-center text-3xl mt-4">
        <span className="animate-bounce" style={{ animationDelay: "0s" }}>
          🎊
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
          ✨
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
          🎈
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>
          🌟
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
          🎉
        </span>
      </div>
    </div>
  );
}
