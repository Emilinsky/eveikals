import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineClose, AiOutlineShopping } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";
import styles from "../styles/Cart.module.css";

const Cart = () => {
	const cartRef = useRef();
	const cartContainerRef = useRef(); // Create a new ref for cart_container div

	const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();

	// Attach an event listener to check for clicks outside the cart_container
	useEffect(() => {
		const handleOutsideClick = (event) => {
			// Check if the user clicked outside of the cart_container
			if (cartContainerRef.current && !cartContainerRef.current.contains(event.target)) {
				setShowCart(false); // Close the cart
			}
		};

		// Attach the event listener
		document.addEventListener("mousedown", handleOutsideClick);

		// Clean up the event listener on component unmount
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const handleCheckout = async () => {
		// Add this line to save cart items in local storage before checkout
		localStorage.setItem("purchasedItems", JSON.stringify(cartItems));
		localStorage.setItem("totalPrice", JSON.stringify(totalPrice.toFixed(2)));

		const stripe = await getStripe();
		const response = await fetch("/api/stripe", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(cartItems),
		});

		if (response.statusCode === 500) return;
		const data = await response.json();
		// console.log("Data received from server: ", data);
		toast.loading("Processing..");
		if (!data.id) {
			console.error("No session ID received from server");
			return;
		}
		stripe.redirectToCheckout({ sessionId: data.id });
	};

	return (
		<div className={styles.cart_wrapper} ref={cartRef}>
			<div className={styles.cart_container} ref={cartContainerRef}>
				<div className={styles.cart_info_cont}>
					<button type='button' className={styles.cart_heading} onClick={() => setShowCart(false)}>
						<AiOutlineClose />
						<span className={styles.heading}>Close cart</span>
					</button>
					<div className={styles.cart_heading_div}>
						<AiOutlineShopping />
						<span className={styles.heading}>Items in cart:</span>
						<span className={styles.cart_num_items}>{totalQuantities} items</span>
					</div>
				</div>
				{cartItems.length < 1 && (
					<div className={styles.empty_cart}>
						<div className={styles.shoppingCart_cont}>
							<img src='/shoppingCart.png' loading='lazy' alt='Shopping cart' className={styles.empty_cart_img} />
						</div>
						<h3>Your cart is empty</h3>
						<Link href='/products'>
							<button type='button' onClick={() => setShowCart(false)} className={styles.btn}>
								Go to products
							</button>
						</Link>
					</div>
				)}
				<div className={styles.product_container}>
					{cartItems.length >= 1 &&
						cartItems.map((item, i) => (
							<div className={styles.product} key={item.variant.id}>
								{/* <img
									src={urlFor(item.variantImage ? item.variantImage.src : item.image[0])}
									className='cart-product-image'
								/> */}
								<img
									src={item.variantImage ? item.variantImage.src : urlFor(item.image[0]).url()}
									loading='lazy'
									className={styles.cart_product_image}
								/>

								<div className={styles.item_desc}>
									<div className={`${styles.flex} ${styles.top}`}>
										<h5>
											{item.name} <br />
											{item.variant ? `${item.variant.title}` : ""}
										</h5>
									</div>
									<div className={`${styles.flex} ${styles.bottom}`}>
										<h4>€{item.variant ? item.variant.price : item.price}</h4>
										<div className={styles.qty_btn}>
											<p className={styles.quantity_desc}>
												<span className={styles.minus} onClick={() => toggleCartItemQuantity(item.variant.id, "dec")}>
													<AiOutlineMinus />
												</span>
												<span className={styles.num}>{item.quantity}</span>

												<span className={styles.plus} onClick={() => toggleCartItemQuantity(item.variant.id, "inc")}>
													<AiOutlinePlus />
												</span>
											</p>
										</div>

										<button type='button' className={styles.remove_item} onClick={() => onRemove(item)}>
											<IoIosCloseCircleOutline size={25} />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
				{cartItems.length >= 1 && (
					<div className={styles.heart_bottom}>
						<div className={styles.total}>
							<h3>Total:</h3>
							<h3>€{totalPrice.toFixed(2)}</h3>
						</div>
						<div className={styles.btn_container}>
							<button type='button' className={styles.btn} onClick={handleCheckout}>
								Buy
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
