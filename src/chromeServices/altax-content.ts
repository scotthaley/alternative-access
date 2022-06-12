import {SequenceEngine, SequenceType} from './sequence-engine';
import {DOMMessage} from '../types';
import {FocusEngine} from './focus-engine';
import {ApplyProfile, ProfileSectionType} from './profile-applicator';
import { Profiles } from '../profiles/profiles';

// const SimulateKeystroke = (keyCode: number) => {
//   document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': keyCode}))
// }

let video: HTMLVideoElement;

const engine = new SequenceEngine({
  switch1: 'ArrowDown'
});

engine.RegisterCallback(SequenceType.Switch1Press, () => {
  switch (focusEngine.currentMode.type) {
    case ProfileSectionType.CYCLE:
      focusEngine.CycleNext();
      break;
    case ProfileSectionType.VIDEO:
      // SimulateKeystroke(32);\
      video.paused ? video.play() : video.pause();
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1LongPress, () => {
  switch (focusEngine.currentMode.type) {
    case ProfileSectionType.CYCLE:
      focusEngine.CyclePrevious();
      break;
    case ProfileSectionType.VIDEO:
      // SimulateKeystroke(32);
     
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1DoublePress, () => {
  switch (focusEngine.currentMode.type) {
    case ProfileSectionType.CYCLE:
      focusEngine.CycleEnter();
      break;
    case ProfileSectionType.VIDEO:
      video.volume = video.volume - .05;
      // SimulateKeystroke(32);
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1TriplePress, () => {
  focusEngine.CycleMode();
});

const url = window.location.href.replace(/(^\w+:|^)\/\//, '').split('/')[0];
const profile = Profiles[url];
const focusEngine = new FocusEngine(profile);

const enableEngine = () => {
  document.body.append(focusEngine.focusSteal);
  ApplyProfile(profile);
  focusEngine.FocusMode();
  engine.enabled = true;
  document.body.append(focusEngine.modeDisplayElement);
}

const disableEngine = () => {
  engine.enabled = false;
  document.body.removeChild(focusEngine.modeDisplayElement);
}

chrome.runtime.onMessage.addListener((msg: DOMMessage, sender, sendResponse) => {
  switch (msg.type) {
    case 'ENABLE':
      enableEngine();
      sendResponse(true);
      chrome.runtime.sendMessage({type: 'ENABLE'} as DOMMessage)
      break;
    case 'DISABLE':
      disableEngine();
      sendResponse(false);
      chrome.runtime.sendMessage({type: 'DISABLE'} as DOMMessage)
      break;
    case 'STATUS':
      sendResponse(engine.enabled);
      break;
  }
})

setTimeout(() => {
  video = document.getElementsByTagName('video')[0];
  chrome.runtime.sendMessage({type: 'STATUS'} as DOMMessage, response => {
    response ? enableEngine() : disableEngine();
  })
}, 1000)
