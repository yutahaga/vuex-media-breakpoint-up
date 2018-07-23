import { Store } from 'vuex';
import { Breakpoints, MUTATION_CHANGE_VIEWPORT, PluginOptions } from './';
import { getClientHeight, getClientWidth } from './client-size';
import { addEventListener, removeEventListener } from './listener';

const isString = (x: any): x is string => typeof x === 'string';

export interface Breakpoint {
  name: string;
  value: string | number;
}

export default class BreakpointListener {
  public static EventListenerOptions: AddEventListenerOptions = {
    passive: true,
    capture: false
  };
  public static UnitRegexp: RegExp = /[^\d]+$/;

  protected store?: Store<any>;
  protected debounceFunction?: (
    interval: number,
    listener: EventListenerOrEventListenerObject
  ) => EventListenerOrEventListenerObject;
  protected interval?: number;
  protected matchMediaMode: boolean = false;
  protected direction: 'width' | 'height' = 'width';
  protected client: {
    width: number;
    height: number;
  } = { width: 0, height: 0 };
  protected breakpoints: Breakpoint[] = [];
  protected sizeName?: string;
  protected listener?: EventListenerOrEventListenerObject;

  /**
   * Constructor
   */
  constructor({
    store,
    options
  }: {
    store: Store<any>;
    options: PluginOptions;
  }) {
    if (typeof window === 'undefined') {
      return;
    }

    this.store = store;
    this.updateOptions(options);
    this.init();
  }

  /**
   * Initialize
   */
  public init() {
    const listener = this.onResize.bind(this);
    this.listener =
      this.debounceFunction && this.interval
        ? this.debounceFunction(this.interval, listener)
        : listener;

    if (!this.listener) {
      return;
    }

    this.onResize();
    addEventListener(
      window,
      'resize',
      this.listener,
      BreakpointListener.EventListenerOptions
    );
  }

  /**
   * Destroy
   */
  public destroy() {
    if (!this.listener) {
      return;
    }

    removeEventListener(
      window,
      'resize',
      this.listener,
      BreakpointListener.EventListenerOptions
    );
  }

  /**
   * Update Options
   */
  public updateOptions(options: PluginOptions) {
    this.debounceFunction = options.debounceFunction || this.debounceFunction;
    this.interval = options.interval || this.interval;
    this.matchMediaMode = options.matchMediaMode || this.matchMediaMode;
    this.matchValueFunction = this.matchMediaMode
      ? this.matchMedia
      : this.matchClient;
    this.direction = options.direction || this.direction;
    this.setBreakpoints(options.breakpoints);
  }

  /**
   * Set the breakpoints
   */
  public setBreakpoints(breakpoints: Breakpoints) {
    this.breakpoints = Object.keys(breakpoints)
      .sort(
        // ASC
        (a, b) =>
          parseFloat(`${breakpoints[a]}`) < parseFloat(`${breakpoints[b]}`)
            ? -1
            : 1
      )
      .map(name => ({
        name,
        value: this.normalizeBreakpointValue(breakpoints[name])
      }));

    if (this.breakpoints.length < 2) {
      throw new Error('You need at least 2 breakpoints.');
    }
  }
  protected matchValueFunction: (value: any) => boolean = (v: any) => false;

  /**
   * Handler of resize event
   */
  protected onResize() {
    this.setDimensions();
    this.update();
  }

  /**
   * Set client dimensions to properties
   */
  protected setDimensions() {
    if (this.matchMediaMode) {
      return;
    }

    this.client.width = getClientWidth();
    this.client.height = getClientHeight();
  }

  /**
   * Normalize value of the breakpoint
   */
  protected normalizeBreakpointValue(value: string | number): string | number {
    if (this.matchMediaMode) {
      return isString(value) && BreakpointListener.UnitRegexp.test(value)
        ? value
        : `${value}px`;
    } else if (isString(value)) {
      return parseFloat(value);
    }

    return value;
  }

  /**
   * Update
   */
  protected update() {
    const newSizeName = this.getSizeName();

    if ((!this.sizeName || this.sizeName !== newSizeName) && this.store) {
      this.sizeName = newSizeName;
      this.store.commit(MUTATION_CHANGE_VIEWPORT, newSizeName);
    }
  }

  /**
   * Getting of viewport size name
   */
  protected getSizeName(): string {
    let matched: string = '';

    this.breakpoints.some(({ name, value }) => {
      if (this.matchValueFunction(value)) {
        matched = name;

        return false;
      }

      return true;
    });

    return matched;
  }

  protected matchMedia(value: string) {
    return window.matchMedia(`(min-${this.direction}:${value})`).matches;
  }

  protected matchClient(value: number) {
    return this.client[this.direction] >= value;
  }
}