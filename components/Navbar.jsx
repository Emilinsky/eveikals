import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineShopping, AiOutlineMenuFold } from "react-icons/ai";

import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
	const { showCart, setShowCart, totalQuantities } = useStateContext();

	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false); // Add menuOpen state

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
			const body = document.querySelector("body");

			if (visibility === "false") {
				primaryNav.setAttribute("data-visible", "true");
				navToggle.setAttribute("aria-expanded", "true");
				body.style.overflow = "hidden";
				setMenuOpen(true); // Set menuOpen state to true
			} else if (visibility === "true") {
				primaryNav.setAttribute("data-visible", "false");
				navToggle.setAttribute("aria-expanded", "false");
				body.style.overflow = "";
				setMenuOpen(false); // Set menuOpen state to false
			}
		};

		navToggle.addEventListener("click", handleClick);

		window.addEventListener("scroll", handleScroll);

		return () => {
			navToggle.removeEventListener("click", handleClick);
			window.removeEventListener("scroll", handleScroll);
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
					className={`mobile-nav-toggle ${menuOpen ? "active" : ""}`} // Add active class based on menuOpen state
					aria-controls='primary-navigation'
					aria-expanded='false'
					ref={navToggleRef}
				>
					<AiOutlineMenuFold size={35} className={menuOpen ? "active" : ""} />{" "}
					{/* Add active class based on menuOpen state */}
					<span className='sr-only'>Menu</span>
				</button>
				<h1 className='logo'>
					<Link href='/'>Shopfeast</Link>
				</h1>
				<ul
					id='primary-navigation-large'
					data-visible='false'
					className='primary-navigation-large flex'
					ref={primaryNavRef}
				>
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
			{showCart && <Cart />}
		</nav>
	);
};

export default Navbar;
