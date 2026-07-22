<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="md" type="light">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <template v-if="isLoggedIn">
              <b-nav-item to="/" exact-active-class="active-link">Home</b-nav-item>
              <b-nav-item to="/user" active-class="active-link">User</b-nav-item>

              <b-nav-item-dropdown text="Profile" right>
                <b-dropdown-item to="/userInfo">User info</b-dropdown-item>
                <b-dropdown-item @click="logout">Log out</b-dropdown-item>
              </b-nav-item-dropdown>
            </template>

            <template v-else>
              <b-nav-item to="/login">Login</b-nav-item>
              <b-nav-item to="/register">Register</b-nav-item>
            </template>
          </b-navbar-nav>
        </b-collapse>
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
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1f2328;
}

#nav .navbar {
  background: #ffffff;
  border-bottom: 1px solid #eceef1;
  padding: 12px 32px;
}

#nav .navbar-nav {
  align-items: center;
  gap: 4px;
}

#nav .nav-link {
  color: #4b5563 !important;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 14px !important;
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease;
}

#nav .nav-link:hover {
  background: #f0f4f3;
  color: #0f766e !important;
}

#nav .nav-item .active-link .nav-link,
#nav .router-link-exact-active {
  background: #e7f4f2;
  color: #0f766e !important;
}

#nav .dropdown-menu {
  border: 1px solid #eceef1;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(20, 24, 28, 0.08);
  padding: 6px;
  margin-top: 6px;
}

#nav .dropdown-item {
  border-radius: 6px;
  font-size: 14px;
  padding: 8px 12px;
}

#nav .dropdown-item:hover {
  background: #f0f4f3;
  color: #0f766e;
}

#nav .navbar-toggler {
  border: none;
}

#nav .navbar-toggler-icon {
  filter: none;
}
</style>
