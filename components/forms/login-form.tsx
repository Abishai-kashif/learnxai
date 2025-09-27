import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm({ showPassword, setShowPassword }: IProps) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login, isLoading } = useAuth();

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onLoginSubmit = async (values: LoginValues) => {
        setError(null);
        
        try {
            await login(values.email, values.password);
            router.push('/chat');
        } catch (error) {
            console.error("Error signing in user:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred");
        }
    };

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
                
                <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors pr-12"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>
        </Form>
    );
}

interface IProps {
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
}

export default LoginForm;
