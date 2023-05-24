import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";

import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
	const { showCart, setShowCart, totalQuantities } = useStateContext();

	const [scrolled, setScrolled] = useState(false);

	const handleScroll = () => {
		const offset = window.scrollY;
		if (offset > 200) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	const primaryNavRef = useRef(null);
	const navToggleRef = useRef(null);

	useEffect(() => {
		const primaryNav = primaryNavRef.current;
		const navToggle = navToggleRef.current;

		const handleClick = () => {
			const visibility = primaryNav.getAttribute("data-visible");

			if (visibility === "false") {
				primaryNav.setAttribute("data-visible", "true");
				navToggle.setAttribute("aria-expanded", "true");
			} else if (visibility === "true") {
				primaryNav.setAttribute("data-visible", "false");
				navToggle.setAttribute("aria-expanded", "false");
			}

			// console.log("Visibility:", visibility); // Debug statement
		};

		navToggle.addEventListener("click", handleClick);

		window.addEventListener("scroll", handleScroll); // Add this line

		return () => {
			// Cleanup the event listener when the component unmounts
			navToggle.removeEventListener("click", handleClick);
			window.removeEventListener("scroll", handleScroll); // Add this line
		};
	}, []);

	let navbarClasses = ["navbar-container"];
	if (scrolled) {
		navbarClasses.push("scrolled");
	}

	return (
		<nav className={navbarClasses.join(" ")}>
			<div className='navbar-inner-cont'>
				<button
					className='mobile-nav-toggle'
					aria-controls='primary-navigation'
					aria-expanded='false'
					ref={navToggleRef}
				>
					<span className='sr-only'>Menu</span>
				</button>
				<h1 className='logo'>
					<Link href='/'>Shopfeast</Link>
				</h1>
				<ul id='primary-navigation' data-visible='false' className='primary-navigation flex' ref={primaryNavRef}>
					<li className='link'>
						<a href='/'>Home</a>
					</li>
					<li className='link'>
						<a href='/products'>Products</a>
					</li>
					<li className='link'>
						<a href='/custom'>Customize</a>
					</li>
					<li className='link'>
						<a href='/contacts'>Contacts</a>
					</li>
				</ul>
				<div className='cart-cont'>
					<button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
						<AiOutlineShopping />
						<span className='cart-item-qty'>{totalQuantities}</span>
					</button>
				</div>
			</div>
			{showCart && <Cart />}
		</nav>
	);
};

export default Navbar;
