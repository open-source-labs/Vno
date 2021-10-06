/* eslint-disable */
/* eslint-disable prettier/prettier */
// deno-lint-ignore-file
import * as Vue from "https://cdn.jsdelivr.net/npm/vue@3.0.5/dist/vue.esm-browser.js";


     
const test = {
  template: /* html */ `
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      <br />
    </p>
    <h3>
      <a href="https://vno.land" target="_blank" rel="noopener">vno.land</a> &
      <a
        href="https://github.com/oslabs-beta/vno"
        target="_blank"
        rel="noopener">
        github
      </a>
    </h3>
    <ul>
      <br />
    </ul>
  </div>
`,
  name: 'test',
  props: {
    msg: String,
  },
};

const App = {
  template: /* html */ `
  <div id="app">
    <img
      src="https://user-images.githubusercontent.com/63819200/128429048-5927eb19-b151-4855-93e3-2e0755c447a2.png"
      alt="image"
      border="0"
      width="450"
      height="auto"
    />
    <test msg="you are building: version-test-2 with vno" />
  </div>
`,
  name: 'app',
  components: {test},
};

const vno396625 = Vue.createApp(App)
vno396625.component("test", test)

vno396625.mount("#app")