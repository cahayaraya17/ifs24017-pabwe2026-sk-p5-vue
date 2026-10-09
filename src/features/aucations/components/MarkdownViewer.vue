<script setup>
defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="markdown-view">
    <pre class="content-pre">{{ content }}</pre>
  </div>
</template>

<style scoped>
.markdown-view {
  background-color: #f1f5f9;
  border-radius: 6px;
  padding: 12px;
}
.content-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  color: #334155;
}
</style>