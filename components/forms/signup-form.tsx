import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpValues = z.infer<typeof signupSchema>;


import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";

function SignupForm({ 
											showPassword,
											setShowPassword,
											showConfirmPassword,
											setShowConfirmPassword 
										}: IProps) {
  const signupForm = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSignupSubmit = async (values: SignUpValues) => {
		const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
		const URL = `${BASE_URL}/signup`;

		const user = {
			name: values.name,
			email: values.email,
			password: values.password
		}

		try {
			const response = await fetch(URL, {
				method: "POST",
				body: JSON.stringify(user)
			})

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			redirect("/dashboard")

			// const data = await response.json();
			// console.log(data);
		} catch (error) {
			console.log('Error signing up user: ', error);
		}
  };


  return (
			<Form {...signupForm}>
					<form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
					<FormField
							control={signupForm.control}
							name="name"
							render={({ field }) => (
							<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
									<Input
											placeholder="Enter your full name"
											{...field}
											id="signup-name"
											type="text"
											className="border-foreground/20 focus:border-accent"
									/>
									</FormControl>
									<FormMessage />
							</FormItem>
							)}
					/>

					<FormField
							control={signupForm.control}
							name="email"
							render={({ field }) => (
							<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
									<Input
											placeholder="Enter your email"
											{...field}
											id="signup-email"
											type="email"
											className="border-foreground/20 focus:border-accent"
									/>
									</FormControl>
									<FormMessage />
							</FormItem>
							)}
					/>

					<FormField
							control={signupForm.control}
							name="password"
							render={({ field }) => (
							<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
									<div className="relative">
											<Input
											placeholder="Create a password"
											{...field}
											id="signup-password"
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

					<FormField
							control={signupForm.control}
							name="confirmPassword"
							render={({ field }) => (
							<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
									<div className="relative">
											<Input
											placeholder="Confirm your password"
											{...field}
											id="confirm-password"
											type={showConfirmPassword ? "text" : "password"}
											className="border-foreground/20 focus:border-accent pr-10"
											/>
											<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground"
											tabIndex={-1}
											>
											{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
									</div>
									</FormControl>
									<FormMessage />
							</FormItem>
							)}
					/>

					<div className="flex items-center space-x-2">
							<FormField
							control={signupForm.control}
							name="terms"
							render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
									<FormControl>
											<Checkbox
											id="terms"
											checked={!!field.value}
											onCheckedChange={(checked) => field.onChange(!!checked)}
											/>
									</FormControl>
									<FormLabel className="text-sm text-foreground/70" htmlFor="terms">
											I agree to the{" "}
											<button type="button" className="text-orange-500 hover:text-orange-500/80">
											Terms &amp; Conditions
											</button>
									</FormLabel>
									<FormMessage />
									</FormItem>
							)}
							/>
					</div>

					<Button type="submit" className="w-full bg-black hover:bg-black/90 text-white">
							Create Account
					</Button>
					</form>
			</Form>
  );
}

interface IProps {
	showPassword: boolean;
	setShowPassword: (showPassword: boolean) => void;
	showConfirmPassword: boolean;
	setShowConfirmPassword: (showPassword: boolean) => void;
}

export default SignupForm;
