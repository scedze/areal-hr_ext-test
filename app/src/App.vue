<template>
  <div>
    <nav class="nav">
      <router-link to="/organizations" class="nav-link">Организации</router-link>
      <router-link to="/departments" class="nav-link">Отделы</router-link>   
      <router-link to="/positions" class="nav-link">Должности</router-link> 
      <router-link to="/employees" class="nav-link">Сотрудники</router-link>
      <button @click="logout" class="logout-btn">Выйти</button> 
    </nav>
    <router-view />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from './api/auth';

const router = useRouter();
const isAuthenticated = ref(false);

const checkAuth = async () => {
  try {
    const response = await authApi.me();
    isAuthenticated.value = !!response.data.user;
  } catch {
    isAuthenticated.value = false;
  }
};

const logout = async () => {
  await authApi.logout();
  isAuthenticated.value = false;
  router.push('/login');
};

onMounted(() => {
  checkAuth();
});
</script>

<style>
.nav {
  background: #563c5c;
  padding: 15px 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}
.nav-link {
  color: #f2bdcd;
  text-decoration: none;
  font-weight: 500;
}
.logout-btn {
  background: #f2bdcd;
  color: #563c5c;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
