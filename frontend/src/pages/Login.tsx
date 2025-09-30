import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { login } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";



const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { setUser } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { user, token } = await api.post('/auth/login', { email, password });
			login(user, token, rememberMe);
			setUser(user);
			toast({
				title: "Success",
				description: "Logged in successfully!",
			});
			navigate("/");
		} catch (error) {
			const message = error instanceof Error ? error.message : "An unknown error occurred";
			toast({
				title: "Error",
				description: message || "Login failed. Check credentials or if the server is running.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDILogin = () => {
		// Redirect to the backend endpoint that starts the DI OAuth flow
		const diLoginUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/di/login`;
		window.location.href = diLoginUrl;
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-[400px]">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome Back</CardTitle>
					<CardDescription>
						Sign in to your GRC Assistant account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="john.doe@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} />
							<Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing In..." : "Sign In"}
						</Button>
					</form>
					
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button variant="outline" className="w-full" onClick={handleDILogin}>
						<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 12.22C21 6.5 16.5 2 10.78 2 5.5 2 2 6.5 2 12.22c0 4.42 2.86 8.17 6.84 9.48.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.08.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.54 1.3.15 2.3.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.33 4.68-4.56 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10.02 10.02 0 0 0 21 12.22Z" />
						</svg>
						Login with DI
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
