import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { runFireworks } from "../lib/utils";

import { useStateContext } from "../context/StateContext";

const Success = () => {
	const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();

	useEffect(() => {
		localStorage.clear();
		setCartItems([]);
		setTotalPrice(0);
		setTotalQuantities(0);
		runFireworks();
	}, []);

	return (
		<div className='success-wrapper'>
			<div className='success'>
				<p className='icon'>
					<BsBagCheckFill />
				</p>
				<h2 className=''>Thank you for your purchase!</h2>
				<p className='email-msg'>All the necessary info was sent to your email.</p>
				<p className='description'>
					If you have any questions send us an email at:
					<a className='email' href='mailto:edmundseizentals@gmail.com'>
						store@info.com
					</a>
				</p>
				<Link href='/'>
					<button type='button' width='300px' className='btn'>
						Take a look at other products
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Success;
