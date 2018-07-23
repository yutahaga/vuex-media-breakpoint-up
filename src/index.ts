import { Plugin, Store } from 'vuex';
import BreakpointListener from './breakpoint';

export const MUTATION_CHANGE_VIEWPORT: string = 'CHANGE_VIEWPORT';

export interface Breakpoints {
  [key: string]: number | string;
}

export interface PluginOptions {
  breakpoints: Breakpoints;
  debounceFunction?: (
    interval: number,
    listener: EventListenerOrEventListenerObject
  ) => EventListenerOrEventListenerObject;
  interval?: number;
  matchMediaMode?: boolean;
  direction?: 'width' | 'height';
}

const createBreakpointPlugin = (options: PluginOptions): Plugin<any> => {
  return (store: Store<any>) => new BreakpointListener({ store, options });
};

export default createBreakpointPlugin;
