import {SequenceEngine, SequenceType} from './sequence-engine';
import {DOMMessage} from '../types';

const engine = new SequenceEngine();

engine.RegisterCallback(SequenceType.Switch1Press, () => {
  chrome.runtime.sendMessage({type: 'FOCUS_FORWARD'} as DOMMessage);
})

engine.RegisterCallback(SequenceType.Switch1LongPress, () => {
  chrome.runtime.sendMessage({type: 'FOCUS_BACKWARD'} as DOMMessage);
})

engine.RegisterCallback(SequenceType.Switch1DoublePress, () => {
  chrome.runtime.sendMessage({type: 'ENTER'} as DOMMessage);
})

chrome.runtime.onMessage.addListener((msg: DOMMessage, sender, sendResponse) => {
  switch (msg.type) {
    case 'ENABLE':
      engine.enabled = true;
      sendResponse(true);
      break;
    case 'DISABLE':
      engine.enabled = false;
      sendResponse(false);
      break;
    case 'STATUS':
      sendResponse(engine.enabled);
      break;
  }
})