import { Navigate } from "@tanstack/react-router";
import { useSession } from "@ttm/context";

const withFeatureGuard = (WrappedComponent: any, requiredFeature: string) => {
  return function FeatureGuard(props: any) {
    const { user, isLoading, accessToken } = useSession();

    console.log("FeatureGuard check:", {
      requiredFeature,
      user: !!user,
      accessToken: !!accessToken,
      isLoading,
      userFeatures: user?.feature_access,
      hasAccess: user?.feature_access?.includes(requiredFeature)
    });

    if (isLoading) {
      console.log("feature guard loading");
      return <div>Loading...</div>;
    }

    if (!user && !accessToken) {
      console.log("User not authenticated");
      return <div>Checking authentication...</div>;
    }

    if (user?.feature_access?.includes(requiredFeature)) {
      console.log("User authenticated and has permission");
      return <WrappedComponent {...props} />;
    } else {
      console.log("User authenticated but no permission for this feature");
      return <Navigate to="/" replace />;
    }
  };
};

export default withFeatureGuard;
