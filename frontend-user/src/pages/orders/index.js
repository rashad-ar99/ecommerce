import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Layout from "@/components/Layout/AllLayout";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import Order from "@/components/Orders/Order";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import useSWR, { useSWRConfig } from "swr";

export default function Orders() {
	const { fetcher } = useSWRConfig();

	const { data: OrderData, error: OrderError } = useSWR("/api/v1/private/User/Order", fetcher);

	if (OrderError) return <CustomErrorCentered code={OrderError.status} message={OrderError.info.message} />;
	if (!OrderData) return <LoadingCentered />;

	return (
		<Layout>
			<div className="flex flex-col space-y-5">
				<h1 className="flex items-center">
					<ShoppingCartIcon className="mr-3" width={50} />
					<span className="font-light text-2xl">My Orders</span>
				</h1>
				{OrderData.data.Orders.length > 0 ? (
					<>
						{OrderData.data.Orders.map((order) => (
							<Order key={order.id} order={order} />
						))}
					</>
				) : (
					<div className="text-center font-light text-3xl">You haven&apos;t made any orders.</div>
				)}
			</div>
		</Layout>
	);
}
