import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Lock, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginCredentials.email, loginCredentials.password);
      toast({
        title: "Login Successful",
        description: "Welcome to Safaricom CyberGuard Dashboard",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDigitalIdentityLogin = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Digital Identity login will be available in a future update",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Safaricom CyberTwin</h1>
          </div>
          <p className="text-muted-foreground">
            Secure access to your cybersecurity dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Access Dashboard</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="digital-identity" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Digital ID
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginCredentials.email}
                        onChange={(e) =>
                          setLoginCredentials({ ...loginCredentials, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginCredentials.password}
                        onChange={(e) =>
                          setLoginCredentials({ ...loginCredentials, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="digital-identity" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="p-6 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                    <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Safaricom Digital Identity</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secure authentication using your Safaricom Digital Identity credentials
                    </p>
                  </div>
                  <Button
                    onClick={handleDigitalIdentityLogin}
                    className="w-full"
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Login with Digital Identity"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Safaricom PLC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;