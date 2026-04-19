import { createRouter, createWebHistory } from 'vue-router';
import OrganizationsPage from '../pages/OrganizationsPage.vue';
import DepartmentsPage from '../pages/DepartmentsPage.vue';
import PositionsPage from '../pages/PositionsPage.vue';
import EmployeesPage from '../pages/EmployeesPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/organizations',
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: OrganizationsPage,
    },
    {
      path: '/departments',
      name: 'departments',
      component: DepartmentsPage,
    },
    {
      path: '/positions',
      name: 'positions',
      component: PositionsPage,
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesPage,
    },
  ],
});

export default router;
