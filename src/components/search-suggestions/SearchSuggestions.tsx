import React, { useEffect, useState } from "react";
import styles from "./SearchSuggestions.module.scss";
import {
  SequenceEngine,
  SequenceType,
} from "../../chromeServices/sequence-engine";

interface searchSuggestionsProps {
  suggestions: any;
  onBlur: (engine: string) => void;
  active: boolean;
  onTextSend: (text: string) => void;
}

const SearchSuggestions: React.FC<searchSuggestionsProps> = ({
  suggestions,
  onBlur,
  active,
  onTextSend,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceEngine = new SequenceEngine({
    switch1: "ArrowDown",
  });

  sequenceEngine.enabled = active;

  const suggestionList: string[] = suggestions.map(
    (s: string, index: number) => {
      return (
        <div
          className={
            activeIndex === index && active ? styles.selected : styles.pill
          }
          key={`suggestion-${index.toString()}`}
        >
          {s}
        </div>
      );
    }
  );

  const cycleNext = () => {
    if (activeIndex === 2) {
      setActiveIndex(0);
    } else setActiveIndex((curr) => curr + 1);
  };

  const cycleBack = () => {
    if (activeIndex === 0) {
      setActiveIndex(2);
    } else setActiveIndex((curr) => curr - 1);
  };

  const select = () => {
    onTextSend(suggestions[activeIndex]);
  };

  useEffect(() => {
    sequenceEngine?.RemoveCallbacks();
    sequenceEngine?.RegisterCallback(SequenceType.Switch1Press, () =>
      cycleNext()
    );
    sequenceEngine?.RegisterCallback(SequenceType.Switch1LongPress, () =>
      cycleBack()
    );
    sequenceEngine?.RegisterCallback(SequenceType.Switch1DoublePress, () =>
      select()
    );
    sequenceEngine?.RegisterCallback(SequenceType.Switch1TriplePress, () =>
      onBlur("keyboard")
    );
    return () => {
      sequenceEngine.enabled = false;
    };
  }, [onBlur, sequenceEngine]);

  return <div className={styles.container}>{suggestionList}</div>;
};

export default SearchSuggestions;
