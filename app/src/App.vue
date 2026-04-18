<template>
  <div>
    <nav class="nav">
      <router-link to="/organizations" class="nav-link">Организации</router-link>
      <router-link to="/departments" class="nav-link">Отделы</router-link>    
    </nav>
    <router-view />
  </div>
</template>

<script setup></script>
