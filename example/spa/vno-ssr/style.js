const styles = `<style>
.place {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 320px;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  padding: 20px 20px;
  margin: 10px;
  color: black;
}
.place h2 {
  margin: 0;
  text-align: center;
}
.place img {
  margin: 10px;
  align-self: center;
}

#home {
  color: #fff;
  letter-spacing: 0.04em;
  text-align: center;
  margin: 60px;
  max-width: 800px;
  margin: 0 auto;
  display: table;
  padding: 20px;
  line-height: 1.4em;
}
a {
  color: #57d3af;
}
ul {
  max-width: 800px;
  text-align: left;
}

#deno {
  color: #fff;
  letter-spacing: 0.04em;
  text-align: center;
  margin: 60px;
  width: 370px;
  margin: 0 auto;
  display: table;
  padding: 20px;
  line-height: 1.4em;
}

body {
  width: 100vw;
  height: 100vh;
  font-family: 'NTR', sans-serif;
  background: #eee;
}

h1 {
  text-align: center;
}

.location-contain {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
}

body {
  font-family: 'Playfair Display', serif;
  background: #888;
}

#lighthouse {
  background: #212222;
  color: #fff;
  letter-spacing: 0.04em;
  text-align: center;
  margin: 60px;
  width: 370px;
  margin: 0 auto;
  display: table;
  padding: 20px;
  line-height: 1.4em;
}

.name {
  color: #ccc;
}

small {
  color: #bbb;
  font-size: 10px;
}

h3 {
  margin: 5px 0 4px;
}

.main-photo {
  width: 300px;
}

.main-profile {
  float: left;
  border: 3px solid white;
  margin: -25px 0 0 20px;
  position: relative;
  width: 80px;
}

.main-info {
  float: left;
  padding: 10px 20px;
  text-align: left;
  margin-bottom: 15px;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

li {
  list-style: none outside none;
  text-align: left;
  padding: 10px 0;
  border-bottom: 1px solid #555;
}

ul {
  margin: 0;
  padding: 0 35px;
}

hr {
  margin: 25px 0 0 32px;
  width: 300px;
  border-top: 0;
  border-bottom: 1px solid #555;
}

input {
  font-family: 'Playfair Display', serif;
  width: 280px;
  margin: 30px 0;
  padding: 8px 10px;
  outline: 0;
}

.post-img {
  border: 0px solid white;
  float: left;
  margin: 0 15px 0 -2px;
  transition: 0.3s all ease;
}

.post-comment {
  margin: 0 0 5px 0;
}

#vue-logo {
  max-width: 400px;
}
#vue-js {
  color: #fff;
  letter-spacing: 0.04em;
  text-align: center;
  margin: 60px;
  max-width: 800px;
  margin: 0 auto;
  display: table;
  padding: 20px;
  line-height: 1.4em;
}

body {
  background-color: #34495e;
}
.header {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #34495e;
  color: aliceblue;
  padding-bottom: 10px;
  padding-top: 20px;
  align-content: space-around;
}
.logo {
  padding: 20px;
}
.inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
button {
  color: #34495e;
  background-color: #57d3af;
  padding: 5px;
  text-size-adjust: auto;
  border-radius: 15px;
  margin: 10px;
}
</style>`
 export default styles