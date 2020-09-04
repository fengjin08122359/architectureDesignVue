<template>
  <div class="app">
    <div class="nav">
      <router-link to="/html-lc-edit">html-lc-edit</router-link> |
      <router-link to="/html-lc-render">html-lc-render</router-link> |
      <router-link to="/html-lc-comp">html-lc-comp</router-link>
    </div>
    <router-view class='router' />
  </div>
</template>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.router{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 90px;
  overflow: auto;
}
</style>
