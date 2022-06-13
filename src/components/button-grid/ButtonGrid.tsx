import React from 'react';
import styles from './ButtonGrid.module.scss';

export interface IButtonListButton {
  text: string;
}

export interface IButtonList {
  rows: {
    buttons: IButtonListButton[]
  }[]
}

type ButtonGridProps = {
  buttonList: IButtonList,
  selectedButton: number
}

export const ButtonListId = (id: number, list: IButtonList): IButtonListButton => {
  const buttons: IButtonListButton[] = [];
  list.rows.forEach(r => {
    r.buttons.forEach(b => buttons.push(b));
  });
  return buttons[id];
}

const ButtonGrid: React.FC<ButtonGridProps> = ({buttonList, selectedButton}) => {
  let buttonId = 0;

  const rows = buttonList.rows.map((r, rowI) => {
    return (
      <div className={styles.row} key={`row-${rowI}`}>
        {r.buttons.map(b => {
          const e = (
            <button key={`button-${buttonId}`}
                    className={selectedButton === buttonId ? styles.selected : ''}>{b.text}</button>
          );
          buttonId++;
          return e;
        })}
      </div>
    )
  });

  return (
    <div className={styles.container}>
      {rows}
    </div>
  )
}

export default ButtonGrid;