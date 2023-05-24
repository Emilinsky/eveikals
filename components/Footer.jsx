import React from "react";
import { AiFillInstagram, AiOutlineFacebook } from "react-icons/ai";


const Footer = () => {
	return (
		<div className='footer-container'>
			<p className='icons'>
				<AiFillInstagram />
				<AiOutlineFacebook />
			</p>
			<p>2023 Shopfeast. &#169;All rights reserved</p>
		</div>
	);
};

export default Footer;
