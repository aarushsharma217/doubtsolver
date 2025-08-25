import { useQuery } from "@tanstack/react-query";

interface AuthUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  subscription?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
