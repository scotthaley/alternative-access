import React from "react";
import styles from "./ConfigSection.module.scss";

type ConfigSectionProps = {
  title: string;
};

const ConfigSection: React.FC<ConfigSectionProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default ConfigSection;
