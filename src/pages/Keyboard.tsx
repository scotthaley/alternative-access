import React, { useState } from "react";
import SearchSuggestions from "../components/search-suggestions/SearchSuggestions";
import T9Keyboard from "../components/keyboards/t9/T9Keyboard";

const styles = {
  display: "flex",
  flexDirection: "column" as "column",
  height: "100%",
};

const Keyboard: React.FC = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [engine, setEngine] = useState("keyboard");

  const onTextSend = (text: string) => {
    window.parent.postMessage(`text|${text}`, "*");
  };

  const onBack = () => {
    window.parent.postMessage("back", "*");
  };

  // grab new suggestions
  const getSuggestions = async (text: string) => {
    const url = `https://clients1.google.com/complete/search?client=youtube&gs_ri=youtube&ds=yt&q=${text}`;
    const data = await (await fetch(url)).text();

    const searchSuggestions: any = [];
    data.split("[").forEach((ele, index) => {
      if (!ele.split('"')[1] || index === 1) return;
      return searchSuggestions.push(ele.split('"')[1]);
    });

    if (searchSuggestions.length >= 3) {
      const trimmedSuggestions = searchSuggestions.slice(0, 3);
      setSuggestions(trimmedSuggestions);
    }
  };

  const enableEngine = (engine: string) => {
    setEngine(engine);
  };

  return (
    <div style={styles}>
      <SearchSuggestions
        suggestions={suggestions}
        onTextSend={onTextSend}
        onBlur={enableEngine}
        active={engine === "suggestions"}
      />
      <T9Keyboard
        onTextSend={onTextSend}
        onBack={onBack}
        onTextChange={getSuggestions}
        onBlur={enableEngine}
        active={engine === "keyboard"}
      />
    </div>
  );
};

export default Keyboard;
