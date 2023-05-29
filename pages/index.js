import React from "react";

import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";
import styles from "../styles/Product.module.css";

const Home = ({ products, bannerData }) => {
	// console.log(products);
	return (
		<>
			<HeroBanner HeroBanner={bannerData.length && bannerData[0]} />
			<div className='home-heading'>
				<h2>New products every week</h2>
				<p>These products were added in the last 7 days:</p>
			</div>
			<div className={styles.products_container}>
				{products?.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
			<FooterBanner footerBanner={bannerData && bannerData[0]} />
		</>
	);
};

export const getServerSideProps = async () => {
	const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
	const query = `*[_type == "product" && createdAt > "${oneWeekAgo}"]`;
	const products = await client.fetch(query);
	const bannerQuery = '*[_type == "banner"]';
	const bannerData = await client.fetch(bannerQuery);

	return {
		props: { products, bannerData },
	};
};

export default Home;
