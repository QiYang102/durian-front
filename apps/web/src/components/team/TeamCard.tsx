import { Team } from "@ttm/api/types/models/team";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";

interface TeamCardProps {
  team: Team;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

import { Link } from "@tanstack/react-router";

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Link
      to="/team/$teamId"
      params={{ teamId: team.id.toString() }}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          {team.team_image ? (
            <img
              src={getHttpsImageUrl(team.team_image) ?? ""}
              alt={team.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-purple-600 font-semibold text-lg">
              {getInitials(team.name)}
            </span>
          )}
        </div>
        <h3 className="text-base font-medium text-gray-900 text-center max-w-32 md:max-w-24 lg:max-w-32 truncate">
          {team.name}
        </h3>
      </div>
    </Link>
  );
};

export default TeamCard;
