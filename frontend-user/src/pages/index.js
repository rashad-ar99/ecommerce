import Head from "next/head";
import Layout from "@/components/Layout/AllLayout";
import cookie from "cookie";
import useSWR, { useSWRConfig } from "swr";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import ProductItem from "@/components/Products/ProductItem";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Link from "next/link";

export async function getServerSideProps({ req, resolvedUrl }) {
	const from = resolvedUrl.substring(1);

	const cookies = cookie.parse(req.headers.cookie || "");
	if (!cookies.JWTRefreshTokenExpiresAt || !cookies.JWTRefreshToken)
		return {
			redirect: {
				permanent: false,
				destination: "/auth/logout?" + new URLSearchParams({ reLogin: true, ...(Boolean(from) && { from }) }),
			},
		};
	return { props: {} };
}

export default function Home() {
	const { fetcher } = useSWRConfig();

	const { data: ProductData, error: ProductError } = useSWR("/api/v1/private/User/Product", fetcher);
	const { data: CartData, error: CartError } = useSWR("/api/v1/private/User/Cart", fetcher, { refreshInterval: 100 });

	if (ProductError) return <CustomErrorCentered code={ProductError.status} message={ProductError.info.message} />;
	if (CartError) return <CustomErrorCentered code={CartError.status} message={CartError.info.message} />;

	if (!CartData) return <LoadingCentered />;

	return (
		<>
			<Head>
				<title>ShopStop</title>
				<meta name="description" content="Ecommerce store" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<div className="flex flex-col sm:flex-row justify-between">
					<h1 className="text-3xl font-light m-3">Explore exclusive offers</h1>
					<div className="flex justify-end ">
						<Link href={"/cart"}>
							<div className="flex items-center rounded-3xl p-3 space-x-2 bg-[#8D72E1] hover:bg-[#8D72E1]/80 cursor-pointer">
								<ShoppingCartIcon className="text-white" width={25} />
								<span className="hidden sm:block text-white">Go to cart</span>
								{CartData.data.Cart.quantity > 0 && <span className="p-2 rounded-3xl bg-[#8D9EFF]">{CartData.data.Cart.quantity}</span>}
							</div>
						</Link>
					</div>
				</div>
				{!ProductData ? (
					<LoadingCentered />
				) : (
					<div className="grid grid-cols-2 sm:flex sm:flex-wrap space-x-3">
						{ProductData.data.Products.map((product) => (
							<ProductItem key={product.id} product={product} />
						))}
					</div>
				)}
			</Layout>
		</>
	);
}
