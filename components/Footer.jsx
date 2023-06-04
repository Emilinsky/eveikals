import React from "react";
import Link from "next/link";
import { AiFillInstagram, AiOutlineFacebook } from "react-icons/ai";

import styles from "../styles/Footer.module.css";

function Footer() {
	return (
		<>
			<footer className={styles.footer}>
				<div className={styles.footer__addr}>
					<h1 className={styles.footer__logo}>
						<Link href='#'>Shopfeast</Link>
					</h1>

					<h2>Contact</h2>

					<address>
						Edmund, from Shopfeast
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
								<Link href='#'>Online</Link>
							</li>

							<li>
								<Link href='#'>Print</Link>
							</li>

							<li>
								<Link href='#'>Alternative Ads</Link>
							</li>
						</ul>
					</li>

					<li className={(styles.nav__item, styles.nav__item_extra)}>
						<h2 className={styles.nav__title}>Technology</h2>

						<ul className={styles.nav__ul}>
							<li>
								<Link href='#'>Hardware Design</Link>
							</li>

							<li>
								<Link href='#'>Software Design</Link>
							</li>

							<li>
								<Link href='#'>Digital Signage</Link>
							</li>
						</ul>
					</li>

					<li className={styles.nav__item}>
						<h2 className={styles.nav__title}>Legal</h2>

						<ul className={styles.nav__ul}>
							<li>
								<Link href='#'>Privacy Policy</Link>
							</li>

							<li>
								<Link href='#'>Terms of Use</Link>
							</li>

							<li>
								<Link href='#'>Sitemap</Link>
							</li>
						</ul>
					</li>
				</ul>

				<div className={styles.legal}>
					<p>&copy; 2023. Shopfeast. All rights reserved.</p>
				</div>
			</footer>
		</>
	);
}

export default Footer;
