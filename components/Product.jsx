import React from "react";
import Link from "next/link";

import { urlFor } from "../lib/client";

const Product = ({ product }) => {
	const { name, image, slug } = product;

	return (
		<>
			{slug && (
				<div>
					<Link href={`/product/${slug.current}`}>
						<div className='product-card'>
							<img src={urlFor(image && image[0])} width={225} height={225} className='product-image' />
							<p className='product-name'>{name}</p>
						</div>
					</Link>
				</div>
			)}
		</>
	);
};

export default Product;
