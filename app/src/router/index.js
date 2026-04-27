import { createRouter, createWebHistory } from 'vue-router';
import OrganizationsPage from '../pages/OrganizationsPage.vue';
import DepartmentsPage from '../pages/DepartmentsPage.vue';
import PositionsPage from '../pages/PositionsPage.vue';
import EmployeesPage from '../pages/EmployeesPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/',
      redirect: '/organizations',
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../pages/OrganizationsPage.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../pages/DepartmentsPage.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('../pages/PositionsPage.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../pages/EmployeesPage.vue'),
      meta: {requiresAuth: true},
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const { authApi } = await import('../api/auth');
      const response = await authApi.me();
      if (!response.data.user) {
        next('/login');
      } else {
        next();
      }
    } catch {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
