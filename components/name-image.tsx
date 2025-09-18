import React from "react";

 function formatName(name: string): string {
		return name
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
 }

function NameImage({ name }: { name: string }) {
  return <div>{ formatName(name) }</div>;
}

export default NameImage;
