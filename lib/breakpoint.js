import { MUTATION_CHANGE_VIEWPORT } from './';
import { getClientHeight, getClientWidth } from './client-size';
import { addEventListener, removeEventListener } from './listener';
const isString = (x) => typeof x === 'string';
export default class BreakpointListener {
    /**
     * Constructor
     */
    constructor({ store, options }) {
        this.matchMediaMode = false;
        this.direction = 'width';
        this.client = { width: 0, height: 0 };
        this.breakpoints = [];
        this.matchValueFunction = (v) => false;
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
    init() {
        const listener = this.onResize.bind(this);
        this.listener =
            this.debounceFunction && this.interval
                ? this.debounceFunction(this.interval, listener)
                : listener;
        if (!this.listener) {
            return;
        }
        this.onResize();
        addEventListener(window, 'resize', this.listener, BreakpointListener.EventListenerOptions);
    }
    /**
     * Destroy
     */
    destroy() {
        if (!this.listener) {
            return;
        }
        removeEventListener(window, 'resize', this.listener, BreakpointListener.EventListenerOptions);
    }
    /**
     * Update Options
     */
    updateOptions(options) {
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
    setBreakpoints(breakpoints) {
        this.breakpoints = Object.keys(breakpoints)
            .sort(
        // ASC
        (a, b) => parseFloat(`${breakpoints[a]}`) < parseFloat(`${breakpoints[b]}`)
            ? -1
            : 1)
            .map(name => ({
            name,
            value: this.normalizeBreakpointValue(breakpoints[name])
        }));
        if (this.breakpoints.length < 2) {
            throw new Error('You need at least 2 breakpoints.');
        }
    }
    /**
     * Handler of resize event
     */
    onResize() {
        this.setDimensions();
        this.update();
    }
    /**
     * Set client dimensions to properties
     */
    setDimensions() {
        if (this.matchMediaMode) {
            return;
        }
        this.client.width = getClientWidth();
        this.client.height = getClientHeight();
    }
    /**
     * Normalize value of the breakpoint
     */
    normalizeBreakpointValue(value) {
        if (this.matchMediaMode) {
            return isString(value) && BreakpointListener.UnitRegexp.test(value)
                ? value
                : `${value}px`;
        }
        else if (isString(value)) {
            return parseFloat(value);
        }
        return value;
    }
    /**
     * Update
     */
    update() {
        if (!this.store) {
            return;
        }
        const newSizeName = this.getSizeName();
        if (!this.sizeName) {
            this.store.commit(MUTATION_CHANGE_VIEWPORT, newSizeName);
            // Fallback
            // @see https://github.com/yutahaga/vuex-media-breakpoint-up/issues/1
            setTimeout(() => {
                if (!this.store) {
                    return;
                }
                this.store.commit(MUTATION_CHANGE_VIEWPORT, newSizeName);
            }, 200);
        }
        else {
            this.store.commit(MUTATION_CHANGE_VIEWPORT, newSizeName);
        }
        this.sizeName = newSizeName;
    }
    /**
     * Getting of viewport size name
     */
    getSizeName() {
        let matched = '';
        this.breakpoints.some(({ name, value }) => {
            if (this.matchValueFunction(value)) {
                matched = name;
                return false;
            }
            return true;
        });
        return matched;
    }
    matchMedia(value) {
        return window.matchMedia(`(min-${this.direction}:${value})`).matches;
    }
    matchClient(value) {
        return this.client[this.direction] >= value;
    }
}
BreakpointListener.EventListenerOptions = {
    passive: true,
    capture: false
};
BreakpointListener.UnitRegexp = /[^\d]+$/;
