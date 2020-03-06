import Vue from "vue";
import Router from "vue-router";
import paths from "./paths";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: paths
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/404"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = sessionStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  next();
});

export default router;
