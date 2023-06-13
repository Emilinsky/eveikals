import React from "react";
import Link from "next/link";
import {
	MdOutlineMarkEmailUnread,
	MdOutlinePrivacyTip,
	MdOutlineDocumentScanner,
	MdProductionQuantityLimits,
	MdAssignmentReturn,
	MdFavoriteBorder,
} from "react-icons/md";
import {
	FaCcStripe,
	FaCcVisa,
	FaCcMastercard,
	FaCcPaypal,
	FaInstagram,
	FaTiktok,
	FaFacebookSquare,
	FaTruck,
} from "react-icons/fa";

import styles from "../styles/Footer.module.css";

function Footer() {
	return (
		<>
			<div className={styles.svg_bg}></div>
			<footer className={styles.footer}>
				<div className={styles.footer__addr}>
					<h1 className={styles.footer__logo}>
						<Link href='#'>Liquid Luxury</Link>
					</h1>


					<address>
						<Link className={styles.footer__btn} href='mailto:edmund@liquidluxury.com'>
							<MdOutlineMarkEmailUnread size={25} style={{ marginRight: 10 }} /> Email Us
						</Link>
					</address>
				</div>

				<ul className={styles.footer__nav}>
					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>Media</h2>

						<ul className={styles.nav__ul}>
							<li>
								<FaTiktok size={18} />
								<Link href='#'>TikTok</Link>
							</li>

							<li>
								<FaInstagram size={18} />
								<Link href='#'>Instagram</Link>
							</li>

							<li>
								<FaFacebookSquare size={18} />
								<Link href='#'>Facebook</Link>
							</li>
						</ul>
					</li>

					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>Shipping</h2>
						<ul className={styles.nav__ul}>
							<li>
								<MdFavoriteBorder size={18} />
								<Link href='#'>Orders</Link>
							</li>

							<li>
								<MdAssignmentReturn size={18} />
								<Link href='#'>Refunds</Link>
							</li>

							<li>
								{/* <FaTruckFast size={18} /> */}
								<FaTruck size={18} />
								<Link href='#'>Tracking</Link>
							</li>
						</ul>
					</li>

					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>About Us</h2>
						<ul className={styles.nav__ul}>
							<li>
								<MdProductionQuantityLimits size={18} />
								<Link href='#'>Products</Link>
							</li>

							<li>
								<MdOutlineDocumentScanner size={18} />
								<Link href='#'>Terms of Use</Link>
							</li>

							<li>
								<MdOutlinePrivacyTip size={18} />
								<Link href='#'>Privacy Policy</Link>
							</li>
						</ul>
					</li>
				</ul>
				<div></div>
			</footer>
			<div className={styles.copy_cont}>
				<div className={styles.payments}>
					<FaCcStripe size={30} style={{ opacity: 0.8, marginRight: 10 }} />
					<FaCcVisa size={30} style={{ opacity: 0.8, marginRight: 10 }} />
					<FaCcPaypal size={30} style={{ opacity: 0.8, marginRight: 10 }} />
					<FaCcMastercard size={30} style={{ opacity: 0.8 }} />
				</div>
				<div className={styles.legal}>
					<p>&copy; 2023. LiquidLuxury. All rights reserved.</p>
				</div>
			</div>
		</>
	);
}

export default Footer;
