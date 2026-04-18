import { createRouter, createWebHistory } from 'vue-router'
import OrganizationsPage from '@/pages/OrganizationsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/organizations',
    },
    {
      path: '/organizations',
      name: '/organizations',
      component: OrganizationsPage,
    },
  ],
});

export default router;
