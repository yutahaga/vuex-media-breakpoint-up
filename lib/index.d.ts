import { Plugin } from 'vuex';
export { MUTATION_CHANGE_VIEWPORT } from './breakpoint';
export interface Breakpoints {
    [key: string]: number | string;
}
export interface PluginOptions {
    breakpoints: Breakpoints;
    debounceFunction?: (interval: number, listener: EventListenerOrEventListenerObject) => EventListenerOrEventListenerObject;
    interval?: number;
    matchMediaMode?: boolean;
    direction?: 'width' | 'height';
}
declare const createBreakpointPlugin: (options: PluginOptions) => Plugin<any>;
export default createBreakpointPlugin;
