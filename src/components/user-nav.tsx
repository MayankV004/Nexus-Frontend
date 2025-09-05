"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogout, setLogout] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const router = useRouter();

  const { user, logout, fetchUserProfile, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    setLogout(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to logout");
      }
    } finally {
      setLogout(false);
    }
  };

  // Fetch user profile if not already loaded
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && !user) {
        setIsLoadingProfile(true);
        try {
          await fetchUserProfile();
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to load profile"
          );
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user, fetchUserProfile]);

  // Don't render if not authenticated
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="z-10">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              {isLoadingProfile ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="hidden md:inline">
              {isLoadingProfile ? "Loading..." : user?.name || "User"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.name || "Loading..."}</span>
              <span className="text-xs text-gray-500">
                {user?.email || "Loading email..."}
              </span>
              {user?.isEmailVerified !== undefined && (
                <span
                  className={`text-xs ${
                    user.isEmailVerified ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {user.isEmailVerified ? "✓ Verified" : "⚠ Unverified"}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            disabled={isLogout}
            onClick={handleLogout}
          >
            {isLogout ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{isLogout ? "Logging out..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
