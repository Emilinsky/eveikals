import React, { useState } from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";
import { AiOutlineInstagram, AiOutlineFacebook, AiOutlineMail } from "react-icons/ai";

import styles from "../styles/ProductsBanner.module.css";

const ProductsBanner = ({ ProductsBanner }) => {
	const [isRightPanelActive, setIsRightPanelActive] = useState(false);

	const handleSignUpClick = () => {
		setIsRightPanelActive(true);
	};

	const handleSignInClick = () => {
		setIsRightPanelActive(false);
	};

	return (
		<div className={styles.products_container}>
			<div className={`${styles.container} ${isRightPanelActive ? styles.right_panel_active : ""}`}>
				{/* NEWST PRODUCT ADDITION */}
				<div className={`${styles.form_container} ${styles.sign_up_container}`}>
					<div className={styles.div_container}>
						<h1 className={styles.product_heading}>{ProductsBanner.headingRight}</h1>
						<img src={urlFor(ProductsBanner.imageNew)} alt='shirts' className={styles.products_banner_img} />
						{/* <div className={styles.social_container}>
							<Link href='/' className={styles.social}>
								<AiOutlineMail size={25} />
							</Link>
							<Link href='/' className={styles.social}>
								<AiOutlineFacebook size={25} />
							</Link>
							<Link href='/' className={styles.social}>
								<AiOutlineInstagram size={25} />
							</Link>
						</div>
						<span>or use your email for registration</span>
						<input type='text' placeholder='Name' />
						<input type='email' placeholder='Email' />
						<input type='password' placeholder='Password' /> */}
					</div>
				</div>

				{/* PRODUCT OF THE WEEK */}
				<div className={`${styles.form_container} ${styles.sign_in_container}`}>
					<div className={styles.div_container}>
						<h1 className={styles.product_heading}>{ProductsBanner.headingLeft}</h1>
						<img src={urlFor(ProductsBanner.imageTop)} alt='shirts' className={styles.products_banner_img} />
						{/* <div className={styles.social_container}>
							<Link href='/' className={styles.social}>
								<AiOutlineMail size={25} />
							</Link>
							<Link href='/' className={styles.social}>
								<AiOutlineFacebook size={25} />
							</Link>
							<Link href='/' className={styles.social}>
								<AiOutlineInstagram size={25} />
							</Link>
						</div> */}
						{/* <span>or use your account</span>
						<input type='email' placeholder='Email' />
						<input type='password' placeholder='Password' />
						<a href='#'>Forgot your password?</a> */}
					</div>
				</div>
				<div className={styles.overlay_container}>
					<div className={styles.overlay}>
						{/* NEW product desc */}
						<div className={`${styles.overlay_panel} ${styles.overlay_left}`}>
							<h1>{ProductsBanner.descHeading}</h1>
							<p>{ProductsBanner.descNew}</p>
							<Link href={`/product/${ProductsBanner.productNew}`}>
								<button className={styles.more_btn}>{ProductsBanner.moreInfo}</button>
							</Link>
							<button className={styles.ghost} onClick={handleSignInClick}>
								{ProductsBanner.backToTopProBtn}
							</button>
						</div>

						{/* TOP product desc */}
						<div className={`${styles.overlay_panel} ${styles.overlay_right}`}>
							<h1>{ProductsBanner.descHeading}</h1>
							<p>{ProductsBanner.descTop}</p>
							<Link href={`/product/${ProductsBanner.productTop}`}>
								<button className={styles.more_btn}>{ProductsBanner.moreInfo}</button>
							</Link>
							<button className={styles.ghost} onClick={handleSignUpClick}>
								{ProductsBanner.backToNewProBtn}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductsBanner;
