import React, { useEffect } from "react";
import CartItem from "./CartItem";

export default function Cart({ Cart, discount = false, orderTotal, setOrderTotal, discountTotal, setdiscountTotal }) {
	useEffect(() => {
		const total = Cart.productItems.reduce((amount, productItem) => amount + productItem.quantity * productItem.offer_price, 0);

		setOrderTotal(total);
		setdiscountTotal(total * 0.9);
	}, [Cart, discount]);

	return (
		<div className="bg-[#8D72E1] rounded-lg flex flex-col p-4 space-y-3">
			{Cart.productItems.map((productItem) => (
				<CartItem key={productItem.id} productItem={productItem} />
			))}
			<div className="flex justify-end font-light text-3xl">
				<div className="space-x-4 flex items-end">
					<span>Total:</span>
					<div className="flex flex-col">
						<span className={`font-semibold ${discount && "text-lg line-through text-red-800"}`}>₹{orderTotal}</span>
						<span className={`font-semibold ${!discount && "hidden"}`}>₹{discountTotal}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
