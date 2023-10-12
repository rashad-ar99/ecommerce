import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import LoadingCentered from "../Loading/LoadingCentered";
import CustomErrorCentered from "../Errors/CustomErrorCentered";
import Loading from "../Loading/Loading";

function ProductItem({ product }) {
	const { fetcher } = useSWRConfig();

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

	const { data: ProductData, error: ProductError } = useSWR(`/api/v1/private/User/Cart/Product/${product.id}`, fetcher, { refreshInterval: 500 });

	if (ProductError) return <CustomErrorCentered code={ProductError.status} message={ProductError.info.message} />;
	if (!ProductData) return <Loading />;

	return (
		<div className="rounded-lg bg-[#B9E0FF] flex flex-col justify-between m-3 p-5">
			<div className="">
				<div className="flex justify-center">
					<Image className="bg-white p-3 rounded-lg" src={product.image_link} width={150} height={150} alt={product.name} />
				</div>
				<div className="mt-2 text-xl font-extralight">{product.name}</div>
				<div className="mt-2 flex flex-col">
					<span className="line-through">₹{product.actual_price}</span>
					<span className="text-lg text-red-500">₹{product.offer_price}</span>
					<span>{product.description.substring(0, 30)}...</span>
				</div>
			</div>

			<div className="mt-4">
				{!ProductData.data.product ? (
					<div className="text-center rounded-md bg-[#8D9EFF] p-1 text-white font-light cursor-pointer flex justify-center" onClick={() => handleClick("add")}>
						<ShoppingCartIcon className="mr-2" width={20} />
						Add to cart
					</div>
				) : (
					<div className="text-center rounded-md bg-[#8D9EFF] p-1 text-white font-light grid grid-cols-5">
						<button className="text-center hover:bg-[#6C4AB6]/80 rounded-md w-full cursor-pointer border-r-2 border-white" onClick={() => handleClick("remove")}>
							-
						</button>
						<span className="col-span-3 text-center text-white">{ProductData.data.product.quantity}</span>
						<button className="text-center hover:bg-[#6C4AB6]/80 rounded-md w-full cursor-pointer border-l-2 border-white" onClick={() => handleClick("add")}>
							+
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductItem;
