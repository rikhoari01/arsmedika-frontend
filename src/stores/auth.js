import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";

export const authStore = defineStore("auth", {
  state: () => ({
    status: "success",
    access_token: "",
    profile: {},
  }),
  getters: {
    isLoggedIn: (state) => !!state.access_token,
    dataProfile: (state) => state.profile,
  },
  actions: {
    logout() {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
      this.$patch({ status: "success", access_token: "" });
    },
    login(user) {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/login",
          data: user,
          method: "POST",
        })
          .then((resp) => {
            const access_token = resp.data.result.access_token;
            localStorage.setItem("access_token", access_token);
            axiosInstance.defaults.headers[
              "Authorization"
            ] = `Bearer ${access_token}`;
            this.$patch({ status: "success", access_token: access_token });
            this.getProfile();
            resolve(resp);
          })
          .catch((err) => {
            this.$patch({ status: "error", access_token: "" });
            localStorage.removeItem("access_token");
            delete axiosInstance.defaults.headers["Authorization"];
            resolve(err);
          });
      });
    },
    getProfile() {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/me",
          method: "GET",
        })
          .then((resp) => {
            const profile = resp.data.result;
            this.$patch({ profile: profile });
            resolve(resp);
          })
          .catch((err) => {
            this.$patch({ profile: {} });
            resolve(err);
          });
      });
    },
  },
});
