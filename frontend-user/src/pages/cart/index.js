import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Layout from "@/components/Layout/AllLayout";
import CartView from "@/components/Carts/Cart";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR, { mutate, useSWRConfig } from "swr";

const offerOrder = 4;

export default function Cart() {
	const router = useRouter();

	const { fetcher } = useSWRConfig();

	const [discount, setDiscount] = useState(false);
	const [orderTotal, setOrderTotal] = useState(0);
	const [discountTotal, setdiscountTotal] = useState(0);

	const { data: CartData, error: CartError } = useSWR("/api/v1/private/User/Cart", fetcher);
	const { data: OrderData, error: OrderError } = useSWR("/api/v1/private/User/Order", fetcher);
	const { data: CouponData, error: CouponError } = useSWR("/api/v1/private/User/Coupon", fetcher);

	const handleCheckout = async () => {
		if (!CartData) return;

		await fetch("/api/v1/private/User/Order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Cart: CartData.data.Cart, discount, orderTotal, discountTotal, ...(Boolean(discount) && { couponID: CouponData.data.Coupons[0].id }) }),
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(await response.text());

				mutate("/api/v1/private/User/Order");
				mutate("/api/v1/private/User/Cart");
				router.push("/orders");
			})
			.catch((error) => {
				const errorObject = JSON.parse(error.message);

				console.log(errorObject);
			});
	};

	if (CartError) return <CustomErrorCentered code={CartError.status} message={CartError.info.message} />;
	if (OrderError) return <CustomErrorCentered code={OrderError.status} message={OrderError.info.message} />;
	if (CouponError) return <CustomErrorCentered code={CouponError.status} message={CouponError.info.message} />;

	if (!CartData) return <LoadingCentered />;
	if (!OrderData) return <LoadingCentered />;
	if (!CouponData) return <LoadingCentered />;

	return (
		<Layout>
			<div className="flex flex-col space-y-5">
				<h1 className="flex items-center">
					<ShoppingCartIcon className="mr-3" width={50} />
					<span className="font-light text-2xl">My Cart</span>
				</h1>
				{CartData.data.Cart.productItems.length > 0 ? (
					<>
						<div>
							<CartView Cart={CartData.data.Cart} discount={discount} orderTotal={orderTotal} setOrderTotal={setOrderTotal} discountTotal={discountTotal} setdiscountTotal={setdiscountTotal} />
						</div>
						{OrderData.data.Orders.length % offerOrder === offerOrder - 1 && CouponData.data.Coupons.length > 0 && (
							<div
								className="bg-[#6C4AB6] hover:bg-[#6C4AB6]/80 flex justify-center p-3 rounded-lg"
								onClick={() => {
									setDiscount(!discount);
								}}
							>
								<button>
									<span className="font-light text-2xl text-white">
										{discount ? "Remove" : "Apply"} Coupon - {CouponData.data.Coupons[0].Code} (10% off)
									</span>
								</button>
							</div>
						)}
						<div className="bg-[#8D9EFF] hover:bg-[#8D9EFF]/80 flex justify-center p-3 rounded-lg" onClick={handleCheckout}>
							<button>
								<span className="font-light text-2xl">Proceed to Checkout</span>
							</button>
						</div>
					</>
				) : (
					<div className="text-center font-light text-3xl">Your cart is empty.</div>
				)}
			</div>
		</Layout>
	);
}
