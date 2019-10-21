<template>
  <div class="login-page">
    <h1>LOGIN</h1>
    <form @submit="onLogin($event)">
      <label for>Phone</label>
      <v-text-field :rules="rules" v-model="phone"></v-text-field>
      <label for>Password</label>
      <v-text-field v-model="password"></v-text-field>
      <v-btn color="primary" type="submit">Login</v-btn>
    </form>
  </div>
</template>

<script>
import { Url } from "./../../config/apiUrl";
import { ServerConfig } from "./../../config/serverConfig";
import instance from "./../../shared/callApi.service";
export default {
  name: "Login",
  data: () => ({
    rules: [],
    phone: "",
    password: ""
  }),
  methods: {
    onLogin(e) {
      e.preventDefault();
      let body = {
        phone: this.phone,
        password: this.password
      };
      instance
        .post(`${ServerConfig.API_ENDPOINT}/${Url.LOGIN}`, body)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              this.$router.push({ path: "/dashboard/flat" });
            } else {
              alert("Thong tin dang nhap khong chinh xac");
            }
          }
        })
        .catch(err => {
          return new Error(err);
        });
    }
  }
};
</script>

<style scoped lang = "scss">
.login-page {
  font-family: "Muli", sans-serif;
  width: 400px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  button {
    width: 100%;
    background: #1867c0 !important;
  }
  form {
    margin-top: 30px;
  }
}
</style>