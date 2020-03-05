import React from 'react';
import styles from './SearchButton.module.css';

export default function SearchButton({ onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span className={styles.text}>Find anything</span>
      <kbd className={styles.kbd}>Cmd+K</kbd>
    </button>
  );
}
