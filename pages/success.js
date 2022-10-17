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
				<h2 className=''>Paldies par pirkumu!</h2>
				<p className='email-msg'>Uz epastu nosutijam rekvizitus!</p>
				<p className='description'>
					Jautajumu gadijuma sutie mums zinu uz:
					<a className='email' href='mailto:edmundseizentals@gmail.com'>
						edmundseizentals@gmail
					</a>
				</p>
				<Link href='/'>
					<button type='button' width='300px' className='btn'>
						Apskatit citus produktus
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Success;
