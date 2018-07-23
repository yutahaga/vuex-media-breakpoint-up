# vuex-media-breakpoint-up

## Getting Started

```sh
yarn add @yutahaga/vuex-media-breakpoint-up
```

```js
import Vue from 'vue';
import Vuex from 'vuex';
import createBreakpointPlugin, { MUTATION_CHANGE_VIEWPORT } from 'vuex-media-breakpoint-up';

Vue.use(Vuex);

const plugin = createBreakpointPlugin({
  breakpoints: {
    default: 0, // required
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
```

## Options

```typescript
export interface PluginOptions {
  breakpoints: Breakpoints;
  debounceFunction?: (interval: number, listener: EventListenerOrEventListenerObject) => EventListenerOrEventListenerObject;
  interval?: number; // debounce interval
  matchMediaMode?: boolean; // if you want to use a number with a unit for a breakpoint
  direction?: 'width' | 'height';
}

export interface Breakpoints {
  [key: string]: number | string;
}
```
