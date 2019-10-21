<template>
  <div
    class="d-flex"
    id="wrapper"
    :style="{'paddingTop' : (hiddenLoader ? (0 + 'px') : (5 + 'px')) }"
  >
    <!-- Sidebar -->
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">
        <span>Demo Vuejs</span>
      </div>
      <div class="list-group list-group-flush">
        <div class="profile">
          <img
            :src="getProfile.avatar ? getProfile.avatar : 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
            alt="profile"
          />
          <div class="infomation">
            <span class="name">{{getProfile.fullName}}</span>
            <br />
            <span class="role">ADMIN</span>
            <br />
            <span class="active">
              <i class="fa fa-circle" aria-hidden="true"></i>
              Active
            </span>
          </div>
        </div>
        <router-link to="/dashboard/flat" class="list-group-item list-group-item-action bg-light">
          <i class="fa fa-home" aria-hidden="true"></i>
          &nbsp; List flat
        </router-link>
        <router-link
          to="/dashboard/notification"
          class="list-group-item list-group-item-action bg-light"
        >
          <i class="fa fa-bell" aria-hidden="true"></i>
          &nbsp;Notification
        </router-link>
        <router-link to="/dashboard/page1" class="list-group-item list-group-item-action bg-light">
          <i class="fa fa-address-book" aria-hidden="true"></i>
          &nbsp;Test modal
        </router-link>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          &nbsp; Events
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-light">
          <i class="fa fa-id-card" aria-hidden="true"></i>
          &nbsp; Profile
        </a>
        <a class="list-group-item list-group-item-action bg-light" @click="onLogout()">
          <i class="fa fa-sign-out"></i>
          &nbsp; Logout
        </a>
      </div>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <a class="toggle-nav" id="menu-toggle" @click="toggleMenu">&#9776;</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="navbar-nav ml-auto mt-2 mt-lg-0">
            <v-btn color="primary" class="add-employee" @click="create">{{titleButton}}</v-btn>
          </div>
        </div>
      </nav>

      <div class="container-fluid">
        <router-view />
      </div>
    </div>
    <!-- /#page-content-wrapper -->
  </div>
</template>

<script>
import { MENU_URL, MENU_URL_PROPERTIES } from "./../../../config/menu";
import { eventBus } from "./../../../main";
import { loaderService } from "./../../../shared/loader";
import { mapGetters, mapActions } from "vuex";
import { appSocketService } from "./../../../services/app-socket";
import * as $ from 'jquery';
const JWT = require("jwt-decode");
export default {
  name: "DashBoard",
  data() {
    return {
      items: [
        { title: "Home", icon: "mdi-home-city" },
        { title: "My Account", icon: "mdi-account" },
        { title: "Users", icon: "mdi-account-group-outline" }
      ],
      titleButton: "",
      typeCreate: "",
      hiddenLoader: false
    };
  },
  created() {
    let token = localStorage.getItem("token");
    let decoded;
    if (token) {
      decoded = JWT(token);
      let body = {
        userType: 2,
        userID: decoded.id,
        sessionID: token
      };
      appSocketService.newUserConnect(body);
    }
    loaderService.getValue().subscribe(data => {
      if (data != null) {
        if (data == 100) {
          setTimeout(() => {
            this.hiddenLoader = true;
          }, 1000);
        }
      }
    });
  },

  computed: {
    ...mapGetters(["getProfile"])
  },

  methods: {
    ...mapActions(["fetchCurrentUser"]),
    onLogout() {
      localStorage.clear();
      this.$router.push({ path: "/login" });
    },
    actionWithRouter() {
      if (this.$route.path == MENU_URL.FLAT) {
        this.titleButton = "Add new flat";
        this.typeCreate = "FLAT";
      }
      if (this.$route.path == MENU_URL.MODAL) {
        this.titleButton = "Add new modal";
        this.typeCreate = "MODAL";
      }
      if (this.$route.path == MENU_URL.NOTIFICATION) {
        this.titleButton = "Add new notification";
        this.typeCreate = "NOTIFICATION";
      }
    },
    create() {
      eventBus.$emit("actionCreate", this.typeCreate);
    },

    toggleMenu() {
      $("#wrapper").toggleClass("toggled");
    }
  },
  watch: {
    $route(to, from) {
      this.actionWithRouter();
    }
  },
  async mounted() {
    this.fetchCurrentUser();
    this.actionWithRouter();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!!localStorage.getItem("token")) {
        next();
      } else {
        next("/login");
      }
    });
  }
};
</script>

<style scoped lang = "scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,500,600,600i&display=swap");
body {
  font-family: "Muli", sans-serif;
}
.add-employee {
  background: #1867c0 !important;
}
#page-content-wrapper {
  background: #e4e9f2 !important;
}
.container-fluid {
  padding-top: 15px;
}
.toggle-nav {
  display: none;
}
.toggle-nav {
  cursor: pointer;
  padding: 4px 15px;
  float: left;
  display: inline-block;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  background: #303030;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.5);
  color: #fff !important;
  font-size: 20px;
  transition: color linear 0.15s;
}

.toggle-nav:hover,
.toggle-nav.active {
  text-decoration: none;
  color: #66a992;
}
.sidebar-heading {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  span {
    font-weight: bold;
    text-transform: uppercase;
  }
}
.list-group-item {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
}
.profile {
  padding: 20px;
  img {
    width: 65px;
    height: 65px;
    border-radius: 4px;
    float: left;
    margin-right: 10px;
  }
  .infomation {
    .name {
      font-weight: bold;
      font-size: 15px;
    }
    .role {
      font-size: 14px;
    }
    .active {
      font-size: 13px;
      i {
        font-size: 10px;
        color: #06c706;
      }
    }
  }
}
</style>