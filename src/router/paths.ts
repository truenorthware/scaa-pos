/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
import { RouteMeta } from "@/types";
import { UserModule } from "@/store/modules/user";

let requireAuth = function(to: any, from: any, next: any) {
  if (!UserModule.isLoggedOn) {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};

export default [
  {
    path: "*",
    redirect: {
      path: "/404"
    }
  },
  {
    path: "/404",
    name: "NotFound",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/404.vue`
      )
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/login.vue`
      )
  },
  {
    path: "/",
    meta: {},
    name: "Root",
    redirect: {
      name: "dashboard"
    }
  },
  // {
  //   path: "/home",
  //   name: "home",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "home" */
  //       `@/views/home.vue`
  //     ),
  //   // beforeEnter: requireAuth,
  //   meta: new RouteMeta({ title: "home" })
  // },
  {
    path: "/customer",
    name: "customer",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/customer.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "customer" })
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */
        `@/views/dashboard.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "dashboard" })
  },
  {
    path: "/pos-terminal",
    name: "pos-terminal",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/pos-terminal.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "pos-terminal" })
  },
  {
    path: "/products",
    name: "products",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/products.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "products" })
  },
  {
    path: "/purchase",
    name: "purchase",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/purchase.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "purchase" })
  },
  {
    path: "/staff",
    name: "staff",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/staff.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "staff" })
  },
  {
    path: "/upload-excel",
    name: "upload-excel",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/upload-excel.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "upload-excel" })
  },
  {
    path: "/posting",
    name: "posting",
    component: () =>
      import(
        /* webpackChunkName: "routes" */
        `@/views/posting.vue`
      ),
    // beforeEnter: requireAuth,
    meta: new RouteMeta({ title: "posting" })
  }
];
