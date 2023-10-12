import Image from "next/image";
import React from "react";

export default function OrderItem({ productItem: product }) {
	const handleClick = async (type) => {
		if (type === "add")
			await fetch("/api/v1/private/User/Cart/add", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ product }),
			})
				.then(async (response) => {
					if (!response.ok) throw new Error(await response.text());
				})
				.catch((error) => {
					const errorObject = JSON.parse(error.message);

					console.log(errorObject);
				});
		else if (type === "remove")
			await fetch("/api/v1/private/User/Cart/remove", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ product }),
			})
				.then(async (response) => {
					if (!response.ok) throw new Error(await response.text());
				})
				.catch((error) => {
					const errorObject = JSON.parse(error.message);

					console.log(errorObject);
				});
	};

	return (
		<div>
			<div className=" bg-[#8D9EFF] rounded-lg p-5 flex flex-col sm:flex-row  justify-between space-y-4">
				<div className="flex items-center space-x-6">
					<Image src={product.image_link} alt={product.name} width={100} height={100} />
					<div className="">
						<div className="font-medium text-xl">{product.name}</div>
						<div className="font-light">{product.description}</div>
					</div>
				</div>
				<div className="flex sm:justify-between sm:w-44">
					<div className="flex flex-col items-start sm:items-end space-y-1 sm:space-y-2 w-full">
						<div className="font-light line-through text-red-800 text-lg">₹{product.actual_price}</div>
						<div className="text-2xl">₹{product.offer_price}</div>
						<div className="text-center rounded-md bg-[#B9E0FF] p-1 font-light flex justify-between w-full items-center">
							<button className="cursor-pointer font-extrabold px-4 py-1 border-r-2 rounded-lg border-[#8D72E1] hover:bg-[#8D9EFF]/60" onClick={() => handleClick("remove")}>
								<div className="flex ">-</div>
							</button>
							<span className="col-span-8 text-center">{product.quantity}</span>
							<button className="cursor-pointer font-extrabold px-4 py-1 border-l-2 rounded-lg border-[#8D72E1] hover:bg-[#8D9EFF]/60" onClick={() => handleClick("add")}>
								+
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
