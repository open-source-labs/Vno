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

 
const IndividualComment = {
  template: /* html */ `
  <div>
    <li>
      <img class="post-img" :src="commentpost.authorImg" />
      <small>{{ commentpost.author }}</small>
      <p class="post-comment">"{{ commentpost.text }}"</p>
    </li>
  </div>
`,
  name: 'individual-comment',
  props: ["commentpost"],
};

const Destinations = {
  template: /* html */ `
  <div class="place">
    <img :src="location.img" width="235" height="300" />
    <slot></slot>
    <p>{{ location.desc }}</p>
  </div>
`,
  props: ['location'],
};

const Home = {
  template: /* html */ `
  <div id="home">
    <h1>Welcome to Your vno Project</h1>
    <p>
      Try spinning up your own vno project<br />
      by using our CLI tool here:<a
        href="https://github.com/jgrubb16/vnocli"
        target="_blank"
        rel="noopener"
        >Open Source CLI Tool</a
      >
    </p>
    <p>
      If you like this project, please consider taking the time to support us
      below. <br />It only takes a minute but it would mean the world to us.
    </p>
    <ul>
      <li>
        Give us a star on
        <a
          href="https://github.com/oslabs-beta/vno"
          target="_blank"
          rel="noopener"
          >GitHub</a
        >
      </li>
      <li>
        Give us some claps on
        <a href="https://medium.com/" target="_blank" rel="noopener">Medium!</a>
        (needs to be updated)
      </li>
      <li>
        Upvote us on
        <a href="https://www.producthunt.com/" target="_blank" rel="noopener"
          >Product Hunt</a
        >
        (needs to be updated)
      </li>
    </ul>
  </div>
`,
  name: 'home',
};

const Deno = {
  template: /* html */ `
  <div id="deno">
    <h1>Deno</h1>
    <a href="https://imgbb.com/"
      ><img
        id="deno-logo"
        src="https://i.ibb.co/b6jR0d1/deno-logo.png"
        alt="deno"
        border="0"
    /></a>
    <p>
      Deno is a runtime for JavaScript and TypeScript that is based on the V8
      JavaScript engine and the Rust programming language. It was created by
      Ryan Dahl, original creator of Node.js, and is focused on productivity. It
      was announced by Dahl in 2018 during his talk "10 Things I Regret About
      Node.js <br />
      Learn more about
      <a class="denoland" href="https://deno.land/" target="_blank">Deno </a>
    </p>
  </div>
`,
  name: 'deno',
};

const Travel = {
  template: /* html */ `
  <div id="travel">
    <h1>An example Vue Component borrowed from Sarah Drasner</h1>
    <div class="location-contain">
      <div class="locations" v-for="location in locations" :key="location.desc">
        <destinations :location="location">
          <h2>{{ location.name }}</h2>
        </destinations>
      </div>
    </div>
  </div>
`,
  name: 'travel',
  components: {
    Destinations,
  },
  data() {
    return {
      locations: [
        {
          name: 'moscow',
          img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/moscow.svg',
          desc: `Moscow is the capital and most populous city of Russia, with 13.2 million residents within the city limits and 17.8 million within the urban area. Moscow has the status of a Russian federal city.`,
        },
        {
          name: 'paris',
          img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/paris1.svg',
          desc: `Paris is the capital and most populous city of France. By the 17th century, Paris was one of Europe's major centres of finance, commerce, fashion, science, and the arts, and it retains that position still today.`,
        },
        {
          name: 'rome',
          img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/rome.svg',
          desc: `Rome's history spans more than 2,500 years. While Roman mythology dates the founding of Rome at around 753 BC, the site has been inhabited for much longer, making it one of the oldest continuously occupied sites in Europe.`,
        },
        {
          name: 'barcelona',
          img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/paris2.svg',
          desc: `The founding of Barcelona is the subject of two different legends. The first attributes the founding of the city to the mythological Hercules. The second legend attributes the foundation of the city to the Carthaginian general, Hamilcar Barca, father of Hannibal, who supposedly named the city Barcino after his family in the 3rd century BC`,
        },
      ],
    };
  },
};

const Lighthouse = {
  template: /* html */ `
  <div id="lighthouse">
    <h3>Another example Vue Component borrowed from Sarah Drasner</h3>
    <img
      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/vue-post-photo.jpg"
      class="main-photo"
    />
    <img
      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/vue-main-profile.jpg"
      class="main-profile"
    />
    <div class="main-info">
      <span class="name">Julianne Delfina</span>
      <h3>"It's lovely after it rains"</h3>
    </div>
    <hr />
    <ul>
      <individual-comment
        v-for="comment in allComments"
        :key="comment.key"
        :commentpost="comment"
      ></individual-comment>
    </ul>
    <input
      v-model="newComment"
      @keyup.enter="addComment"
      placeholder="Add a comment"
    />
  </div>
`,
  name: 'lighthouse',
  components: {
    IndividualComment,
  },
  data() {
    return {
      newComment: '',
      allComments: [],
      count: 0,
    };
  },
  computed: {
    comments() {
      console.log('x');
    },
  },
  methods: {
    addComment() {
      const post = {
        key: this.count,
        text: this.newComment,
        author: 'VNO TEAM',
        authorImg: 'https://i.ibb.co/1qLqhFv/vno-57.png',
      };
      console.log(this.newComment);
      this.allComments = [...this.allComments, post];
      this.newComment = '';
      this.count += 1;
    },
  },
};

const VueJs = {
  template: /* html */ `
  <div id="vue-js">
    <h1>Vue.js</h1>
    <a
      ><img
        id="vue-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
        alt="vue-js"
        border="0"
    /></a>
    <p>
      Vue.js is an open-source model–view–viewmodel front end JavaScript
      framework for building user interfaces and single-page applications. It
      was created by Evan You, and is maintained by him and the rest of the
      active core team members<br />
      Learn more about
      <a class="vuejs" href="https://vuejs.org/" target="_blank">Vue.js </a>
    </p>
  </div>
`,
  name: 'vue-js',
};

const App = {
  template: /* html */ `
  <div id="app">
    <header class="header">
      <img
        class="logo"
        src="https://svgshare.com/i/SNz.svg"
        alt="logo"
        v-on:click="handelClick('home')"
      />
      <nav class="inner">
        <button v-on:click="handelClick('home')">Home</button>
        <button v-on:click="handelClick('vue')">About Vue</button>
        <button v-on:click="handelClick('deno')">About Deno</button>
        <button v-on:click="handelClick('travel')">Travel</button>
        <button v-on:click="handelClick('lighthouse')">Lighthouse</button>
        <a
          class="github"
          href="https://github.com/oslabs-beta/vno"
          target="_blank"
          ><button>Github</button>
        </a>
      </nav>
    </header>
    <body v-if="displayedComponent === 'home'">
      <Home />
    </body>
    <body v-else-if="displayedComponent === 'lighthouse'">
      <Lighthouse />
    </body>
    <body v-else-if="displayedComponent === 'travel'">
      <Travel />
    </body>
    <body v-else-if="displayedComponent === 'vue'">
      <VueJs />
    </body>
    <body v-else-if="displayedComponent === 'deno'">
      <Deno />
    </body>
    <body v-else>
      <h1>Welcome to Your vno Project</h1>
    </body>
  </div>
`,
  name: 'app',
  data() {
    return {
      displayedComponent: 'home',
    };
  },
  methods: {
    handelClick: function (event) {
      this.displayedComponent = event;
      console.log(this.displayedComponent);
    },
  },
  components: {
    Home,
    Deno,

    Travel,
    Lighthouse,
    VueJs,
  },
};

const vno624500 = Vue.createApp(App)
vno624500.component("vue-js", VueJs)
vno624500.component("lighthouse", Lighthouse)
vno624500.component("individual-comment", IndividualComment)
vno624500.component("travel", Travel)
vno624500.component("destinations", Destinations)
vno624500.component("deno", Deno)
vno624500.component("home", Home)

vno624500.mount("#app")