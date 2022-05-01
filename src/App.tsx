import React from 'react';
import './App.scss';
import {DOMMessage } from './types';
import {IoMdArrowBack, IoMdPower, IoMdSettings} from 'react-icons/io';
import PopupSlide from './components/popup-slide/PopupSlide';

function App() {
  const [tabId, setTabId] = React.useState(0);
  const [enabled, setEnabled] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const enableEngine = () => {
    chrome.tabs.sendMessage(
      tabId,
      {type: 'ENABLE'} as DOMMessage,
      (response: boolean) => {
        setEnabled(response);
      })
  };
  const disableEngine = () => {
    chrome.tabs.sendMessage(
      tabId,
      {type: 'DISABLE'} as DOMMessage,
      (response: boolean) => {
        setEnabled(response);
      })
  };

  const toggleExtension = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    enabled ? disableEngine() : enableEngine();
  }

  React.useEffect(() => {
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      setTabId(tabs[0].id || 0);
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        {type: 'STATUS'} as DOMMessage,
        (response: boolean) => {
          setEnabled(response)
        }
      )
    })
  })

  return (
    <div className="App">
      <PopupSlide visible={true}>
        <header className="App-header">
          <h1>ALT-Ax</h1>
        </header>
        <div className="tools">
          <button onClick={toggleExtension} className={enabled ? 'selected' : ''}>
            <IoMdPower/>
          </button>
          <button onClick={() => setSettingsVisible(true)}>
            <IoMdSettings/>
          </button>
        </div>
      </PopupSlide>
      <PopupSlide visible={settingsVisible}>
        <button className="back" onClick={() => setSettingsVisible(false)}><IoMdArrowBack/> Back</button>
        <h2>Settings</h2>
      </PopupSlide>
    </div>
  );
}

export default App;
