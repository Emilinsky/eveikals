import React, { useState } from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";

import styles from "../styles/ProductsBanner.module.css";

const ProductsBanner = ({ ProductsBanner, colors, sizes }) => {
	const [isRightPanelActive, setIsRightPanelActive] = useState(false);
	const [showDivContainerTop, setShowDivContainerTop] = useState(true);

	const handleSignUpClick = () => {
		setIsRightPanelActive(true);
		setShowDivContainerTop(false);
	};

	const handleSignInClick = () => {
		setIsRightPanelActive(false);
		setShowDivContainerTop(true);
	};
	return (
		<div className={styles.products_container}>
			<div className={`${styles.container} ${isRightPanelActive ? styles.right_panel_active : ""}`}>
				{/* NEWST PRODUCT ADDITION */}
				<div className={`${styles.form_container} ${styles.sign_up_container}`}>
					<div className={styles.div_container_new}>
						<h1 className={styles.product_heading}>{ProductsBanner.headingRight}</h1>
						<img src={urlFor(ProductsBanner.imageNew)} alt='shirts' className={styles.products_banner_img} />
					</div>
				</div>

				{/* PRODUCT OF THE WEEK */}
				<div
					className={`${styles.form_container} ${styles.sign_in_container}`}
					style={{ opacity: showDivContainerTop ? "1" : "0" }}
				>
					<div className={styles.div_container_top}>
						<h1 className={styles.product_heading}>{ProductsBanner.headingLeft}</h1>
						<img src={urlFor(ProductsBanner.imageTop)} alt='shirts' className={styles.products_banner_img} />
						<div className={styles.options_cont}>
							{/* colors opt */}
							<div className={styles.colors_top}>
								<div className={styles.colors_cont}>
									<h2 className={styles.colors_heading}>Available colors:</h2>
									<div className={styles.colors_outter_cont}>
										{colors.map((color) => (
											<div className={styles.colors_content} key={color.colorName}>
												<p className={styles.color_code} style={{ backgroundColor: color.colorCode }}>
													{/* <span>{color.colorName}</span> */}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
							{/* size opt */}
							<div className={styles.sizes_top}>
								<div className={styles.sizes_cont}>
									<h2 className={styles.sizes_heading}>Available sizes:</h2>
									<div className={styles.sizes_outter_cont}>
										{sizes.map((size) => (
											<div className={styles.sizes_content} key={size.size}>
												<p className={styles.size_name}>
													<span>{size.size}</span>
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<p className={styles.sales_num}>{`Sales last week: ${ProductsBanner.salesCount}`}</p>
					</div>
				</div>
				<div className={styles.overlay_container}>
					<div className={styles.overlay}>
						{/* NEW product desc */}
						<div className={`${styles.overlay_panel} ${styles.overlay_left}`}>
							<h1>{ProductsBanner.descHeading}</h1>
							<div className={styles.product_name}>
								<h2>{ProductsBanner.productNewName}</h2>
							</div>
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
							<div className={styles.product_name}>
								<h2>{ProductsBanner.productTopName}</h2>
							</div>
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
