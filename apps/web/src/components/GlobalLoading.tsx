import loadingGif from "@/assets/logo-loading-animation.gif";

interface GlobalLoadingProps {
  isOpen: boolean;
  text?: string;
}

export default function GlobalLoading({ isOpen, text }: GlobalLoadingProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
        <img
          src={loadingGif}
          alt="Loading..."
          className="w-80 h-80 md:w-96 md:h-96 object-contain"
        />
        {text && (
          <p className="text-slate-900 dark:text-white text-2xl font-extrabold tracking-wide animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
