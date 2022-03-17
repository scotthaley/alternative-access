import {SequenceEngine, SequenceType} from './sequence-engine';
import {DOMMessage} from '../types';
import {FocusEngine} from './focus-engine';
import {ApplyProfile, IAltAxProfile, ProfileSectionType} from './profile-applicator';

const YouTubeProfile: IAltAxProfile = {
  sections: [
    {
      selector: 'ytd-rich-grid-renderer',
      modeId: 'select_video',
      type: ProfileSectionType.CYCLE,
      cycleSelector: 'ytd-rich-item-renderer',
      urlFilter: /youtube.com\/?$/
    },
    {
      selector: 'ytd-searchbox',
      modeId: 'search',
      type: ProfileSectionType.SEARCH
    },
    {
      selector: '#player',
      modeId: 'video',
      type: ProfileSectionType.INPUT_ONLY,
      focusSelector: 'body',
      urlFilter: /youtube.com\/watch/
    },
    {
      selector: 'ytd-watch-next-secondary-results-renderer #contents.ytd-item-section-renderer',
      modeId: 'related_videos',
      type: ProfileSectionType.CYCLE,
      cycleSelector: '.ytd-item-section-renderer',
      urlFilter: /youtube.com\/watch/
    }
  ]
};

const SimulateKeystroke = (keyCode: number) => {
  document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': keyCode}))
}

const engine = new SequenceEngine({
  switch1: 'ArrowDown'
});

engine.RegisterCallback(SequenceType.Switch1Press, () => {
  switch (focusEngine.currentMode) {
    case 'select_video':
    case 'related_videos':
      focusEngine.CycleNext();
      break;
    case 'video':
      SimulateKeystroke(32);
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1LongPress, () => {
  switch (focusEngine.currentMode) {
    case 'select_video':
    case 'related_videos':
      focusEngine.CyclePrevious();
      break;
    case 'video':
      SimulateKeystroke(32);
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1DoublePress, () => {
  switch (focusEngine.currentMode) {
    case 'select_video':
    case 'related_videos':
      focusEngine.CycleEnter();
      focusEngine.SetMode('video');
      break;
    case 'video':
      SimulateKeystroke(32);
      break;
  }
});

engine.RegisterCallback(SequenceType.Switch1TriplePress, () => {
  focusEngine.CycleMode();
});

const focusEngine = new FocusEngine({
  modes: [
    {id: 'select_video', name: 'Select Video'},
    {id: 'search', name: 'Search'},
    {id: 'video', name: 'Video'},
    {id: 'related_videos', name: 'Related Videos'}
  ]
});

chrome.runtime.onMessage.addListener((msg: DOMMessage, sender, sendResponse) => {
  switch (msg.type) {
    case 'ENABLE':
      ApplyProfile(YouTubeProfile);
      focusEngine.FocusMode();
      engine.enabled = true;
      document.body.append(focusEngine.modeDisplayElement);
      sendResponse(true);
      break;
    case 'DISABLE':
      engine.enabled = false;
      document.body.removeChild(focusEngine.modeDisplayElement);
      sendResponse(false);
      break;
    case 'STATUS':
      sendResponse(engine.enabled);
      break;
  }
})

// chrome.runtime.sendMessage({type: 'ENTER'} as DOMMessage);
