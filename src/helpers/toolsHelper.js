import Swal from 'sweetalert2'

/**
 * Menampilkan dialog sukses.
 * @param {string} message
 * @param {string} [title='Berhasil']
 */
export function showSuccessDialog(message, title = 'Berhasil') {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'OK',
  })
}

/**
 * Menampilkan dialog error.
 * @param {string} message
 * @param {string} [title='Gagal']
 */
export function showErrorDialog(message, title = 'Gagal') {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  })
}

/**
 * Menampilkan dialog konfirmasi (Ya / Batal).
 * @param {string} message
 * @param {string} [title='Apakah Anda yakin?']
 * @returns {Promise<boolean>} true jika pengguna menekan "Ya"
 */
export async function showConfirmDialog(message, title = 'Apakah Anda yakin?') {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  })

  return result.isConfirmed
}

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/**
 * Memformat angka menjadi mata uang rupiah.
 * @param {number|string} value
 * @returns {string} contoh: 'Rp 1.500.000'
 */
export function formatRupiah(value) {
  return rupiahFormatter.format(Number(value) || 0)
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * Memformat tanggal (string ISO, timestamp, atau Date) ke format Indonesia.
 * @param {string|number|Date} value
 * @returns {string} contoh: '8 Oktober 2026 14.30', atau '-' jika tidak valid
 */
export function formatDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return dateFormatter.format(date)
}