import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    const userString = searchParams.get("user");

    if (token && userString) {
      try {
        const user: User = JSON.parse(decodeURIComponent(userString));
        // Here you would typically store the JWT token securely (e.g., in an HttpOnly cookie)
        // For this example, we'll just log the user in on the client-side
        login(user, token, true); // Defaulting rememberMe to true
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${user.name || user.email}!`,
        });

        navigate("/"); // Redirect to dashboard
      } catch (error) {
        console.error("Failed to parse user data from callback", error);
        toast({
          title: "Login Failed",
          description: "There was an error processing your login. Please try again.",
          variant: "destructive",
        });
        navigate("/login");
      }
    } else {
      // Handle cases where the callback is hit without the required params
      toast({
        title: "Invalid Login Attempt",
        description: "The login callback was incomplete.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p>Processing your login...</p>
    </div>
  );
};

export default AuthCallback;
