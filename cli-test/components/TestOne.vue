<template>
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
</template>

<script>
export default {
  name: 'test-one',
  props: {
    msg: String,
  },
};
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
  a {
  color: #79d0b2;
}
</style>