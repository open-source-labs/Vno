<template>
  <div id="app">   
    <!-- testing comment parsing -->
    <img
      src="https://svgshare.com/i/SNz.svg"
      alt="image"
      border="0"
      width="450"
      height="450"
    />
    <HelloVno msg="a test component" />
  </div>
</template>

<script>
import TestChild from "./TestChild.vue";

export default {
  name: 'app',
  components: { TestChild },
  data() {
    return {
      message: "this is a message",
      url: "http://thisurl.com/will/not/be/deleted",
    }
  },
  // this is a javascript comment;
  methods: {
    handelClick: function (event) {
      this.message = event; // this is another javascript comment;
      console.log(this.message);
    },
    /** this is the third js comment */
  }
};

</script>

<style lang="scss">

html {
  background-color: #203A42;
  body {
    color: pink;
  }
}
/* 
  some CSS comments
*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #79d0b2;
  margin-top: 60px;
}

</style>