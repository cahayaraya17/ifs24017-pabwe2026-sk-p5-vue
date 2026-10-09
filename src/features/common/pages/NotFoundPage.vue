<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Halaman yang Anda cari tidak ditemukan.</p>
    <router-link to="/" class="btn-home">Kembali ke Beranda</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}
h1 {
  font-size: 5rem;
  margin: 0;
  color: #ef4444;
}
p {
  font-size: 1.2rem;
  color: #64748b;
  margin: 12px 0 24px;
}
.btn-home {
  padding: 8px 16px;
  background-color: #0284c7;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}
</style>