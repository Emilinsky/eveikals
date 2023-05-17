import React, { useState } from "react";
import Link from "next/link";
import parse from "html-react-parser";

import { AiOutlineShoppingCart, AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { urlFor } from "../lib/client";

const Product = ({ product }) => {
	const { name, image, slug, price, details } = product;
	const [isClicked, setIsClicked] = useState(false);

	const handleBuyClick = () => {
		setIsClicked(true);
	};

	const handleRemoveClick = () => {
		setIsClicked(false);
	};

	return (
		<>
			{/* {slug && (
				<div>
					<Link href={`/product/${slug.current}`}>
						<div className='product-card'>
							<img src={urlFor(image && image[0])} width={225} height={225} className='product-image' />
							<p className='product-name'>{name}</p>
						</div>
					</Link>
				</div>
			)} */}
			{slug && (
				<div className='wrapper'>
					<div className='container'>
						<div className='top'>
							<Link href={`/product/${slug.current}`}>
								<img src={urlFor(image && image[0])} />
							</Link>
						</div>
						<div className={`bottom ${isClicked ? "clicked" : ""}`}>
							<div className='left'>
								<div className='details'>
									<p className='product-name'>{name}</p>
									<p className='product-price-card'>€{price}</p>
								</div>
								<div className='buy' onClick={handleBuyClick}>
									<AiOutlineShoppingCart size={35} />
								</div>
							</div>
							<div className='right'>
								<div className='done'>
									<AiOutlineCheckCircle size={35} />
								</div>
								<div className='details'>
									<p className='product-name-added'>{name}</p>
									<p>Added to your cart</p>
								</div>
								<div className='remove' onClick={handleRemoveClick}>
									<AiOutlineCloseCircle size={35} />
								</div>
							</div>
						</div>
					</div>
					<div className='inside'>
						<div className='icon'>
							<AiOutlineInfoCircle size={30} />
						</div>
						<div className='contents'>{parse(details)}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Product;
