import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

export default function Product({ product }) {
	return (
		<div className="bg-[#8D72E1] rounded-lg flex flex-col p-4 space-y-3">
			<div className="font-light text-lg space-x-2">
				<span>Product ID:</span>
				<span className="font-medium">{product.id}</span>
			</div>
			{productproductItems.map((productItem) => (
				<ProductItem key={productItem.id} productItem={productItem} />
			))}
		</div>
	);
}
