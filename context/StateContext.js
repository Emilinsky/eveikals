import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);
	const [qty, setQty] = useState(1);

	let foundProduct;
	let index;

	const onAdd = (product, quantity, variant) => {
		let variantImage;
		if (product.images) {
			variantImage = product.images.find((image) => image.variant_ids.includes(variant.id));
		} else {
			// use the default product image when product.images is not available
			variantImage = product.image;
		}

		// console.log("Variant Image: ", variantImage);
		const productToAdd = { ...product, variant, variantImage };

		const checkProductInCart = cartItems.find((item) => item._id === productToAdd._id);

		const price = variant ? variant.price : product.price;
		setTotalPrice((prevTotalPrice) => prevTotalPrice + price * quantity);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === productToAdd._id) {
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
				}
				return cartProduct; // return current product when condition is not met
			});
			setCartItems(updatedCartItems);
		} else {
			productToAdd.quantity = quantity;
			setCartItems([...cartItems, { ...productToAdd }]);
		}
		toast.success(`${qty} ${product.name} added to cart.`);
	};

	const onRemove = (product) => {
		foundProduct = cartItems.find((item) => item._id === product._id);

		// Only remove the product if it was found in the cart
		if (foundProduct) {
			const newCartItems = cartItems.filter((item) => item._id !== product._id);

			setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
			setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
			setCartItems(newCartItems);
		} else {
			// Product not found in the cart
			// console.log("Product not found in the cart");
		}
	};

	const toggleCartItemQuantity = (id, val) => {
		foundProduct = cartItems.find((item) => item._id === id);
		index = cartItems.findIndex((product) => product._id === id);
		const newCartItems = cartItems.filter((item) => item._id !== id);

		if (val === "inc") {
			setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
			// react rule-breaking!!!!!!!!!! no manual mutation
			// foundProduct.quantity += 1;
			// cartItems[index] = foundProduct;
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
			setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
		} else if (val === "dec") {
			if (foundProduct.quantity > 1) {
				setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
			}
		}
	};

	const incQty = () => {
		setQty((prevQty) => prevQty + 1);
	};
	const decQty = () => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1;
			return prevQty - 1;
		});
	};

	return (
		<Context.Provider
			value={{
				showCart,
				setShowCart,
				cartItems,
				totalPrice,
				totalQuantities,
				qty,
				incQty,
				decQty,
				onAdd,
				toggleCartItemQuantity,
				onRemove,
				setCartItems,
				setTotalPrice,
				setTotalQuantities,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useStateContext = () => useContext(Context);
