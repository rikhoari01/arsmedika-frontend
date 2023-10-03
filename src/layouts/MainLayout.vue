<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> ARSMEDIKA DASHBOARD </q-toolbar-title>

        <div class="q-pa-md">
          <q-btn-dropdown color="secondary" label="Profile">
            <div class="row no-wrap q-pa-md justify-center">
              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ profile.name }}
                </div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                  @click="Logout"
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";
import { authStore } from "src/stores/auth";

const linksList = [
  {
    title: "Home",
    icon: "home",
    link: "#",
  },
  {
    title: "Customer",
    icon: "group",
    link: "#/manage/customer",
  },
  {
    title: "Claims History",
    icon: "history",
    link: "#/manage/history",
  },
  {
    title: "Products",
    icon: "list",
    link: "#/manage/product",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const auth = authStore();
    const router = useRouter();

    const profile = auth.dataProfile;

    const Logout = () => {
      if (auth.isLoggedIn) {
        auth.logout();
        router.push("/auth/login");
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      Logout,
      profile,
    };
  },
});
</script>
