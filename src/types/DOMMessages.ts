export type DOMMessage = {
  type: 'DISABLE' | 'ENABLE' | 'STATUS' | 'FOCUS_FORWARD' | 'FOCUS_BACKWARD' | 'ENTER'
}

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
}