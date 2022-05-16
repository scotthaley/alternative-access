import {SequenceEngine, SequenceType} from './sequence-engine';
import {DOMMessage} from '../types';
import {FocusEngine} from './focus-engine';
import {ApplyProfile, IAltAxProfile, ProfileSectionType} from './profile-applicator';

const YouTubeProfile: IAltAxProfile = {
  sections: [
    {
      selector: 'ytd-rich-grid-renderer',
      modeId: 'select_video',
      modeName: 'Select Video',
      type: ProfileSectionType.CYCLE,
      cycleSelector: 'ytd-rich-item-renderer',
      urlFilter: /youtube.com\/?$/
    },
    {
      selector: '#player',
      modeId: 'video',
      modeName: 'Video',
      type: ProfileSectionType.VIDEO,
      focusSelector: '#alt-ax-focus-steal',
      urlFilter: /youtube.com\/watch/
    },
    {
      selector: 'ytd-searchbox',
      modeId: 'search',
      modeName: 'Search',
      type: ProfileSectionType.SEARCH
    },
    {
      selector: 'ytd-watch-next-secondary-results-renderer #contents.ytd-item-section-renderer',
      modeId: 'related_videos',
      modeName: 'Related Videos',
      type: ProfileSectionType.CYCLE,
      cycleSelector: '.ytd-item-section-renderer',
      urlFilter: /youtube.com\/watch/
    }
  ]
};

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
      // TODO: has to be a better way to make this play
      // Does each profile have methods to be used?
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

const focusEngine = new FocusEngine(YouTubeProfile);

const enableEngine = () => {
  document.body.append(focusEngine.focusSteal);
  ApplyProfile(YouTubeProfile);
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
