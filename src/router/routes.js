const routes = [
  {
    path: "/auth",
    meta: { auth: false },
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/",
    meta: { auth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/manage",
    meta: { auth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "customer",
        name: "Customer",
        component: () => import("pages/CustomerPage.vue"),
      },
      {
        path: "history",
        name: "History",
        component: () => import("pages/HistoryPage.vue"),
      },
      {
        path: "product",
        name: "product",
        component: () => import("pages/ProductPage.vue"),
      },
      {
        path: "detail",
        component: () => import("pages/DetailPage.vue"),
        children: [
          {
            path: "customer",
            name: "Customer Detail",
          },
          {
            path: "history",
            name: "History Detail",
          },
        ],
      },
    ],
  },
  {
    path: "/transaction",
    name: "Transaction",
    component: () => import("pages/TransactionPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
