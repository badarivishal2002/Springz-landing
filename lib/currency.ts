// Currency formatting utilities for INR

export const formatINR = (amount: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

export const formatINRWithoutSymbol = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const parseINR = (value: string) => {
  // Remove currency symbols and commas, then parse
  const cleanValue = value.replace(/[₹,\s]/g, '')
  return parseFloat(cleanValue) || 0
}

export const formatCompactINR = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return formatINR(amount)
}

export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
  decimals: 2,
  freeShippingThreshold: 2000,
  codCharges: 50,
  taxRate: 0.08 // 8% GST
}