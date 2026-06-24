import { useNavigate } from "@tanstack/react-router";
import { User } from "@ttm/api/types/models/user";
import { listUsers } from "@ttm/api/modules/user";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Loading } from "../ui/Loading";
import { User as UserIcon } from "lucide-react";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";

const UserCard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } = listUsers(
    ["all-users"],
    {
      sort: ["-id"],
      page: 1,
      per_page: 1000,
    },
    {},
  );

  const { users } = data || {};

  const navigateToUser = (user: User) => {
    navigate({
      to: "/user/$userId",
      params: { userId: user.id.toString() },
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin") {
      return "blue";
    }
    if (roleLower === "member") {
      return "green";
    }
    return "default";
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <Card>
          <CardContent>
            <Loading size="md" showText text="Loading user details..." />
          </CardContent>
        </Card>
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Users"
          message="We encountered an error while loading the user. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <UserIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => navigateToUser(user)}
            >
              <CardContent className="py-8 px-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img
                      src={getHttpsImageUrl(user.image) ?? ""}
                      alt={user.fullname || user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  )}
                </div>

                {user.role && (
                  <Badge
                    color={getRoleBadgeColor(user.role)}
                    className="w-20 flex justify-center -ml-1 self-center"
                  >
                    {user.role}
                  </Badge>
                )}

                <div>
                  <h3 className="text-lg font-semibold">
                    {user.fullname || "-"}
                  </h3>
                </div>

                <div className="flex items-center text-sm w-full justify-center">
                  <span className="truncate">{user.email || ""}</span>
                </div>

                <div className="flex items-center text-sm">
                  <span>{user.mobile_number || ""}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default UserCard;
