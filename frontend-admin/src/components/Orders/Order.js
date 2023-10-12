import Image from "next/image";
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";

export default function Order({ order }) {
	return (
		<div className="bg-[#8D72E1] rounded-lg flex flex-col p-4 space-y-3">
			<div className="font-light text-lg space-x-2">
				<span>Order ID:</span>
				<span className="font-medium">{order.id}</span>
			</div>
			{order.discount && <div className="font-light text-lg text-red-900">Coupon applied (10% off)</div>}
			{order.Cart.productItems.map((productItem) => (
				<OrderItem key={productItem.id} productItem={productItem} />
			))}
			<div className="flex justify-end font-light text-3xl">
				<div className="space-x-4 flex items-end">
					<span>Total:</span>
					<div className="flex flex-col">
						<span className={`font-semibold ${order.discount && "text-lg line-through text-red-800"}`}>₹{order.orderTotal}</span>
						<span className={`font-semibold ${!order.discount && "hidden"}`}>₹{order.discountTotal}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
