import Head from "next/head";
import Layout from "@/components/Layout/AllLayout";
import cookie from "cookie";
import useSWR, { useSWRConfig } from "swr";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import ProductItem from "@/components/Products/ProductItem";
import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import { useState } from "react";

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

	const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
	const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);

	const { data: ProductsData, error: ProductsError } = useSWR("/api/v1/private/Admin/Products", fetcher);

	if (ProductsError) return <CustomErrorCentered code={ProductsError.status} message={ProductsError.info.message} />;
	if (!ProductsData) return <LoadingCentered />;

	return (
		<>
			<Head>
				<title>ShopStop</title>
				<meta name="description" content="ShopStop Admin" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<div className="flex flex-col space-y-5">
					<h1 className="flex items-center">
						<span className="font-light text-2xl">All Products</span>
					</h1>
					<div className="bg-[#8D72E1] rounded-lg flex flex-col p-4 space-y-3">
						{ProductsData.data.Products.length > 0 ? (
							<>
								{ProductsData.data.Products.map((product) => (
									<ProductItem key={product.id} product={product} />
								))}
							</>
						) : (
							<div className="text-center font-light text-3xl">No products available.</div>
						)}
					</div>
				</div>
			</Layout>
		</>
	);
}
