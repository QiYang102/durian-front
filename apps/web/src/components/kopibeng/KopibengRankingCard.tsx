import { TrophyIcon, UserIcon } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

// 0 in the array is second place, 1 is the first place, 2 is third place
const sizes = {
  0: {
    image: "w-24 h-24 md:w-20 md:h-20",
    icon: "w-10 h-10",
  },
  1: {
    image: "w-28 h-28 md:w-24 md:h-24",
    icon: "w-12 h-12",
  },
  2: {
    image: "w-24 h-24 md:w-20 md:h-20",
    icon: "w-10 h-10",
  },
};

interface KopibengRankingCardProps {
  place: 0 | 1 | 2;
  image: string;
  name: string;
  amount: number;
  isPlaceholder?: boolean;
}

export default function KopibengRankingCard({
  place,
  image,
  name,
  amount,
  isPlaceholder,
}: KopibengRankingCardProps) {
  const champian = place === 1;
  const size = sizes[place];

  return (
    <Card className="shadow-xl rounded-2xl transform hover:-translate-y-1 transition-transform duration-300">
      <CardContent
        className={`flex flex-col items-center gap-3 relative p-5 rounded-2xl shadow-inner hover:shadow-lg transition-shadow duration-300 ${champian && "bg-amber-100"}`}
      >
        <div className="relative">
          {champian && (
            <TrophyIcon className="absolute -top-3 -right-3 w-7 h-7 text-yellow-500 rotate-12" />
          )}
          <div
            className={`flex flex-row justify-center items-center ${size.image} rounded-full border-4 shadow-md object-cover ${champian && "border-yellow-400"}`}
          >
            {isPlaceholder ? (
              <span className="text-3xl text-gray-500">?</span>
            ) : image ? (
              <img
                className="w-full h-full rounded-full object-cover"
                src={image}
                alt="2nd place"
              />
            ) : (
              <UserIcon className={`${size.icon}`} />
            )}
          </div>
        </div>

        <p className={`font-bold text-lg text-center max-w-24 truncate`}>
          {name}
        </p>

        <p className="text-sm text-center">Total {amount}</p>
      </CardContent>
    </Card>
  );
}

// getHttpsImageUrl(image) ?? ""
