import React from "react";
import PopupSlide from "../../components/popup-slide/PopupSlide";
import { IoMdArrowBack, IoMdPower, IoMdSettings } from "react-icons/io";
import { Link } from "wouter";
import { DOMMessage } from "../../types";
import "./Home.scss";

const Home: React.FC = () => {
  const [tabId, setTabId] = React.useState(0);
  const [enabled, setEnabled] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const enableEngine = () => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "ENABLE" } as DOMMessage,
      (response: boolean) => {
        setEnabled(response);
      }
    );
  };
  const disableEngine = () => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "DISABLE" } as DOMMessage,
      (response: boolean) => {
        setEnabled(response);
      }
    );
  };

  const toggleExtension = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    enabled ? disableEngine() : enableEngine();
  };

  React.useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          setTabId(tabs[0].id || 0);
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "STATUS" } as DOMMessage,
            (response: boolean) => {
              setEnabled(response);
            }
          );
        }
      );
  });

  return (
    <div className="home">
      <header className="App-header">
        <h1>ALT-Ax</h1>
      </header>
      <div className="tools">
        <button onClick={toggleExtension} className={enabled ? "selected" : ""}>
          <IoMdPower />
        </button>
        <Link href="/config">
          <button>
            <IoMdSettings />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
