import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";

const ProductsBanner = ({ ProductsBanner }) => {
	return (
		<div className='products-banner-container'>
			<div>
				<p className='cream-solo'> {ProductsBanner.smallText}</p>
				<h1>{ProductsBanner.largeText1}</h1>
				<h3>{ProductsBanner.midText}</h3>
				<img src={urlFor(ProductsBanner.image)} alt='shirts' className='products-banner-image' />

				<div className=''>
					<Link href={`/product/${ProductsBanner.product}`}>
						<button type='button'>{ProductsBanner.textBtn}</button>
					</Link>
					<div className='desc'>
						<h5>Description</h5>
						<p> {ProductsBanner.desc}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductsBanner;
