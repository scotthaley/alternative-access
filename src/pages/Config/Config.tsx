import React, { useEffect, useState } from "react";
import "./Config.scss";
import styles from "./Config.module.scss";
import SideNav from "../../components/side-nav/SideNav";
import ConfigSection from "../../components/config-section/ConfigSection";
import ConfigList, {
  ConfigListItem,
} from "../../components/config-list/ConfigList";

const Config: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("Switches");
  const [switches, setSwitches] = useState<ConfigListItem[]>([]);

  const switchNameFunc = (index: number) => `Switch ${index + 1}`;

  return (
    <div className={styles.main}>
      <SideNav
        title="Alt-Ax Config"
        selected={selectedOption}
        onSelected={setSelectedOption}
        options={[
          "Switches",
          "Actions",
          "On-Screen Keyboard",
          "Website Profiles",
        ]}
      />
      <div className={styles.right}>
        {selectedOption === "Switches" && (
          <div>
            <ConfigSection title="Switch Mapping">
              <ConfigList
                title="Switches"
                options={[
                  "Up Arrow",
                  "Down Arrow",
                  "Left Arrow",
                  "Right Arrow",
                ]}
                items={switches}
                nameFunc={switchNameFunc}
                onListChange={setSwitches}
              />
            </ConfigSection>
            <ConfigSection title="Timing Settings">
              Long press timing, multi-press timing, etc.
            </ConfigSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default Config;
