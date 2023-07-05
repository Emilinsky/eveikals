import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { runFireworks } from "../lib/utils";
import styles from "../styles/success.module.css";

import { useStateContext } from "../context/StateContext";

const Success = () => {
	const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

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
		<div className='success-wrapper'>
			<div className='success'>
				<div className={styles.top_heading}>
					<p className={styles.icon}>
						<BsBagCheckFill />
					</p>
					<h2 className=''>Thank you for your purchase!</h2>
					<p className='email-msg'>All the necessary info was sent to your email.</p>
					<Link href='/products'>
						<button type='button' width='250px' className='btn'>
							Take a look at other products
						</button>
					</Link>
				</div>
				<div className={styles.bottom_heading}>
					<p className={styles.icon}>
						<BsBagCheckFill />
					</p>
					<h2 className=''>Thank you for your purchase!</h2>
					<p className='description'>
						We emailed your receipt to your email <br />
						If you have any questions send us an email at:
						<a className='email' href='mailto:edmundseizentals@gmail.com'>
							store@info.com
						</a>
					</p>
					{boughtItems.map((item) => (
						<div key={item.variant.id}>
							<p>
								{item.name}
								{item.variant ? ` - ${item.variant.title}` : ""}
							</p>
							<p>Price: €{item.variant ? item.variant.price : item.price}</p>
							<p>Quantity: {item.quantity}</p>
						</div>
					))}
					<p>Total: €{boughtTotalPrice}</p>
				</div>
			</div>
		</div>
	);
};

export default Success;
