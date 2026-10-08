import { ref } from 'vue'

/**
 * Composable untuk mengelola nilai satu input form.
 *
 * @param {string} [defaultValue='']
 * @returns {{
 *   value: import('vue').Ref<string>,
 *   onChange: (event: Event) => void,
 *   reset: () => void
 * }}
 */
export function useInput(defaultValue = '') {
  const value = ref(defaultValue)

  const onChange = (event) => {
    value.value = event.target.value
  }

  const reset = () => {
    value.value = defaultValue
  }

  return { value, onChange, reset }
}