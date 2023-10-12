import Image from "next/image";
import React from "react";

export default function ProductItem({ product }) {
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
						<div className="text-center rounded-md bg-[#B9E0FF] p-1 font-light flex justify-center w-full items-center space-x-3">
							<span>Ordered: </span>
							<span className="col-span-8 text-center font-semibold">{product.quantityOrdered}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
