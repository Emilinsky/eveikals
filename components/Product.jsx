import React, { useState, useEffect } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import { AiOutlineShoppingCart, AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { urlFor } from "../lib/client";
import { useStateContext } from "../context/StateContext"; // import useStateContext

const Product = ({ product }) => {
	const { name, image, slug, price, details } = product;
	const [isClicked, setIsClicked] = useState(false);

	// Define the selectedVariant state
	const [selectedVariant, setSelectedVariant] = useState(null);

	// Get onAdd, onRemove and cartItems function from context
	const { onAdd, onRemove, cartItems } = useStateContext();

	useEffect(() => {
		// Set the selectedVariant as defaultVariant or first variant
		const defaultVariant = product.variants.find((variant) => variant.is_default);
		setSelectedVariant(defaultVariant || product.variants[0]);
	}, [product]);

	const handleBuyClick = () => {
		setIsClicked(true);
		onAdd(product, 1, selectedVariant); // Add selectedVariant here
	};

	const handleRemoveClick = () => {
		setIsClicked(false);

		// Check if product exists in the cart
		const productInCart = cartItems.find((item) => item._id === product._id);

		if (productInCart) {
			// Call onRemove only if the product exists in the cart
			onRemove(product);
		} else {
			// Optionally, you can show a message to the user
			console.log("Product not found in the cart");
		}
	};

	return (
		<>
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
									<AiOutlineShoppingCart size={30} />
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
