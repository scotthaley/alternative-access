import React, { useCallback, useEffect, useState } from "react";
import styles from "./T9Keyboard.module.scss";
import {
  SequenceEngine,
  SequenceType,
} from "../../../chromeServices/sequence-engine";
import ButtonGrid, {
  ButtonListId,
  IButtonList,
} from "../../button-grid/ButtonGrid";

type KeyboardProps = {
  onTextSend?: (text: string) => void;
  onBack?: () => void;
  onTextChange: (text: string) => void;
};

const mainButtonList: IButtonList = {
  rows: [
    {
      buttons: [
        { text: "1" },
        { text: "2 abc" },
        { text: "3 def" },
        { text: "back" },
      ],
    },
    {
      buttons: [
        { text: "4 ghi" },
        { text: "5 jkl" },
        { text: "6 mno" },
        { text: "delete" },
      ],
    },
    {
      buttons: [
        { text: "7 pqrs" },
        { text: "8 tuv" },
        { text: "9 wxyz" },
        { text: "enter" },
      ],
    },
    {
      buttons: [{ text: "0" }],
    },
  ],
};

enum KeyboardState {
  Main,
  Category,
}

const T9Keyboard: React.FC<KeyboardProps> = ({
  onTextSend,
  onBack,
  onTextChange,
}) => {
  const [selectedButton, setSelectedButton] = useState(0);
  const [lastSelectedButton, setLastSelectedButton] = useState(0);
  const [state, setState] = useState(KeyboardState.Main);
  const [buttonList, setButtonList] = useState(mainButtonList);
  const [textInput, setTextInput] = useState("");

  const sequenceEngine = new SequenceEngine({
    switch1: "ArrowDown",
  });

  sequenceEngine.enabled = true;

  const changeButton = useCallback(
    (change) => {
      const count = buttonList.rows.reduce(
        (acc, cur) => acc + cur.buttons.length,
        0
      );
      setSelectedButton((val) => {
        let n = val + change;
        if (n > count - 1) n = 0;
        if (n < 0) n = count - 1;
        return n;
      });
    },
    [buttonList]
  );

  const selectSpecific = useCallback(
    (values: string[]) => {
      const newButtonList: IButtonList = {
        rows: [{ buttons: [] }],
      };
      let rowIndex = 0;
      values.forEach((val) => {
        if (newButtonList.rows[rowIndex].buttons.length === 4) {
          rowIndex++;
          newButtonList.rows.push({ buttons: [] });
        }
        newButtonList.rows[rowIndex].buttons.push({ text: val });
      });
      newButtonList.rows.push({ buttons: [{ text: "back" }] });
      setSelectedButton(0);
      setButtonList(newButtonList);
      setState(KeyboardState.Category);
    },
    [setButtonList, setSelectedButton, setState]
  );

  useEffect(() => {
    onTextChange(textInput);
  }, [textInput]);

  const backToMain = useCallback(() => {
    setButtonList(mainButtonList);
    setState(KeyboardState.Main);
    setSelectedButton(lastSelectedButton);
  }, [
    setButtonList,
    setState,
    setSelectedButton,
    lastSelectedButton,
    textInput,
    onTextChange,
  ]);

  const buttonSelected = useCallback(() => {
    const button = ButtonListId(selectedButton, buttonList);
    if (state === KeyboardState.Category) {
      if (button.text === "back") {
        backToMain();
        return;
      }
      setTextInput((t) => t + button.text);
      backToMain();
    } else {
      if (button.text === "delete") {
        setTextInput((t) => t.substring(0, t.length - 1));
        return;
      }
      if (button.text === "enter") {
        if (onTextSend) onTextSend(textInput);
        return;
      }
      if (button.text === "back") {
        if (onBack) onBack();
        return;
      }
      setLastSelectedButton(selectedButton);
      selectSpecific(button.text.replace(" ", "").split(""));
    }
  }, [
    state,
    buttonList,
    selectedButton,
    selectSpecific,
    backToMain,
    setTextInput,
    setLastSelectedButton,
    onTextSend,
    onTextChange,
    onBack,
    textInput,
  ]);

  useEffect(() => {
    sequenceEngine?.RemoveCallbacks();
    sequenceEngine?.RegisterCallback(SequenceType.Switch1Press, () =>
      changeButton(1)
    );
    sequenceEngine?.RegisterCallback(SequenceType.Switch1LongPress, () =>
      changeButton(-1)
    );
    sequenceEngine?.RegisterCallback(SequenceType.Switch1DoublePress, () =>
      buttonSelected()
    );

    return () => {
      sequenceEngine.enabled = false;
    };
  }, [buttonSelected, changeButton, sequenceEngine]);

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>{textInput}</div>
      <div className={styles.keyboard}>
        <ButtonGrid buttonList={buttonList} selectedButton={selectedButton} />
      </div>
    </div>
  );
};

export default T9Keyboard;
