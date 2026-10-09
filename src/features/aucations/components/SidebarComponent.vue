<template>
  <aside class="sidebar">
    <nav class="sidebar-menu">
      <router-link to="/" class="sidebar-link">
        Dashboard Lelang
      </router-link>
      <router-link to="/?filter=me" class="sidebar-link">
        Lelang Saya
      </router-link>
      <router-link to="/users" class="sidebar-link">
        Daftar Pengguna
      </router-link>
      <router-link to="/profile" class="sidebar-link">
        Profil Saya
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #0f172a;
  min-height: calc(100vh - 60px);
  padding: 20px 12px;
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar-link {
  color: #94a3b8;
  padding: 10px 14px;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.sidebar-link:hover,
.sidebar-link.router-link-exact-active {
  background-color: #1e293b;
  color: #38bdf8;
}
</style>