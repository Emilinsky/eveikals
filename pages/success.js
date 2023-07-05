import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GiCheckMark } from "react-icons/gi";
import { HiArrowSmRight } from "react-icons/hi";
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
					<div className={styles.logo}>
						<img src='/mcDark.jpg' alt='mc' className={styles.logo_img} />
					</div>
					<h2 className={styles.top_heading_text}>
						Your {""}
						products
						{""} are being designed
					</h2>
					<p className={styles.email_msg}>and will soon be on their way to you.</p>
					<div className={styles.btn_cont}>
						<Link href='/products'>
							<button type='button' width='250px' className={styles.btn}>
								Return to product page
								<HiArrowSmRight size={30} />
							</button>
						</Link>
					</div>
				</div>
				<div className={styles.bottom_heading}>
					<p className={styles.icon}>
						<GiCheckMark />
					</p>
					<h2 className={`${styles.top_heading_text} ${styles.bottom}`}>Thank you for your order!</h2>
					<p className={styles.description}>
						We emailed your receipt to your email <br />
						If you have any questions send us an email at:
						<a className={styles.email} href='mailto:edmundseizentals@gmail.com'>
							store@info.com
						</a>
					</p>
					<div className={styles.product_cont}>
						{boughtItems.map((item) => (
							<div className={styles.product_inner_cont} key={item.variant.id}>
								<img
									src={item.variantImage ? item.variantImage.src : urlFor(item.image[0]).url()}
									loading='lazy'
									className={styles.product_image}
								/>
								<div className={styles.product_text_cont}>
									<p className={styles.product_name}>
										{item.name}
										{item.variant ? ` - ${item.variant.title}` : ""}
									</p>
									<div className={styles.price_qty}>
										<div className={styles.product_qty}>Quantity: {item.quantity}</div>
										<div className={styles.product_price}>Price: €{item.variant ? item.variant.price : item.price}</div>
									</div>
								</div>
							</div>
						))}
					</div>
					{boughtItems.length > 0 && (
						<p className={styles.total_price}>
							Total: <span className={styles.total_num}>€{boughtTotalPrice}</span>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Success;
