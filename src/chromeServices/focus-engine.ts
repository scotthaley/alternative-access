import {IAltAxProfile, ProfileSectionType} from './profile-applicator';

interface Mode {
  name: string;
  type: ProfileSectionType | null;
}

export class FocusEngine {
  currentMode: Mode = {
    name: '',
    type: null
  };
  modeDisplayElement: HTMLElement;
  focusSteal: HTMLElement;
  profile: IAltAxProfile;
  currentSection?: HTMLElement;
  currentSectionBorder?: string;
  currentCycleIndex: number = 0;
  currentCycleElem?: HTMLElement;

  constructor(profile: IAltAxProfile) {
    this.profile = profile;
    this.SelectFirstPossibleMode();

    this.modeDisplayElement = document.createElement('div');
    this.modeDisplayElement.style.backgroundColor = '#2a2a2a';
    this.modeDisplayElement.style.color = '#fff';
    this.modeDisplayElement.style.position = 'fixed';
    this.modeDisplayElement.style.width = '300px';
    this.modeDisplayElement.style.height = '60px';
    this.modeDisplayElement.style.zIndex = '999999';
    this.modeDisplayElement.style.bottom = '0';
    this.modeDisplayElement.style.borderTopRightRadius = '8px';
    this.modeDisplayElement.style.fontSize = '32px';
    this.modeDisplayElement.style.display = 'flex';
    this.modeDisplayElement.style.alignItems = 'center';
    this.modeDisplayElement.style.justifyContent = 'center';

    const focusStealInput = document.createElement('input');
    focusStealInput.setAttribute('type', 'text');
    focusStealInput.id = 'alt-ax-focus-steal';

    this.focusSteal = document.createElement('div');
    this.focusSteal.style.position = 'absolute';
    // this.focusSteal.style.opacity = '0';
    // this.focusSteal.style.left = '100%';
    this.focusSteal.appendChild(focusStealInput);

    this.SetMode();
  }

  public SetMode(modeType?: ProfileSectionType | null) {
    this.modeDisplayElement.innerText = this.profile.sections.find(m => m.modeId === this.currentMode.name)?.modeName || '';
    /* 
    TODO: This isn't great. Only works for video mode, but is only being used to 
    Change to video mode. Needs more thought.
    */
    if (!modeType) {
      this.currentMode.type = this.profile.sections.find(s => s.modeId === this.currentMode.name)?.type ?? null;
    } else {
      this.currentMode.type = modeType;
    }

    this.currentMode.name = this.profile.sections.find((s) => s.type === this.currentMode.type)?.modeId || '';
    this.FocusMode();
  }

  public CycleMode() {
    if (this.currentSection) {
      this.currentSection.style.border = this.currentSectionBorder || '';
    }

    let i = this.profile.sections.findIndex(m => m.modeId === this.currentMode.name);
    this.SelectNextPossibleMode(i);
    this.FocusMode();
  }

  public SelectFirstPossibleMode() {
    // passing -1 will cause it to check index 0 first
    this.SelectNextPossibleMode(-1);
  }

  public SelectNextPossibleMode(i: number) {
    let section;
    do {
      i++;
      if (i === this.profile.sections.length)
        i = 0;

      section = this.profile.sections[i];
    } while (section.urlFilter && !window.location.href.match(section.urlFilter))

    this.currentMode.name = section.modeId;
    this.currentMode.type = section.type;
  }

  public FocusMode() {
    this.currentSection = document.querySelector(`[alt-ax-section=${this.currentMode.name}]`) as HTMLElement;
    if (!this.currentSection) return;

    this.currentSectionBorder = this.currentSection.style.border;
    this.currentSection.style.border = '6px solid #FFD034';

    const section = this.profile.sections.find(m => m.modeId === this.currentMode.name);
    if (section && section.focusSelector) {
      setTimeout(() => {
        FocusEngine.TryFocusSteal()
      }, 500);
      return true;
    }

    this.FocusCycleIndex();
  }

  public CycleNext() {
    this.currentCycleIndex++;
    this.FocusCycleIndex();
  }

  public CyclePrevious() {
    this.currentCycleIndex--;
    this.FocusCycleIndex();
  }

  public CycleEnter() {
    let url = this.currentCycleElem?.querySelector('a')?.href;
    if (url)
      window.location.href = url;
  }

  private static TryFocusSteal() {
    let focus = document.querySelector(`[alt-ax-focus="true"]`) as HTMLElement;
    if (focus) {
      focus.focus();
    }
  }

  private FocusCycleIndex() {
    if (this.currentCycleElem) {
      this.currentCycleElem.style.border = '';
    }

    this.currentCycleElem = this.currentSection?.querySelector(`[alt-ax-cycle="${this.currentCycleIndex}"]`) as HTMLElement;
    if (this.currentCycleElem) {
      this.currentCycleElem.style.border = '6px solid #FFD034';
      this.currentCycleElem.focus();
      this.currentCycleElem.scrollIntoView(false);
    }
  }
}
