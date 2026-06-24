import { useRouter } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { useSession } from "@ttm/context";

export default function NotFoundPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  
  // Check if user is authenticated based on user presence
  const isAuthenticated = !!user && !isLoading;

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <div className="text-6xl font-light text-gray-300">404</div>
          <h1 className="text-2xl font-medium text-gray-800">
            Oops! Page not found
          </h1>
          <p className="text-gray-500 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        {isAuthenticated && (
          <Button
            onClick={() => router.navigate({ to: "/" })}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        )}
      </div>
    </Container>
  );
}