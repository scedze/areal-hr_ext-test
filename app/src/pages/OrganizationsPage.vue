<template>
  <div class="container">
    <h1>Организации</h1>
    <button @click="loadOrganizations">Обновить</button>

    <div v-if="loading">Загрузка...</div>
    <ul v-else>
      <li v-for="org in organizations" :key="org.id">
        {{ org.name }} - {{ org.comment }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { organizationsApi } from '../api/organizations';

const loading = ref(false);
const organizations = ref([]);

const loadOrganizations = async () => {
  loading.value = true;
  try {
    const response = await organizationsApi.getAll();
    organizations.value = response.data;
    console.log('Загружено:', organizations.value);
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка загрузки');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>