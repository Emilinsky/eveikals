import React from "react";

import { Product } from "../components";

function SimilarProducts({ products }) {
	return (
		<div className='similar-products-wrapper'>
			<h2>Similar products:</h2>
			<div className='marquee'>
				<div className='similar-products-container track'>
					{products.map((item) => (
						<Product key={item._id} product={item} />
					))}
				</div>
			</div>
		</div>
	);
}

export default SimilarProducts;
