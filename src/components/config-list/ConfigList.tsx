import React, { ChangeEvent, ChangeEventHandler, useCallback } from "react";
import styles from "./ConfigList.module.scss";
import { IoMdTrash } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";

export interface ConfigListItem {
  name: string;
  value: string;
  id: string;
}

type ConfigListProps = {
  title: string;
  options: string[];
  items: ConfigListItem[];
  nameFunc: (index: number) => string;
  onListChange: (items: ConfigListItem[]) => void;
};

const ConfigList: React.FC<ConfigListProps> = (props) => {
  const newItem = useCallback(() => {
    props.onListChange([
      ...props.items,
      {
        name: props.nameFunc(props.items.length),
        value: props.options[0],
        id: uuidv4(),
      },
    ]);
  }, [props.items, props.onListChange, props.options, props.nameFunc]);

  const removeItem = useCallback(
    (index: number) => () =>
      props.onListChange(props.items.filter((_, i) => i !== index)),
    [props.items, props.onListChange]
  );

  const updateItem = useCallback(
    (index: number) => (event: ChangeEvent<HTMLSelectElement>) => {
      props.onListChange(
        props.items.map((o, i) =>
          i === index ? { ...o, value: event.target.value } : o
        )
      );
    },
    [props.items, props.onListChange]
  );

  const updateItemName = useCallback(
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      props.onListChange(
        props.items.map((o, i) =>
          i === index ? { ...o, name: event.target.value } : o
        )
      );
    },
    [props.items, props.onListChange]
  );

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.titleButtons}>
          <button onClick={newItem}>+</button>
        </div>
      </div>
      <div className={styles.list}>
        {props.items.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.name}>
              <input value={item.name} onChange={updateItemName(i)} />
            </div>
            <div className={styles.dropdown}>
              <select value={item.value} onChange={updateItem(i)}>
                {props.options.map((o) => (
                  <option value={o} key={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttons}>
              <IoMdTrash onClick={removeItem(i)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigList;
