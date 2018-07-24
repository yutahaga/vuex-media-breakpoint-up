import { Store } from 'vuex';
import { Breakpoints, PluginOptions } from './';
export declare const MUTATION_CHANGE_VIEWPORT: string;
export interface Breakpoint {
    name: string;
    value: string | number;
}
export default class BreakpointListener {
    static EventListenerOptions: AddEventListenerOptions;
    static UnitRegexp: RegExp;
    protected store?: Store<any>;
    protected debounceFunction?: (interval: number, listener: EventListenerOrEventListenerObject) => EventListenerOrEventListenerObject;
    protected interval?: number;
    protected matchMediaMode: boolean;
    protected direction: 'width' | 'height';
    protected client: {
        width: number;
        height: number;
    };
    protected breakpoints: Breakpoint[];
    protected sizeName?: string;
    protected listener?: EventListenerOrEventListenerObject;
    /**
     * Constructor
     */
    constructor({ store, options }: {
        store: Store<any>;
        options: PluginOptions;
    });
    /**
     * Initialize
     */
    init(): void;
    /**
     * Destroy
     */
    destroy(): void;
    /**
     * Update Options
     */
    updateOptions(options: PluginOptions): void;
    /**
     * Set the breakpoints
     */
    setBreakpoints(breakpoints: Breakpoints): void;
    protected matchValueFunction: (value: any) => boolean;
    /**
     * Handler of resize event
     */
    protected onResize(): void;
    /**
     * Set client dimensions to properties
     */
    protected setDimensions(): void;
    /**
     * Normalize value of the breakpoint
     */
    protected normalizeBreakpointValue(value: string | number): string | number;
    /**
     * Update
     */
    protected update(): void;
    /**
     * Getting of viewport size name
     */
    protected getSizeName(): string;
    protected matchMedia(value: string): boolean;
    protected matchClient(value: number): boolean;
}
