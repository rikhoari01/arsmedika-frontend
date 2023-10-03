import { defineStore } from "pinia";
import { axiosInstance } from "boot/axios";

export const customerStore = defineStore("customer", {
  state: () => ({
    customers: {},
  }),
  getters: {
    dataCustomers: (state) => state.customers,
  },
  actions: {
    getCustomers() {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer",
          method: "GET",
        })
          .then((resp) => {
            const customers = resp.data.result;
            this.$patch({ customers: customers });
            resolve(resp);
          })
          .catch((err) => {
            this.$patch({ customers: {} });
            resolve(err);
          });
      });
    },
    getCustomerById(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer/detail?id=" + id,
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
    storeCustomer(customer) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer",
          method: "POST",
          data: customer,
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    updateCustomer(id, customer) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer?id=" + id,
          method: "PUT",
          data: customer,
        })
          .then((resp) => {
            resolve(resp);
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
    deleteCustomer(id) {
      return new Promise((resolve, reject) => {
        this.$patch({ status: "loading" });
        axiosInstance({
          url: "/api/customer?id=" + id,
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
