import BreakpointListener from './breakpoint';
export const MUTATION_CHANGE_VIEWPORT = 'CHANGE_VIEWPORT';
const createBreakpointPlugin = (options) => {
    return (store) => new BreakpointListener({ store, options });
};
export default createBreakpointPlugin;
