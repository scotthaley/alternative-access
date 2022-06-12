import { IAltAxProfile, ProfileSectionType } from "../chromeServices/profile-applicator";

export const YouTubeProfile: IAltAxProfile = {

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