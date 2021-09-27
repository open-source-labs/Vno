/* eslint-disable */
/* eslint-disable prettier/prettier */
// deno-lint-ignore-file
import * as Vue from "https://deno.land/x/vue_js@/mod.js";

const Store = {
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
  name: 'store',
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
    <div id="nav">
     <router-link to="/store">Store</router-link> | 

     <router-link to="/links">Links</router-link> | 

     <router-link to="/tor">Tor</router-link> | 
</div>
    <router-view></router-view>

    
    <Store msg="you are building: nogood2 with vno" />
  </div>
`,
  name: 'app',
  components: {Store},
};

const vno505525 = Vue.createApp(App)
vno505525.component("store", Store)
export default App