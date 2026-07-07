<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-nav class="ml-auto">
          <template v-if="isLoggedIn">
            <b-navbar-brand to="/">Home</b-navbar-brand>
            <b-nav-item to="/user">User</b-nav-item>

            <b-nav-item-dropdown text="Profile">
              <b-dropdown-item to="/userInfo">UserInfo</b-dropdown-item>
              <b-dropdown-item @click="logout">Log out</b-dropdown-item>
            </b-nav-item-dropdown>
          </template>

          <template v-else>
            <b-nav-item to="/login">Login</b-nav-item>
            <b-nav-item to="/register">Register</b-nav-item>
          </template>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.checkLoginStatus()
    window.addEventListener('auth-change', this.checkLoginStatus)
  },
  beforeDestroy() {
    window.removeEventListener('auth-change', this.checkLoginStatus)
  },
  watch: {
    $route() {
      this.checkLoginStatus()
    }
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('token')
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInFo')
      localStorage.removeItem('password')

      this.isLoggedIn = false
      window.dispatchEvent(new Event('auth-change'))

      this.$router.replace('/login')
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
