<script setup>
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
</script>

<template>
  <div class="layout-container">
    <NavbarComponent />
    <div class="layout-body">
      <SidebarComponent />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout-body {
  display: flex;
  flex: 1;
}
.layout-content {
  flex: 1;
  padding: 24px;
  background-color: #f8fafc;
  overflow-y: auto;
}
</style>