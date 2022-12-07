<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-nav class="ml-auto">
          <b-navbar-brand to="/">Home</b-navbar-brand>
          <b-nav-item to="/user">User</b-nav-item>
          <b-nav-item-dropdown text="Profile">
            <b-dropdown-item to="/login">Login</b-dropdown-item>
            <b-dropdown-item to="/userInfo">UserInfo</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>
    <!-- Render the content of the current page view -->
    <router-view />
  </div>
</template>

<style>
*{
  padding: 0;
  margin:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
