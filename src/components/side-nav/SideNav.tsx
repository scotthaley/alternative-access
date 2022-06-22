import React from "react";
import styles from "./SideNav.module.scss";

type SideNavProps = {
  title: string;
  options: string[];
  selected: string;
  onSelected: (s: string) => void;
};

const SideNav: React.FC<SideNavProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>{props.title}</h1>
      </div>
      {props.options.map((o) => (
        <div
          className={`${styles.option} ${
            o === props.selected ? styles.selected : ""
          }`}
          key={o}
          onClick={() => props.onSelected(o)}
        >
          {o}
        </div>
      ))}
    </div>
  );
};

export default SideNav;
