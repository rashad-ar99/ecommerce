import Image from "next/image";
import React from "react";
import { mutate } from "swr";

export default function User({ user }) {
	const handleClick = async () => {
		await fetch("/api/v1/private/Admin/Coupons/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: user.id }),
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(await response.text());

				mutate("/api/v1/private/Admin/Coupons");
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
					<div className="">
						<div className="font-medium text-xl space-x-2">
							<span>Email:</span>
							<span>{user.Email}</span>
						</div>
						<div className="font-light space-x-2">
							<span>ID:</span>
							<span>{user.id}</span>
						</div>
					</div>
				</div>
				<div className="flex sm:justify-between sm:w-44">
					<div className="flex flex-col items-start sm:items-end space-y-1 sm:space-y-2 w-full">
						<div className="text-center rounded-md bg-[#B9E0FF] p-1 font-light flex justify-center w-full items-center space-x-2">
							<span>Orders made:</span>
							<span className="col-span-8 text-center font-bold">{user.orders}</span>
						</div>
						<button className="text-center rounded-md bg-[#8D72E1] hover:bg-[#6C4AB6]/80 text-white p-1 font-light flex justify-center w-full items-center" onClick={handleClick}>
							Create Coupon
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
