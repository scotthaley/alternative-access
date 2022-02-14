export enum SequenceType {
  Switch1Press,
  Switch1LongPress,
  Switch1DoublePress
}

export interface ISequenceCallback {
  type: SequenceType;
  callback: () => void
}

interface IKeySequenceState {
  sequence: number[];
  lastTime: number;
  timeout?: ReturnType<typeof setTimeout>;
}

export class SequenceEngine {
  callbacks: ISequenceCallback[];
  keyMap: { [code: string]: number }
  keySequenceMap: { [code: string]: IKeySequenceState }
  enabled: boolean = false;

  sequenceTime: number = 200;

  constructor() {
    this.callbacks = [];
    this.keyMap = {};
    this.keySequenceMap = {};

    this.RegisterInternalCallbacks();
  }

  RegisterCallback(type: SequenceType, callback: () => void) {
    this.callbacks.push({
      type,
      callback
    })
  }

  private RegisterInternalCallbacks() {
    window.addEventListener('keydown', e => {
      if (!this.enabled)
        return;
      if (e.code !== 'Space')
        return;

      e.preventDefault();
      e.stopPropagation();
      if (!this.keyMap[e.code])
        this.keyMap[e.code] = Date.now();
    });
    window.addEventListener('keyup', e => {
      if (!this.enabled)
        return;
      if (e.code !== 'Space')
        return;

      e.preventDefault();
      e.stopPropagation();
      this.ProcessSequence(e.code, this.keyMap[e.code])
      delete this.keyMap[e.code];
    });
  }

  private ProcessSequence(code: string, time: number) {
    const diff = Date.now() - time;

    if (!this.keySequenceMap[code])
      this.keySequenceMap[code] = {sequence: [], lastTime: Date.now()}

    const keySeq = this.keySequenceMap[code];
    keySeq.sequence.push(diff);

    if (keySeq.timeout)
      clearTimeout(keySeq.timeout);

    keySeq.timeout = setTimeout(() => this.ExecuteSequence(code), this.sequenceTime);
  }

  private ExecuteSequence(code: string) {
    const seq = this.keySequenceMap[code].sequence;

    console.log(seq);

    if (code === 'Space') {
      if (seq.length === 1) {
        if (seq[0] < 500)
          this.ExecuteCallbacks(SequenceType.Switch1Press);
        if (seq[0] >= 500)
          this.ExecuteCallbacks(SequenceType.Switch1LongPress);
      }
      if (seq.length === 2) {
        this.ExecuteCallbacks(SequenceType.Switch1DoublePress);
      }
    }

    delete this.keySequenceMap[code];
  }

  private ExecuteCallbacks(type: SequenceType) {
    this.callbacks.filter(c => c.type === type).forEach(c => c.callback());
  }
}