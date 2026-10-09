<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="editor-wrapper">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue',$event.target.value)"
      rows="6"
      placeholder="Tulis deskripsi lelang (format Markdown didukung)..."
      class="editor-textarea"
    ></textarea>
  </div>
</template>

<style scoped>
.editor-wrapper {
  width: 100%;
}
.editor-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
}
</style>