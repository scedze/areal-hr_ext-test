<template>
  <div class="container">
    <div class="header">
      <h1>Должности</h1>
      <button @click="openCreateDialog" class="btn-add">
        + Добавить должность
      </button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="positions.length > 0" class="positions-list">
      <div v-for="pos in positions" :key="pos.id" class="position-card">
        <div class="position-info">
          <div class="position-name">{{ pos.name }}</div>
          <div class="position-date" v-if="pos.created_at">
            Создано: {{ formatDate(pos.created_at) }}
          </div>
        </div>
        <div class="position-actions">
          <button @click="openEditDialog(pos)" class="btn-edit">Изм.</button>
          <button @click="confirmDelete(pos)" class="btn-delete">Удл.</button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty">
      Нет должностей
    </div>

    <div v-if="dialogVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать' : 'Создать' }} должность</h2>
        
        <input
          v-model="form.name"
          placeholder="Название *"
          class="input"
          @keyup.enter="save"
        />
        
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
import { positionsApi } from '../api/positions';

const loading = ref(false);
const positions = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);

const form = ref({
  name: '',
});

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadPositions = async () => {
  loading.value = true;
  try {
    const response = await positionsApi.getAll();
    positions.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  isEdit.value = false;
  editingId.value = null;
  form.value = { name: '' };
  dialogVisible.value = true;
};

const openEditDialog = (pos) => {
  isEdit.value = true;
  editingId.value = pos.id;
  form.value = { name: pos.name };
  dialogVisible.value = true;
};

const save = async () => {
  if (!form.value.name.trim()) return;

  try {
    if (isEdit.value) {
      await positionsApi.update(editingId.value, form.value);
    } else {
      await positionsApi.create(form.value);
    }
    dialogVisible.value = false;
    await loadPositions();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  }
};

const confirmDelete = (pos) => {
  if (confirm(`Удалить должность "${pos.name}"?`)) {
    positionsApi.delete(pos.id)
      .then(() => loadPositions())
      .catch(error => console.error('Ошибка удаления:', error));
  }
};

onMounted(() => {
  loadPositions();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  background-color: #fcfaff;
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
  font-size: 14px;
  transition: all 0.2s;
}

.btn-add:hover {
  background-color: #e5abbb;
  transform: scale(1.02);
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.position-card {
  background: white;
  border-radius: 12px;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(86, 60, 92, 0.05);
  border: 1px solid #f2bdcd;
  transition: all 0.2s ease-in-out;
}

.position-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(86, 60, 92, 0.08);
  border-color: #563c5c;
}

.position-name {
  font-weight: 600;
  color: #563c5c;
  font-size: 17px;
}

.position-date {
  font-size: 12px;
  color: #a0a0a0;
  margin-top: 4px;
}

.position-actions {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  border: 1px solid #eee;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-edit { color: #563c5c; }
.btn-delete { color: #a64452; }

.btn-edit:hover, .btn-delete:hover {
  background-color: #f2bdcd;
  border-color: #563c5c;
}

.loading, .empty {
  text-align: center;
  padding: 80px;
  color: #563c5c;
  font-weight: 600;
  font-size: 18px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(86, 60, 92, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 35px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.modal-content h2 {
  font-family: 'Montserrat', sans-serif;
  color: #563c5c;
  margin-top: 0;
  font-size: 24px;
  margin-bottom: 25px;
}

.input {
  width: 100%;
  padding: 14px;
  margin-bottom: 25px;
  border: 2px solid #f2bdcd;
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.input:focus {
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
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  color: #563c5c;
  font-weight: 600;
}

.btn-save {
  background: #563c5c;
  color: #f2bdcd;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.btn-save:hover {
  background-color: #45304a;
}
</style>