import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useInteractionTracking() {
  const [clickCount, setClickCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const trackInteraction = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 7) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setClickCount(0);
      }, 5000);
    }
  };

  const NotificationBanner = () =>
    showNotification ? (
      <div className="absolute top-20 left-4 right-4 bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 text-white p-4 rounded-lg shadow-lg animate-bounce z-50">
        <p className="text-center text-xs mt-1">
          🎉 July 2025 Interns were here 🎉
        </p>
        <p className="text-center text-[10px] mt-1 opacity-90">
          You found our secret!
        </p>
      </div>
    ) : null;

  return { trackInteraction, NotificationBanner };
}

export function useNavigationMetrics() {
  const [metrics, setMetrics] = useState<string[]>([]);
  const [showMetricAlert, setShowMetricAlert] = useState(false);

  const recordMetric = (position: "left" | "right") => {
    const newMetrics = [...metrics, position].slice(-4);
    setMetrics(newMetrics);

    const pattern = ["left", "left", "right", "right"];
    const isValid = newMetrics.every((m, i) => m === pattern[i]);

    if (!isValid) {
      console.log(
        "%c❌ Wrong pattern! Starting over...",
        "color: #ff6b6b; font-size: 12px; font-weight: bold;",
      );
      console.log(
        "%c💡 Hint: Try Left → Left → ? → ?",
        "color: #868e96; font-size: 11px; font-style: italic;",
      );
      setMetrics([]);
      return;
    }

    const count = newMetrics.length;

    if (count === 1) {
      console.log(
        "%c🔍 Step 1/4 complete! Keep going...",
        "color: #ffd43b; font-size: 12px;",
      );
    } else if (count === 2) {
      console.log(
        "%c✨ Step 2/4 complete! You're getting warmer...",
        "color: #ffd43b; font-size: 12px;",
      );
    } else if (count === 3) {
      console.log(
        "%c🔥 Step 3/4 complete! Almost there!",
        "color: #ff922b; font-size: 12px;",
      );
    }

    console.log("Pattern so far:", newMetrics.join(" → "));

    if (newMetrics.join(",") === "left,left,right,right") {
      setShowMetricAlert(true);

      console.log(`
      ╔════════════════════════════════════════════════════════╗
      ║                                                        ║
      ║         ██████╗██╗  ██╗ █████╗ ███████╗███████╗        ║
      ║        ██╔════╝██║  ██║██╔══██╗██╔════╝██╔════╝        ║
      ║        ██║     ███████║███████║███████╗█████╗          ║
      ║        ██║     ██╔══██║██╔══██║╚════██║██╔══╝          ║
      ║        ╚██████╗██║  ██║██║  ██║███████║███████╗        ║
      ║         ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝        ║
      ║                                                        ║
      ╚════════════════════════════════════════════════════════╝
    `);

      console.log(
        "%c🎉 Easter Egg Unlocked! 🎉",
        "color: #ff6b6b; font-size: 20px; font-weight: bold;",
      );

      console.log(
        "%c🚀 Built with ❤️ by PX & JY - July 2025 Interns",
        "color: #0066ff; font-size: 16px; font-weight: bold;",
      );

      console.log(
        "%c💡 Tip: Click the logo 7 times for a surprise...",
        "color: #51cf66; font-size: 12px;",
      );

      setTimeout(() => {
        setShowMetricAlert(false);
        setMetrics([]);
      }, 3000);
    }
  };

  const MetricAlertBanner = () =>
    showMetricAlert ? (
      <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs p-3 rounded shadow-lg z-[9999] animate-bounce text-center">
        <p className="font-bold">🎮 You cracked the code!</p>
        <p className="text-[10px] mt-1">PX & JY - Master Debuggers</p>
      </div>
    ) : null;

  const MetricIndicators = () => (
    <div className="hidden group-data-[state=expanded]:flex justify-center gap-2 py-2">
      <button
        onClick={() => recordMetric("left")}
        className="h-2 w-2 rounded-full bg-gray-300 hover:bg-blue-500 transition-colors"
        aria-label="Left pattern"
      />
      <button
        onClick={() => recordMetric("right")}
        className="h-2 w-2 rounded-full bg-gray-300 hover:bg-blue-500 transition-colors"
        aria-label="Right pattern"
      />
    </div>
  );

  return { MetricAlertBanner, MetricIndicators };
}

export function useKeyboardShortcuts() {
  const [shortcutActive, setShortcutActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey) {
        setShortcutActive(true);
      }
    };

    const handleKeyUp = () => {
      setShortcutActive(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return { shortcutActive };
}

export function useDeploymentFeedback() {
  const funnyMessages = [
    "✨ Deployed by PX & JY's magic ✨",
    "🐛 No bugs detected... probably 😄",
    "✅ Production-ready! (We hope 🤞)",
    "🎉 Another successful deploy by the interns!",
    "⚡ Faster than light deployment!",
    "🎯 Bullseye! Deployed perfectly!",
  ];

  const showRandomMessage = () => {
    const randomMsg =
      funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    toast.success(`${randomMsg}`);
    toast.success("- Intern Edition by PX & JY 😄");
    console.log(
      `%c${randomMsg}`,
      "color: #10b981; font-size: 14px; font-weight: bold;",
    );
    console.log(
      "%c- Brought to you by PX & JY",
      "color: #6366f1; font-size: 11px;",
    );
  };

  return { showRandomMessage };
}

export function useTaskEmptyState(tasksLength: number) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (tasksLength === 0) {
      const timer = setTimeout(() => {
        setShowEasterEgg(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowEasterEgg(false);
    }
  }, [tasksLength]);

  return { showEasterEgg };
}

export function useScrollTracking() {
  const [showScrollMessage, setShowScrollMessage] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10;

    if (isAtBottom && !showScrollMessage) {
      setShowScrollMessage(true);
      setTimeout(() => setShowScrollMessage(false), 3000);
    }
  };

  const ScrollMessage = () =>
    showScrollMessage ? (
      <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-2 text-xs font-bold animate-pulse">
        🎉 You scrolled all the way! - PX & JY 🎉
      </div>
    ) : null;

  return { handleScroll, ScrollMessage };
}

export function useProfileHover() {
  const [hoverDuration, setHoverDuration] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    intervalRef.current = setInterval(() => {
      setHoverDuration((prev) => {
        const newDuration = prev + 100;
        if (newDuration >= 3000) {
          setShowMessage(true);
          clearInterval(intervalRef.current);
          setTimeout(() => {
            setShowMessage(false);
            setHoverDuration(0);
          }, 3000);
        }
        return newDuration;
      });
    }, 100);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setHoverDuration(0);
  };

  const ProfileMessage = () =>
    showMessage ? (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl z-[9999] whitespace-nowrap text-sm font-bold animate-bounce">
        ✨ Looking good! - Built by interns ✨
      </div>
    ) : null;

  return { handleMouseEnter, handleMouseLeave, ProfileMessage };
}
