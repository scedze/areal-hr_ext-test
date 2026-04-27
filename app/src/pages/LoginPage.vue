<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Вход в систему</h1>
      <input v-model="login" placeholder="Логин" class="input" />
      <input v-model="password" type="password" placeholder="Пароль" class="input" />
      <button @click="handleLogin" class="btn-login">Войти</button>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';

const router = useRouter();
const login = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    await authApi.login(login.value, password.value);
    router.push('/organizations');
  } catch (err) {
    error.value = 'Неверный логин или пароль';
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fcfaff;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 350px;
}
h1 {
  margin-bottom: 24px;
  color: #563c5c;
}
.input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px solid #f2bdcd;
  border-radius: 8px;
  box-sizing: border-box;
}
.btn-login {
  width: 100%;
  background: #563c5c;
  color: #f2bdcd;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}
.error {
  color: red;
  margin-top: 12px;
  text-align: center;
}
</style>