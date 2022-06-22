import React from "react";
import styles from "./SearchSuggestions.module.scss";

interface searchSuggestionsProps {
  suggestions: any;
}

const SearchSuggestions: React.FC<searchSuggestionsProps> = ({
  suggestions,
}) => {
  const suggestionList: string[] = suggestions.map((s: string) => {
    return <div className={styles.pill}>{s}</div>;
  });

  return <div className={styles.container}>{suggestionList}</div>;
};

export default SearchSuggestions;
