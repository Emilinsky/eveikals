import React from "react";
import Link from "next/link";
import { AiFillInstagram, AiOutlineFacebook } from "react-icons/ai";

import styles from "../styles/Footer.module.css";



function App() {
  return (
    <div>
      <header>
        {/* Content */}
      </header>

      <main>
        {/* Content */}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footer__addr}>
          <h1 className={styles.footer__logo}>
			<Link href="#">Shopfeast</Link>
			</h1>

          <h2>Contact</h2>

          <address>
            Edmund, from Shopfeast
            <a className={styles.footer__btn} href="mailto:edmund@shopfeast.com">Email Us</a>
          </address>
        </div>

        <ul className={styles.footer__nav}>
          <li className={styles.nav__item}>
            <h2 className={styles.nav__title}>Media</h2>

            <ul className={styles.nav__ul}>
              <li>
                <a href="#">Online</a>
              </li>

              <li>
                <a href="#">Print</a>
              </li>

              <li>
                <a href="#">Alternative Ads</a>
              </li>
            </ul>
          </li>

          <li className={styles.nav__item, styles.nav__item_extra}>
            <h2 className={styles.nav__title}>Technology</h2>

            <ul className={styles.nav__ul}>
              <li>
                <a href="#">Hardware Design</a>
              </li>

              <li>
                <a href="#">Software Design</a>
              </li>

              <li>
                <a href="#">Digital Signage</a>
              </li>

            </ul>
          </li>

          <li className={styles.nav__item}>
            <h2 className={styles.nav__title}>Legal</h2>

            <ul className={styles.nav__ul}>
              <li>
                <a href="#">Privacy Policy</a>
              </li>

              <li>
                <a href="#">Terms of Use</a>
              </li>

              <li>
                <a href="#">Sitemap</a>
              </li>
            </ul>
          </li>
        </ul>

        <div className={styles.legal}>
          <p>&copy; 2023. Shopfeast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;