import { AlertTriangle } from "lucide-react";
import Marquee from "react-fast-marquee";

export default function MarqueeComponent() {
  return (
    <div className="border border-red-500 bg-red-100 text-red-500 p-3 rounded flex items-center overflow-hidden">
      <AlertTriangle className="flex-shrink-0 mr-2 w-5 h-5" />
      <Marquee speed={50} pauseOnHover className="pointer">
        <span>
          It&apos;s <strong className="font-bold">Friday</strong>. Please mark
          your completed tasks and check in your code. Otherwise, the task will
          be moved to the next iteration.
        </span>
      </Marquee>
    </div>
  );
}
