import createBreakpointPlugin, { MUTATION_CHANGE_VIEWPORT } from '@/plugin';
import { createLocalVue } from '@vue/test-utils';
import * as Vuex from 'vuex';

declare var global: any;

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Vuex Media Breakpoint Up', () => {
  it('breakpoints option', (done) => {
    global.innerWidth = 560;

    const plugin = createBreakpointPlugin({
      breakpoints: {
        default: 0,
        sm: 512,
        md: 768,
        lg: 960,
      },
    });

    const store = new Vuex.Store({
      plugins: [plugin],

      state: {
        viewport: 'default',
      },

      mutations: {
        [MUTATION_CHANGE_VIEWPORT](state, viewport) {
          state.viewport = viewport;
        },
      },
    });

    global.innerWidth = 530;

    localVue.nextTick(() => {
      expect(store.state.viewport).toBe('sm');

      global.innerWidth = 780;
      global.dispatchEvent(new Event('resize'));

      localVue.nextTick(() => {
        expect(store.state.viewport).toBe('md');

        global.innerWidth = 990;
        global.dispatchEvent(new Event('resize'));

        localVue.nextTick(() => {
          expect(store.state.viewport).toBe('lg');

          global.innerWidth = 0;
          global.dispatchEvent(new Event('resize'));

          localVue.nextTick(() => {
            expect(store.state.viewport).toBe('default');

            done();
          });
        });
      });
    });
  });
});
