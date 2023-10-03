import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";

export const transactionStore = defineStore("transaction", {
  actions: {
    postTransaction(data) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/transaction",
          method: "POST",
          data: data,
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
