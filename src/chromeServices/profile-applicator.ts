export enum ProfileSectionType {
  CYCLE,
  SEARCH,
  INPUT_ONLY
}

export interface IAltAxProfile {
  sections: {
    selector: string;
    modeId: string;
    type: ProfileSectionType;
    cycleSelector?: string;
    focusSelector?: string;
    urlFilter?: RegExp;
  }[];
}

export const ApplyProfile = (profile: IAltAxProfile) => {
  profile.sections.forEach(section => {
    if (section.urlFilter && !window.location.href.match(section.urlFilter))
      return;

    let s = document.querySelector(section.selector);
    if (s) {
      s.setAttribute('alt-ax-section', section.modeId);

      switch (section.type) {
        case ProfileSectionType.CYCLE:
          if (section.cycleSelector) {
            let cIndex = 0;
            s.querySelectorAll(section.cycleSelector).forEach(c => {
              if (window.getComputedStyle(c).display === 'none') return;

              c.setAttribute('alt-ax-cycle', cIndex.toString());
              cIndex++;
            })
          }
          break;
        case ProfileSectionType.INPUT_ONLY:
          let elem = document.querySelector(section.focusSelector as string);
          if (elem) {
            elem.setAttribute('alt-ax-focus', 'true');
          }
      }
    }
  })
};
