<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  loading: Boolean,
  currentHighestBid: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close', 'submit'])
const bidAmount = ref('')
const errorMessage = ref('')

function handleSubmit() {
  const amount = Number(bidAmount.value)
  if (amount <= props.currentHighestBid) {
    errorMessage.value = `Tawaran harus lebih tinggi dari penawaran saat ini (Rp ${props.currentHighestBid.toLocaleString()})`
    return
  }
  errorMessage.value = ''
  emit('submit', { bid: amount })
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-card">
      <h3>Ajukan Tawaran (Bid)</h3>
      <p class="hint">Penawaran saat ini: Rp {{ currentHighestBid.toLocaleString() }}</p>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="bidAmount"
          type="number"
          :min="currentHighestBid + 1"
          placeholder="Masukkan jumlah tawaran"
          required
        />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="actions">
          <button type="button" @click="$emit('close')">Batal</button>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Mengirim...' : 'Kirim Tawaran' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
}
.hint {
  color: #64748b;
  font-size: 0.9rem;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  margin-top: 8px;
}
.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>