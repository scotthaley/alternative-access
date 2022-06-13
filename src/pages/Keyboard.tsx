import React from "react";
import { SequenceEngine } from "../chromeServices/sequence-engine";
import SearchSuggestions from "../components/search-suggestions/SearchSuggestions";
import T9Keyboard from "../components/keyboards/t9/T9Keyboard";

const styles = {
  display: "flex",
  flexDirection: "column" as "column",
  height: "100%",
};

const Keyboard: React.FC = () => {
  const engine = new SequenceEngine({
    switch1: "ArrowDown",
  });

  engine.enabled = true;

  const onTextSend = (text: string) => {
    window.parent.postMessage(`text|${text}`, "*");
  };

  const onBack = () => {
    window.parent.postMessage("back", "*");
  };

  return (
    <div style={styles}>
      <SearchSuggestions />
      <T9Keyboard
        sequenceEngine={engine}
        onTextSend={onTextSend}
        onBack={onBack}
      />
    </div>
  );
};

export default Keyboard;
