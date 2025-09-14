"use client"

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"

function CtaButton({ children, className }: IProps) {
  const router = useRouter()

	const handleClick = () => {
		router.push("/auth?auth=signup")
	}

  return <Button className={className} onClick={handleClick}>{children}</Button>;
}

export default CtaButton;


interface IProps {
    children: React.ReactNode;
		className?: string;
}