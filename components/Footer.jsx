import React from "react";
import Link from "next/link";
import { AiFillInstagram, AiOutlineFacebook } from "react-icons/ai";

import styles from "../styles/Footer.module.css";

function Footer() {
	return (
		<>
			<div className={styles.svg_bg}></div>
			<footer className={styles.footer}>
				<div className={styles.footer__addr}>
					<h1 className={styles.footer__logo}>
						<Link href='#'>Shopfeast</Link>
					</h1>

					{/* <h2>Contact</h2> */}

					<address>
						{/* shopfeast@info.com */}
						<Link className={styles.footer__btn} href='mailto:edmund@shopfeast.com'>
							Email Us
						</Link>
					</address>
				</div>

				<ul className={styles.footer__nav}>
					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>Media</h2>

						<ul className={styles.nav__ul}>
							<li>
								<Link href='#'>TikTok</Link>
							</li>

							<li>
								<Link href='#'>Instagram</Link>
							</li>

							<li>
								<Link href='#'>Facebook</Link>
							</li>
						</ul>
					</li>

					<li className={(styles.nav__item, styles.nav__item_extra)}>
						<h2 className={styles.nav__title}>Shipping</h2>
						<ul className={styles.nav__ul}>
							<li>
								<Link href='#'>Orders</Link>
							</li>

							<li>
								<Link href='#'>Refunds</Link>
							</li>

							<li>
								<Link href='#'>Tracking</Link>
							</li>
						</ul>
					</li>

					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>About Us</h2>
						<ul className={styles.nav__ul}>
							<li>
								<Link href='#'>Products</Link>
							</li>

							<li>
								<Link href='#'>Terms of Use</Link>
							</li>

							<li>
								<Link href='#'>Privacy Policy</Link>
							</li>
						</ul>
					</li>
				</ul>
				<div></div>
			</footer>
			<div className={styles.legal}>
				<p>&copy; 2023. Shopfeast. All rights reserved.</p>
			</div>
		</>
	);
}

export default Footer;
