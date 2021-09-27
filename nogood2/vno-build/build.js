/* eslint-disable */
/* eslint-disable prettier/prettier */
// deno-lint-ignore-file
import * as Vue from "https://cdn.jsdelivr.net/npm/vue@3.0.5/dist/vue.esm-browser.js";


    
// ===========================

// LIVE RELOADING

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

const reloadWindow = () => {
  window.location.reload();
};

// Connection opened
socket.addEventListener("open", function (event) {
  socket.send("[LiveReload client connected]");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  socket.send("[LiveReload reloading...]");
  if (event.data === 'reload window') {
    reloadWindow();
  }
});

// ===========================

 
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

vno505525.mount("#app")