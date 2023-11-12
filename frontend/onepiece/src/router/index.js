import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //maybe replace this with accidents so it shows right away instead of having to do /accidents
    {
      path: "/",
      name: "home",
      //component: HomeView,
      component: () => import("../components/AllAccidents.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting means the view is loaded only when needed
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"), //component: () => this syntax is called dynamic import and it is called only when the route is visited
    },
    {
      path: "/accidents",
      name: "accidents",
      component: () => import("../components/AllAccidents.vue"),
    },
  ],
});

export default router;
