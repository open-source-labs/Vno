/* eslint-disable */
/* eslint-disable prettier/prettier */
// deno-lint-ignore-file
import * as Vue from "https://deno.land/x/vue_js@/mod.js";

const TestOne = {
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
  name: 'test-one',
  props: {
    msg: String,
  },
};

const TestApp = {
  template: /* html */ `
    <div id="testapp">
    <img
      src="https://user-images.githubusercontent.com/63819200/128429048-5927eb19-b151-4855-93e3-2e0755c447a2.png"
      alt="image"
      border="0"
      width="450"
      height="auto"
    />
    <div id="nav">
     <router-link to="/testone">TestOne</router-link> 

     <router-link to="/testtwo">TestTwo</router-link> 

     <router-link to="/testthree">TestThree</router-link> 
</div>
    <router-view></router-view>

    
    <TestOne msg="you are building: cli-test with vno" />
  </div>
`,
  name: 'test-app',
  components: {TestOne},
};

const vno333044 = Vue.createApp(TestApp)
vno333044.component("test-one", TestOne)
export default TestApp