import {DOMMessage} from '../types';

chrome.runtime.onMessage.addListener((msg: DOMMessage, sender, sendResponse) => {
  console.log(msg.type);
  if (msg.type === 'FOCUS_FORWARD') {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tabId = tabs[0].id || 0;

      chrome.debugger.attach({tabId}, '1.2', () => {
        const eventArgs = {
          'code': 'Tab',
          'key': 'Tab',
          'type': 'keyDown'
        }
        chrome.debugger.sendCommand({tabId}, 'Input.dispatchKeyEvent', eventArgs,
          result => {
            if (chrome.runtime.lastError) {
              console.warn('Error sending tab key:', chrome.runtime.lastError);
            }
            chrome.debugger.detach({tabId})
          })
      })
    })
  }
  if (msg.type === 'FOCUS_BACKWARD') {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tabId = tabs[0].id || 0;

      chrome.debugger.attach({tabId}, '1.2', () => {
        const eventArgs = {
          'modifiers': 8,
          'shiftKey': true,
          'code': 'Tab',
          'key': 'Tab',
          'type': 'keyDown'
        }
        chrome.debugger.sendCommand({tabId}, 'Input.dispatchKeyEvent', eventArgs,
          result => {
            if (chrome.runtime.lastError) {
              console.warn('Error sending tab key:', chrome.runtime.lastError);
            }
            chrome.debugger.detach({tabId})
          })
      })
    })
  }
  if (msg.type === 'ENTER') {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tabId = tabs[0].id || 0;

      chrome.debugger.attach({tabId}, '1.2', () => {
        const eventArgs = {
          'code': 'Enter',
          'key': 'Enter',
          'type': 'keyDown'
        }
        chrome.debugger.sendCommand({tabId}, 'Input.dispatchKeyEvent', eventArgs,
          result => {
            if (chrome.runtime.lastError) {
              console.warn('Error sending tab key:', chrome.runtime.lastError);
            }
            chrome.debugger.detach({tabId})
          })
      })
    })
  }
})
