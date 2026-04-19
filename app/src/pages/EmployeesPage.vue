<template>
  <div class="container">
    <div class="header">
      <h1>Сотрудники</h1>
      <button @click="openCreateDialog" class="btn-add">
        + Добавить сотрудника
      </button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="employees.length > 0" class="employees-list">
      <div v-for="emp in employees" :key="emp.id" class="employee-card">
        <div class="employee-info">
          <div class="employee-name">
            {{ emp.last_name }} {{ emp.first_name }} {{ emp.middle_name || '' }}
          </div>
          <div class="employee-details">
            <span v-if="emp.birth_date">ДР {{ formatDate(emp.birth_date) }}</span>
            <span v-if="emp.passport_series && emp.passport_number">
              Паспорт {{ emp.passport_series }} {{ emp.passport_number }}
            </span>
          </div>
        </div>
        <div class="employee-actions">
          <button @click="openEditDialog(emp)" class="btn-edit">Изм.</button>
          <button @click="confirmDelete(emp)" class="btn-delete">Удл.</button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty">
      Нет сотрудников
    </div>

    <div v-if="dialogVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать' : 'Создать' }} сотрудника</h2>
        
        <div class="form-section">
          <h3>Основная информация</h3>
          <div class="form-row">
            <input v-model="form.last_name" placeholder="Фамилия *" class="input" />
            <input v-model="form.first_name" placeholder="Имя *" class="input" />
            <input v-model="form.middle_name" placeholder="Отчество" class="input" />
          </div>
          <div class="form-row">
            <div class="input-group">
              <label>Дата рождения</label>
              <input type="date" v-model="form.birth_date" class="input" />
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Паспортные данные</h3>
          <div class="form-row">
            <input v-model="form.passport_series" placeholder="Серия" class="input" />
            <input v-model="form.passport_number" placeholder="Номер" class="input" />
            <input v-model="form.passport_department_code" placeholder="Код подр." class="input" />
          </div>
          <div class="form-row">
            <div class="input-group">
              <label>Дата выдачи</label>
              <input type="date" v-model="form.passport_issue_date" class="input" />
            </div>
            <input v-model="form.passport_issued_by" placeholder="Кем выдан" class="input" />
          </div>
        </div>
        
        <div class="form-section">
          <h3>Адрес регистрации</h3>
          <div class="form-row">
            <input v-model="form.registration_region" placeholder="Область/Регион" class="input" />
            <input v-model="form.registration_locality" placeholder="Город/Населенный пункт" class="input" />
          </div>
          <div class="form-row">
            <input v-model="form.registration_street" placeholder="Улица" class="input" />
            <input v-model="form.registration_house" placeholder="Дом" class="input" />
            <input v-model="form.registration_building" placeholder="Корпус" class="input" />
            <input v-model="form.registration_apartment" placeholder="Кв." class="input" />
          </div>
        </div>
        
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
import { employeesApi } from '../api/employees';

const loading = ref(false);
const employees = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);

const initialForm = {
  last_name: '', first_name: '', middle_name: '', birth_date: '',
  passport_series: '', passport_number: '', passport_issue_date: '',
  passport_department_code: '', passport_issued_by: '',
  registration_region: '', registration_locality: '', registration_street: '',
  registration_house: '', registration_building: '', registration_apartment: '',
};

const form = ref({ ...initialForm });

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ru-RU');
};

const loadEmployees = async () => {
  loading.value = true;
  try {
    const response = await employeesApi.getAll();
    employees.value = response.data;
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  isEdit.value = false;
  editingId.value = null;
  form.value = { ...initialForm };
  dialogVisible.value = true;
};

const openEditDialog = (emp) => {
  isEdit.value = true;
  editingId.value = emp.id;
  form.value = { 
    ...emp,
    birth_date: emp.birth_date?.split('T')[0] || '',
    passport_issue_date: emp.passport_issue_date?.split('T')[0] || ''
  };
  dialogVisible.value = true;
};

const save = async () => {
  console.log('Сохраняем:', form.value);
  
  if (!form.value.last_name || !form.value.first_name) {
    alert('Фамилия и имя обязательны');
    return;
  }

  try {
    let response;
    if (isEdit.value) {
      response = await employeesApi.update(editingId.value, form.value);
      console.log('Обновлено:', response);
      alert('Сотрудник обновлен');
    } else {
      response = await employeesApi.create(form.value);
      console.log('Создано:', response);
      alert('Сотрудник создан');
    }
    dialogVisible.value = false;
    await loadEmployees();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
      alert('Ошибка: ' + JSON.stringify(error.response.data));
    } else {
      alert('Ошибка сохранения');
    }
  }
};

const confirmDelete = (emp) => {
  if (confirm(`Удалить сотрудника ${emp.last_name}?`)) {
    employeesApi.delete(emp.id).then(() => loadEmployees());
  }
};

onMounted(loadEmployees);
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
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #563c5c;
  margin: 0;
}

.btn-add {
  background-color: #f2bdcd;
  color: #563c5c;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.employees-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.employee-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #f2bdcd;
  box-shadow: 0 4px 10px rgba(86, 60, 92, 0.05);
}

.employee-name {
  font-weight: 600;
  color: #563c5c;
  font-size: 17px;
  margin-bottom: 8px;
}

.employee-details {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #888;
}

.employee-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-edit, .btn-delete {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  border: 1px solid #eee;
}

.btn-edit { color: #563c5c; }
.btn-delete { color: #a64452; }

.modal {
  position: fixed;
  inset: 0;
  background: rgba(86, 60, 92, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 25px;
}

.form-section h3 {
  font-size: 14px;
  text-transform: uppercase;
  color: #f2bdcd;
  letter-spacing: 1px;
  margin-bottom: 15px;
  border-bottom: 1px solid #fcfaff;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 12px;
  color: #563c5c;
  font-weight: 600;
}

.input {
  flex: 1;
  padding: 12px;
  border: 2px solid #f2bdcd;
  border-radius: 10px;
  font-family: inherit;
  outline: none;
}

.input:focus {
  border-color: #563c5c;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-save {
  background: #f2bdcd; 
  color: #563c5c;      
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #563c5c; 
  color: #f2bdcd;      
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}

.loading, .empty {
  text-align: center;
  padding: 100px;
  color: #563c5c;
  font-weight: 600;
}
</style>