<template>
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
</template>

<script>
import TestOne from './components/TestOne.vue';

export default {
  name: 'test-app',
  components: {TestOne},
};

</script>

<style>
html {
  background-color: #203A42;
}
#testapp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #79d0b2;
  margin-top: 60px;
}
</style>