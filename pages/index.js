import React from "react";

import { client } from "../lib/client";
import { Product, HeroBanner, Artwork } from "../components";
import styles from "../styles/Product.module.css";

const Home = ({ products, bannerData, images }) => {
	// console.log(products);
	return (
		<>
			<HeroBanner HeroBanner={bannerData.length && bannerData[0]} />
			<Artwork images={images} />
			<div className={styles.home_heading}>
				<h2>
					New products <span className={styles.heading_bg}>every week</span>
				</h2>
				<p>These products were added in the last 7 days:</p>
			</div>
			<div className={styles.products_container_home}>
				{products?.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
	const query = `*[_type == "product" && createdAt > "${oneWeekAgo}"]`;
	const products = await client.fetch(query);
	const bannerQuery = '*[_type == "banner"]';
	const bannerData = await client.fetch(bannerQuery);
	const imageQuery = `*[_type == "images"]{
      image {
        file,
        altText,
        sizes
      }
    }`;

	const images = await client.fetch(imageQuery);

	return {
		props: { products, bannerData, images },
	};
};

export default Home;
