import React from "react";

function formatName(name: string): string {
	return name
		.toLowerCase()
		.split(" ")
		.slice(0, 3)
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
}

function NameImage({ name }: { name: string }) {
  return <div>{ formatName(name) }</div>;
}

export default NameImage;
