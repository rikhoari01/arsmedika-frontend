import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";

export const historyStore = defineStore("history", {
  actions: {
    getHistories() {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/history_transaction",
          method: "GET",
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    getHistoiresByCustomer(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer/transaction?id=" + id,
          method: "GET",
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    getHistoiresDetail(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/history_transaction_detail?id=" + id,
          method: "GET",
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    getReceipt(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/download_struk?id_transaction=" + id,
          method: "GET",
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
  },
});
