<template>
  <div class="container">
    <div class="header">
      <h1>Организации</h1>
      <button @click="openCreateDialog" class="btn-add">+ Добавить</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Комментарий</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="org in organizations" :key="org.id">
          <td>{{ org.name }}</td>
          <td>{{ org.comment || '—' }}</td>
          <td>
            <button @click="openEditDialog(org)" class="btn-edit">Изм</button>
            <button @click="confirmDelete(org)" class="btn-delete">Удл</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="dialogVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать' : 'Создать' }} организацию</h2>
        <input
          v-model="form.name"
          placeholder="Название *"
          class="input"
        />
        <textarea
          v-model="form.comment"
          placeholder="Комментарий"
          class="textarea"
          rows="3"
        ></textarea>
        <div class="modal-actions">
          <button @click="dialogVisible = false" class="btn-cancel">Отмена</button>
          <button @click="save" class="btn-save">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { organizationsApi } from '../api/organizations';

const loading = ref(false);
const organizations = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);

const form = ref({
  name: '',
  comment: '',
});

const loadOrganizations = async () => {
  loading.value = true;
  try {
    const response = await organizationsApi.getAll();
    organizations.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    alert('Ошибка загрузки организаций');
  } finally {
    loading.value = false;
  }
}; 

const openCreateDialog = () => {
  isEdit.value = false;
  editingId.value = null;
  form.value = { name: '', comment: '' };
  dialogVisible.value = true;
};

const openEditDialog = (org) => {
  isEdit.value = true;
  editingId.value = org.id;
  form.value = { name: org.name, comment: org.comment };
  dialogVisible.value = true;
};

const save = async () => {
  if (!form.value.name) {
    alert('Введите название');
    return;
  }

  try {
    if (isEdit.value) {
      await organizationsApi.update(editingId.value, form.value);
      alert('Организация обновлена');
    } else {
      await organizationsApi.create(form.value);
      alert('Организация создана');
    }
    dialogVisible.value = false;
    await loadOrganizations();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    alert('Ошибка сохранения');
  }
};

const confirmDelete = (org) => {
  if (confirm(`Удалить организацию "${org.name}"?`)) {
    organizationsApi.delete(org.id)
      .then(() => {
        alert('Организация удалена');
        loadOrganizations();
      })
      .catch((error) => {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления');
      });
  }
};

onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  background-color: #f9f4f6; 
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #563c5c;
  letter-spacing: -0.5px;
}

.btn-add {
  background-color: #f2bdcd;
  color: #563c5c; 
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.btn-add:hover {
  background-color: #e5abbb;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(86, 60, 92, 0.05);
  overflow: hidden;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background-color: #f2bdcd;
  color: #563c5c;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 800;
}

.btn-edit, .btn-delete {
  border: 1px solid #eee;
  background: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 5px;
}

.btn-edit {
  color: #563c5c;
}

.btn-delete {
  color: #a64452; 
}

.btn-edit:hover, .btn-delete:hover {
  background-color: #f2bdcd;
  border-color: #563c5c;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #563c5c;
  font-weight: bold;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(86, 60, 92, 0.4); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
}

.modal-content h2 {
  font-family: 'Montserrat', sans-serif;
  color: #563c5c;
  margin-top: 0;
  font-size: 22px;
}

.input, .textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #f2bdcd; 
  border-radius: 8px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #563c5c; 
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background: #f1f2f6;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #563c5c;
}

.btn-save {
  background: #563c5c; 
  color: #f2bdcd;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.btn-save:hover {
  background-color: #45304a;
}
</style>