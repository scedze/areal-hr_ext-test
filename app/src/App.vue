<template>
  <div>
    <nav class="nav">
      <router-link to="/organizations" class="nav-link">Организации</router-link>
      <router-link to="/departments" class="nav-link">Отделы</router-link>   
      <router-link to="/positions" class="nav-link">Должности</router-link> 
      <router-link to="/employees" class="nav-link">Сотрудники</router-link> 
    </nav>
    <router-view />
  </div>
</template>

<script setup></script>
