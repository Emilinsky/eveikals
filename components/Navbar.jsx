import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";

import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
	const { showCart, setShowCart, totalQuantities } = useStateContext();

	return (
		<div className='navbar-container'>
			<div className='navbar-inner-cont'>
				<p className='logo'>
					<Link href='/'>Shopfeast</Link>
				</p>
				<div className='cart-cont'>
					<button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
						<AiOutlineShopping />
						<span className='cart-item-qty'>{totalQuantities}</span>
					</button>
				</div>
				{showCart && <Cart />}
			</div>
		</div>
	);
};

export default Navbar;
