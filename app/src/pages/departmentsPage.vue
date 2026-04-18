<template>
  <div class="container">
    <div class="header">
      <h1>Отделы</h1>
      <div class="header-actions">
        <select v-model="selectedOrgId" class="org-select" @change="loadDepartments">
          <option value="">-- Выберите организацию --</option>
          <option v-for="org in organizations" :key="org.id" :value="org.id">
            {{ org.name }}
          </option>
        </select>
        <button @click="openCreateDialog" class="btn-add" :disabled="!selectedOrgId">
          + Добавить отдел
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="departments.length > 0" class="departments-list">
      <div 
        v-for="dept in sortedDepartments" 
        :key="dept.id" 
        class="department-card" 
        :style="{ marginLeft: getLevel(dept.id) * 30 + 'px' }"
      >
        <div class="department-info">
          <div class="department-name">
            <span v-if="getLevel(dept.id) > 0" class="level-indicator">
              <span v-for="n in getLevel(dept.id)" :key="n" class="indent-mark">- </span>
            </span>
            {{ dept.name }}
          </div>
          <div class="department-parent" v-if="dept.parent_id">
             Родительский отдел: <strong>{{ getParentName(dept.parent_id) }}</strong>
          </div>
          <div class="department-comment" v-if="dept.comment">{{ dept.comment }}</div>
        </div>
        <div class="department-actions">
          <button @click="openEditDialog(dept)" class="btn-edit">Изм.</button>
          <button @click="confirmDelete(dept)" class="btn-delete">Удл.</button>
        </div>
      </div>
    </div>
    
    <div v-else-if="selectedOrgId && !loading" class="empty">
      Нет отделов в выбранной организации
    </div>
    
    <div v-else class="empty">
      Выберите организацию для просмотра отделов
    </div>

    <div v-if="dialogVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать' : 'Создать' }} отдел</h2>
        
        <input
          v-model="form.name"
          placeholder="Название *"
          class="input"
        />
        
        <select v-model="form.parent_id" class="select">
          <option :value="null">-- Без родителя (корневой отдел) --</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ getLevel(dept.id) > 0 ? '-'.repeat(getLevel(dept.id)) + ' ' : '' }}{{ dept.name }}
          </option>
        </select>
        
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
import { ref, onMounted, computed } from 'vue';
import { organizationsApi } from '../api/organizations';
import { departmentsApi } from '../api/departments';

const loading = ref(false);
const organizations = ref([]);
const departments = ref([]);
const selectedOrgId = ref('');
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);

const form = ref({
  name: '',
  parent_id: null,
  comment: '',
});

const sortedDepartments = computed(() => {
  const result = [];
  const added = new Set();
  
  const addWithChildren = (dept) => {
    if (added.has(dept.id)) return;
    added.add(dept.id);
    result.push(dept);
    
    const children = departments.value.filter(d => d.parent_id === dept.id);
    children.forEach(child => addWithChildren(child));
  };
  
  const roots = departments.value.filter(d => !d.parent_id);
  roots.forEach(root => addWithChildren(root));
  
  departments.value.forEach(dept => {
    if (!added.has(dept.id)) {
      result.push(dept);
    }
  });
  
  return result;
});

const getLevel = (deptId, visited = new Set()) => {
  if (visited.has(deptId)) return 0;
  visited.add(deptId);
  const dept = departments.value.find(d => d.id === deptId);
  if (!dept || !dept.parent_id) return 0;
  return 1 + getLevel(dept.parent_id, visited);
};

const getParentName = (parentId) => {
  const parent = departments.value.find(d => d.id === parentId);
  return parent ? parent.name : '—';
};

const loadOrganizations = async () => {
  try {
    const response = await organizationsApi.getAll();
    organizations.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const loadDepartments = async () => {
  if (!selectedOrgId.value) {
    departments.value = [];
    return;
  }
  
  loading.value = true;
  try {
    const response = await departmentsApi.getByOrganization(selectedOrgId.value);
    departments.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  if (!selectedOrgId.value) return;
  isEdit.value = false;
  editingId.value = null;
  form.value = { name: '', parent_id: null, comment: '' };
  dialogVisible.value = true;
};

const openEditDialog = (dept) => {
  isEdit.value = true;
  editingId.value = dept.id;
  form.value = { 
    name: dept.name, 
    parent_id: dept.parent_id || null,
    comment: dept.comment || '' 
  };
  dialogVisible.value = true;
};

const save = async () => {
  if (!form.value.name) return;
  
  const data = {
    name: form.value.name,
    organization_id: selectedOrgId.value,
    parent_id: form.value.parent_id,
    comment: form.value.comment,
  };

  try {
    if (isEdit.value) {
      await departmentsApi.update(editingId.value, data);
    } else {
      await departmentsApi.create(data);
    }
    dialogVisible.value = false;
    await loadDepartments();
  } catch (error) {
    console.error(error);
  }
};

const confirmDelete = (dept) => {
  const hasChildren = departments.value.some(d => d.parent_id === dept.id);
  if (hasChildren) {
    alert('Нельзя удалить отдел, у которого есть подотделы');
    return;
  }
  
  if (confirm(`Удалить отдел "${dept.name}"?`)) {
    departmentsApi.delete(dept.id)
      .then(() => loadDepartments())
      .catch((error) => console.error(error));
  }
};

onMounted(() => {
  loadOrganizations();
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
  gap: 20px;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #563c5c;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.org-select {
  padding: 10px 16px;
  border: 2px solid #f2bdcd;
  border-radius: 8px;
  font-size: 14px;
  color: #563c5c;
  outline: none;
  background-color: white;
  cursor: pointer;
}

.org-select:focus {
  border-color: #563c5c;
}

.btn-add {
  background-color: #f2bdcd;
  color: #563c5c;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-add:disabled {
  background-color: #eee;
  color: #aaa;
  cursor: not-allowed;
}

.btn-add:hover:not(:disabled) {
  background-color: #e5abbb;
}

.departments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.department-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(86, 60, 92, 0.05);
  border: 1px solid #f2bdcd;
  transition: all 0.2s;
}

.department-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(86, 60, 92, 0.1);
}

.department-info {
  flex: 1;
}

.department-name {
  font-weight: 600;
  color: #563c5c;
  font-size: 16px;
}

.level-indicator {
  color: #f2bdcd;
  font-weight: normal;
}

.indent-mark {
  color: #f2bdcd;
  font-size: 14px;
}

.department-parent {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.department-parent strong {
  color: #563c5c;
}

.department-comment {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}

.department-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  border: 1px solid #eee;
  background: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
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
  padding: 60px;
  color: #563c5c;
  font-weight: 600;
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
  width: 450px;
  max-width: 90%;
}

.modal-content h2 {
  font-family: 'Montserrat', sans-serif;
  color: #563c5c;
  margin-top: 0;
  font-size: 22px;
  margin-bottom: 24px;
}

.input, .select, .textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #f2bdcd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.input:focus, .select:focus, .textarea:focus {
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
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  color: #563c5c;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-save {
  background: #563c5c;
  color: #f2bdcd;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.btn-save:hover {
  background-color: #45304a;
}
</style>