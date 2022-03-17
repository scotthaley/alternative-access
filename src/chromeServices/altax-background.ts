import {DOMMessage} from '../types';

chrome.runtime.onMessage.addListener((msg: DOMMessage, sender, sendResponse) => {
  switch (msg.type) {
    case 'ENABLE':
      chrome.storage.local.set({enabled: true}).then()
      break;
    case 'DISABLE':
      chrome.storage.local.set({enabled: false}).then()
      break;
    case 'STATUS':
      chrome.storage.local.get(['enabled']).then(storage => {
        sendResponse(storage.enabled)
      })
      return true;
  }
})
