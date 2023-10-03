import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";

export const productStore = defineStore("product", {
  actions: {
    getProducts() {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/product_detail",
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
    getProductCode() {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/product_code",
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
    storeProduct(product) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/product_detail",
          method: "POST",
          data: product,
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    deleteProduct(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/product_detail?id=" + id,
          method: "DELETE",
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
