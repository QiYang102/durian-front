import { Icon } from "@/components/ui/Icon";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { createFileRoute } from "@tanstack/react-router";
import { Text } from "@/components/ui/Text";
import { UserCircle } from "lucide-react";

interface CheckInStatusProps {
  userFullname?: string;
  selectedOutletName?: string;
  localStorageOutletID?: string | null;
}

export const Profile: React.FC<CheckInStatusProps> = ({
  userFullname = "-",
  selectedOutletName = "-",
  localStorageOutletID,
}) => {
  const isCheckedIn = localStorageOutletID && localStorageOutletID !== "null";
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isUserCheckedIn = userFullname && userFullname !== "null";

  useEffect(() => {
    if (isPopoverOpen) {
      const timeout = setTimeout(() => {
        setIsPopoverOpen(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isPopoverOpen]);
  return (
    <div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="grid h-9 gap-1 px-2">
            <button
              className={` ring-offset-background focus-visible:ring-ring dark:hover:bg-primary flex inline-flex h-9 items-center  justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 `}
            >
              <Icon
                className={`mr-2 h-4 w-4  ${
                  isCheckedIn ? "text-green-500" : "text-red-500"
                }`}
                name="check-circle"
              />
              {/* <Text variant="caption">{"Profile"}</Text> */}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="text-sm text-gray-700">
            <h3 className="mb-2 text-lg font-bold">Check-In Details</h3>
            <div className="text-center">
              <Text variant="default" color="systemBlack">
                {userFullname}
              </Text>
            </div>
            <div className="py-2 text-center">
              <Text variant="default" color="systemBlack">
                {isCheckedIn
                  ? selectedOutletName || "-"
                  : "Please check in a branch"}
              </Text>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
