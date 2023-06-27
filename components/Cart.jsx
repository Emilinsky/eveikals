import React, { useRef } from "react";
import Link from "next/link";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";
import styles from "../styles/Cart.module.css";

const Cart = () => {
	const cartRef = useRef();
	const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();

	const handleCheckout = async () => {
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
			<div className={styles.cart_container}>
				<button type='button' className={styles.cart_heading} onClick={() => setShowCart(false)}>
					<AiOutlineLeft />
					<span className={styles.heading}>Your Cart</span>
					<span className={styles.cart_num_items}>{totalQuantities} items</span>
				</button>
				{cartItems.length < 1 && (
					<div className={styles.empty_cart}>
						<AiOutlineShopping size={150} />
						<h3>Your cart is empty</h3>
						<Link href='/'>
							<button type='button' onClick={() => setShowCart(false)} className={styles.btn}>
								Continue shopping
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
									className={styles.cart_product_image}
								/>

								<div className={styles.item_desc}>
									<div className={`${styles.flex} ${styles.top}`}>
										<h5>
											{item.name}
											{item.variant ? ` - ${item.variant.title}` : ""}
										</h5>
										<h4>€{item.variant ? item.variant.price : item.price}</h4>
									</div>
									<div className={`${styles.flex} ${styles.bottom}`}>
										<div>
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
											<TiDeleteOutline />
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
