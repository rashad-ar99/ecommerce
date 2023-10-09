import Head from "next/head";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout/AllLayout";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
	const getLayout = Component.getLayout || ((page) => page);

	return (
		<>
			<Head>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			</Head>
			<main className={`${inter.variable} font-sans`}>
				<Component {...pageProps} />
			</main>
		</>
	);
}
