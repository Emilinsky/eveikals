import React from 'react';
import Link from "next/link";
import { MdSmartphone } from "react-icons/md";
import { BsEnvelope } from "react-icons/bs";


import styles from "../styles/Contacts.module.css";

const contacts = () => {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Contact <span>Us</span></h2>
          <p>Lorem ipsconsectetur adipiscing elit, sed do eiusmod tepiscing elit, sed do eiusmod tepiscing elit, sed do eiusmod tepiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className={styles.contact_content_description}>
          <div className={styles.contact__descript}>
            <div className={styles.title}>
              <h3>Contact details</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
            </div>
            <div className={styles.contact__content}>
              <div className={styles.info}>
			  <i className={styles.contact__icons}><MdSmartphone/> </i>
                <h4 className={styles.contact_type}>PHONE:<br /><span>+12457836913, +12457836913</span></h4>
              </div>
              <div className={styles.info}>
                <i className={styles.contact__icons}><BsEnvelope/> </i>
                <h4 className={styles.contact_type}>EMAIL:<br /><span>example@info.com</span></h4>
              </div>
            </div>
          </div>
          <div className={styles.contact_type_values}>
            <form className={styles.contact_entry_block}>
              <div className={styles.contact_content_row}>
                <div className={styles.contact_entry_field}>
                  <input type="text" className={styles.form_control} placeholder="Name" />
                </div>
                <div className={styles.contact_entry_field}>
                  <input type="email" className={styles.form_control} placeholder="Email" />
                </div>
                <div className={styles.contact_entry_field_big}>
                  <input type="text" className={styles.form_control} placeholder="Subject" />
                </div>
              </div>
              <div className={styles.form_group}>
                <textarea className={styles.form_control} rows="5" id="comment" placeholder="Message"></textarea>
              </div>
              <button className={styles.btn} type="submit">Send Now!</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default contacts;