import Head from "next/head";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout/AllLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title>ShopStop</title>
				<meta name="description" content="Ecommerce store" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<h1>Shop here</h1>
			</Layout>
		</>
	);
}
