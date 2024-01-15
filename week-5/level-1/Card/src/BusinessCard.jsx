import React from "react";
import styles from "./BusinessCard.module.css";

const BusinessCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.name}>Deepak HP</div>
      <div className={styles.bio}>Full stack SDE</div>
      <div className={styles.interestsContainer}>
        <div className={styles.interestsTitle}>Interests</div>
        <div className={styles.interestsList}>
          <div className={styles.interest}>Dev</div>
          <div className={styles.interest}>Travel</div>
          <div className={styles.interest}>Gaming</div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>LinkedIn</button>
        <button className={styles.button}>Twitter</button>
        <button className={styles.button}>Instagram</button>
      </div>
    </div>
  );
};

export default BusinessCard;
