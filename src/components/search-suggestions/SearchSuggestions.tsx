import React from 'react';
import styles from './SearchSuggestions.module.scss';

const SearchSuggestions: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.pill}>Happy Birthday Song</div>
      <div className={styles.pill}>Heat Waves</div>
      <div className={styles.pill}>Half Time Show 2022</div>
    </div>
  )
}

export default SearchSuggestions;