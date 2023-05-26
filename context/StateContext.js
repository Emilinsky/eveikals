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

		// Find product in the cart with the same variant.id
		const checkProductInCart = cartItems.find((item) => item.variant.id === variant.id);

		console.log("Selected Variant:", variant);
		console.log("Check Product In Cart:", checkProductInCart);

		const price = variant ? variant.price : product.price;
		setTotalPrice((prevTotalPrice) => prevTotalPrice + price * quantity);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct.variant.id === variant.id) {
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
		foundProduct = cartItems.find((item) => item.variant.id === product.variant.id);

		if (foundProduct) {
			const newCartItems = cartItems.filter((item) => !(item.variant.id === product.variant.id));
			setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
			setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
			setCartItems(newCartItems);
		}
	};

	const toggleCartItemQuantity = (variantId, val) => {
		foundProduct = cartItems.find((item) => item.variant.id === variantId);

		if (foundProduct) {
			const updatedCartItems = cartItems.map((item) => {
				if (item.variant.id === variantId) {
					if (val === "inc") {
						return { ...item, quantity: item.quantity + 1 };
					} else if (val === "dec" && item.quantity > 1) {
						return { ...item, quantity: item.quantity - 1 };
					}
				}
				return item;
			});
			setCartItems(updatedCartItems);

			const price = foundProduct.variant ? foundProduct.variant.price : foundProduct.price;

			if (val === "inc") {
				setTotalPrice((prevTotalPrice) => {
					if (prevTotalPrice && price) {
						const newTotalPrice = parseFloat((parseFloat(prevTotalPrice) + parseFloat(price)).toFixed(2));
						console.log("Increasing total price:", newTotalPrice);
						return newTotalPrice;
					}
				});
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
			} else if (val === "dec" && foundProduct.quantity > 1) {
				setTotalPrice((prevTotalPrice) => {
					const newTotalPrice = parseFloat((prevTotalPrice - price).toFixed(2));
					console.log("Decreasing total price:", newTotalPrice);
					return newTotalPrice;
				});
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
				setQty,
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
