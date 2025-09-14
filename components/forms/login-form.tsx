import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm({ showPassword, setShowPassword }: IProps) {
    const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "",
        password: "",
    },
    });

    const onLoginSubmit = (values: LoginValues) => {
    console.log("Sign In submitted:", values);
    };

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input
                        placeholder="Enter your email"
                        {...field}
                        id="email"
                        type="email"
                        className="border-foreground/20 focus:border-accent"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Input
                        placeholder="Enter your password"
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="border-foreground/20 focus:border-accent pr-10"
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground"
                        tabIndex={-1}
                        >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white mt-3">
                Sign In
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
