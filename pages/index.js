import React from "react";

import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";

const Home = ({ products, bannerData }) => {
	return (
		<>
			<HeroBanner HeroBanner={bannerData.length && bannerData[0]} />
			<div className='home-heading'>
				<h2>New products</h2>
				<p>New appearel and designs every week</p>
			</div>
			<div className='products-container'>
				{products?.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
			<FooterBanner footerBanner={bannerData && bannerData[0]} />
		</>
	);
};

export const getServerSideProps = async () => {
	const query = '*[_type == "product"]';
	const products = await client.fetch(query);
	const bannerQuery = '*[_type == "banner"]';
	const bannerData = await client.fetch(bannerQuery);

	return {
		props: { products, bannerData },
	};
};

export default Home;
