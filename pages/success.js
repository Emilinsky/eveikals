import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GiCheckMark } from "react-icons/gi";
import { runFireworks } from "../lib/utils";
import styles from "../styles/Success.module.css";

import { useStateContext } from "../context/StateContext";

const Success = () => {
	const { setCartItems, setTotalQuantities } = useStateContext();

	const [boughtItems, setBoughtItems] = useState([]);
	const [boughtTotalPrice, setBoughtTotalPrice] = useState(0);

	useEffect(() => {
		const savedBoughtItems = JSON.parse(localStorage.getItem("purchasedItems"));
		const savedBoughtTotalPrice = JSON.parse(localStorage.getItem("totalPrice"));

		if (savedBoughtItems && savedBoughtTotalPrice) {
			setBoughtItems(savedBoughtItems);
			setBoughtTotalPrice(savedBoughtTotalPrice);
		}

		localStorage.clear();
		setCartItems([]);
		setTotalQuantities(0);
		runFireworks();
	}, []);

	return (
		<div className={styles.success_wrapper}>
			<div className={styles.success}>
				<div className={styles.top_heading}>
					<div className={styles.icon}>
						<img src='/mcDark.svg' alt='mc' />
					</div>
					<h2 className={styles.top_heading_text}>Great news! Your products are being carefully crafted,</h2>
					<p className={styles.email_msg}>and will soon be on their way to you.</p>
					<Link href='/products'>
						<button type='button' width='250px' className='btn'>
							Return to product page
						</button>
					</Link>
				</div>
				<div className={styles.bottom_heading}>
					<p className={styles.icon}>
						<GiCheckMark />
					</p>
					<h2 className=''>Thank you for your order!</h2>
					<p className={styles.description}>
						We emailed your receipt to your email <br />
						If you have any questions send us an email at:
						<a className={styles.email} href='mailto:edmundseizentals@gmail.com'>
							store@info.com
						</a>
					</p>
					{boughtItems.map((item) => (
						<div className={styles.product_cont} key={item.variant.id}>
							<p className={styles.product_name}>
								{item.name}
								{item.variant ? ` - ${item.variant.title}` : ""}
							</p>
							<p className={styles.product_price}>Price: €{item.variant ? item.variant.price : item.price}</p>
							<p className={styles.product_qty}>Quantity: {item.quantity}</p>
						</div>
					))}
					<p className={styles.total_price}>Total: €{boughtTotalPrice}</p>
				</div>
			</div>
		</div>
	);
};

export default Success;
