import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Layout from "@/components/Layout/AllLayout";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import Order from "@/components/Orders/Order";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

export default function Orders() {
	const { fetcher } = useSWRConfig();

	const [totalAmount, setTotalAmount] = useState(0);
	const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);

	const { data: OrderData, error: OrderError } = useSWR("/api/v1/private/Admin/Orders", fetcher);

	useEffect(() => {
		if (OrderData && OrderData.data.Orders.length > 0) {
			const sumOrderTotal = OrderData.data.Orders.reduce((acc, order) => (order.discount ? acc + order.discountTotal : acc + order.orderTotal), 0);
			const sumOrderDiscountTotal = OrderData.data.Orders.reduce((acc, order) => order.discount && acc + order.orderTotal - order.discountTotal, 0);

			setTotalAmount(sumOrderTotal);
			setTotalDiscountAmount(sumOrderDiscountTotal);
		}
	}, [OrderData]);

	if (OrderError) return <CustomErrorCentered code={OrderError.status} message={OrderError.info.message} />;
	if (!OrderData) return <LoadingCentered />;

	return (
		<Layout>
			<div className="flex flex-col space-y-5">
				<h1 className="flex items-center">
					<ShoppingCartIcon className="mr-3" width={50} />
					<span className="font-light text-2xl">All Orders</span>
				</h1>
				{OrderData.data.Orders.length > 0 ? (
					<>
						{OrderData.data.Orders.map((order) => {
							return <Order key={order.id} order={order} />;
						})}
						<div className="flex flex-col items-end">
							<div>
								<div className="space-x-3">
									<span className="font-light text-2xl">Total Sales:</span>
									<span className="font-semibold text-3xl">{totalAmount}</span>
								</div>
								<div className="">
									<div className="space-x-3">
										<span className="font-light text-2xl">Total Discount:</span>
										<span className="font-semibold text-3xl">{totalDiscountAmount}</span>
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="text-center font-light text-3xl">No orders made.</div>
				)}
			</div>
		</Layout>
	);
}
