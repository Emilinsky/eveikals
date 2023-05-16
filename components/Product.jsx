import React from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";

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
			{slug && (
				<div className='wrapper'>
					<div className='container'>
						<img src={urlFor(image && image[0])} className='top' />
						<div className='bottom'>
							<div className='left'>
								<div className='details'>
									<p className='product-name'>{name}</p>
									<p>£250</p>
								</div>
								<div className='buy'>
                        <AiOutlineShoppingCart size={35}/>
								</div>
							</div>
							<div className='right'>
								<div className='done'>
									<i className='material-icons'>done</i>
								</div>
								<div className='details'>
									<p className='product-name'>{name}</p>
									<p>Added to your cart</p>
								</div>
								<div className='remove'>
									<i className='material-icons'>clear</i>
								</div>
							</div>
						</div>
					</div>
					<div className='inside'>
						<div className='icon'>
							<i className='material-icons'>line</i>
						</div>
						<div className='contents'>
							<table>
								<thead>
									<tr>
										<th>Width</th>
										<th>Height</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>3000mm</td>
										<td>4000mm</td>
									</tr>
									<tr>
										<th>Something</th>
										<th>Something</th>
									</tr>
									<tr>
										<td>200mm</td>
										<td>200mm</td>
									</tr>
									<tr>
										<th>Something</th>
										<th>Something</th>
									</tr>
									<tr>
										<td>200mm</td>
										<td>200mm</td>
									</tr>
									<tr>
										<th>Something</th>
										<th>Something</th>
									</tr>
									<tr>
										<td>200mm</td>
										<td>200mm</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Product;
