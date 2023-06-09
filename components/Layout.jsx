import React from "react";
import Head from "next/head";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundBlur from "./BackgroundBlur";

const Layout = ({ children }) => {
	return (
		<div className='layout'>
			<BackgroundBlur numOrbs={3} />
			<Head>
				<title>Store</title>
			</Head>
			<header>
				<Navbar />
			</header>
			<main className='main-container'>{children}</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default Layout;
