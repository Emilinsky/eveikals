import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";

import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
	const { showCart, setShowCart, totalQuantities } = useStateContext();

	const primaryNavRef = useRef(null);
	const navToggleRef = useRef(null);

	useEffect(() => {
		const primaryNav = primaryNavRef.current;
		const navToggle = navToggleRef.current;

		navToggle.addEventListener("click", () => {
			const visibility = primaryNav.getAttribute("data-visible");

			if (visibility === "false") {
				primaryNav.setAttribute("data-visible", "true");
				navToggle.setAttribute("aria-expanded", "true");
			} else if (visibility === "true") {
				primaryNav.setAttribute("data-visible", "false");
				navToggle.setAttribute("aria-expanded", "false");
			}
		});
	}, []);

	return (
		<div className="navbar-container">
			<div className="navbar-inner-cont">
				<p className="logo">
					<Link href="/">Shopfeast</Link>
				</p>
				<button className="mobile-nav-toggle" aria-controls="primary-navigation" aria-expanded="false" ref={navToggleRef}>
					<span className="sr-only">Menu</span>
				</button>
				<nav className="nav-container">
					<ul id="primary-navigation" data-visible="false" className="primary-navigation flex" ref={primaryNavRef}>
						<li className="link">
							<a href="/">Home</a>
						</li>
						<li className="link">
							<a href="/products">Products</a>
						</li>
						<li className="link">
							<a href="/custom">Customize</a>
						</li>
						<li className="link">
							<a href="/contacts">Contacts</a>
						</li>
					</ul>
				</nav>
				<div className="cart-cont">
					<button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
						<AiOutlineShopping />
						<span className="cart-item-qty">{totalQuantities}</span>
					</button>
				</div>
				{showCart && <Cart />}
			</div>
		</div>
	);
};

export default Navbar;
