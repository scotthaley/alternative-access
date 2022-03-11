export interface IFocusEngineProfile {
  modes: {
    id: string;
    name: string;
  }[];
}

export class FocusEngine {
  currentMode: string;
  modeDisplayElement: HTMLElement;
  profile: IFocusEngineProfile;
  currentSection?: HTMLElement;
  currentSectionBorder?: string;
  currentCycleIndex: number = 0;
  currentCycleElem?: HTMLElement;

  constructor(profile: IFocusEngineProfile) {
    this.profile = profile;
    this.currentMode = profile.modes[0].id;

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
    this.SetModeText();
    this.FocusMode();
  }

  private SetModeText() {
    this.modeDisplayElement.innerText = this.profile.modes.find(m => m.id === this.currentMode)?.name || '';
  }

  public SetMode(mode: string) {
    this.currentMode = mode;
    this.SetModeText();
    this.FocusMode();
  }

  public CycleMode() {
    if (this.currentSection) {
      this.currentSection.style.border = this.currentSectionBorder || '';
    }
    let i = this.profile.modes.findIndex(m => m.id === this.currentMode) + 1;
    this.currentMode = this.profile.modes[i === this.profile.modes.length ? 0 : i].id;
    this.SetModeText();
    this.FocusMode();
  }

  public FocusMode() {
    this.currentSection = document.querySelector(`[alt-ax-section=${this.currentMode}]`) as HTMLElement;
    if (!this.currentSection) return;

    this.currentSectionBorder = this.currentSection.style.border;
    this.currentSection.style.border = '6px solid #FFD034';

    if (FocusEngine.TryFocusSteal()) return;
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
    this.currentCycleElem?.querySelector('a')?.click();
  }

  private static TryFocusSteal(): boolean {
    let focus = document.querySelector(`[alt-ax-focus="true"]`) as HTMLElement;
    if (focus) {
      focus.click();
      focus.focus();
      return true;
    }
    return false;
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