export function toNum(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

export function fmtNum(num) {
  if (!num) return '0'
  return Number(num).toLocaleString('en-IN')
}

export function fmt(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '₹0'
  return `₹${fmtNum(Math.round(num))}`
}

export function calc80CTotal(data) {
  if (!data.has80CItems || data.has80CItems.length === 0) return 0
  let total = 0
  data.has80CItems.forEach(key => {
    total += toNum(data.investments80C[key])
  })
  return total
}
