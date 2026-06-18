const coupons = {
  WELCOME50: {code: 'WELCOME50', type: 'flat', value: 50},
  FLAT100: {code: 'FLAT100', type: 'flat', value: 100},
  SAVE20: {code: 'SAVE20', type: 'percentage', value: 20},
  FREESHIP: {code: 'FREESHIP', type: 'delivery', value: 40},
}

export const validateCoupon = code => coupons[code.toUpperCase()] || null

export const calculateDiscount = (coupon, subtotal, deliveryFee) => {
  if (!coupon) return {discount: 0, deliveryDiscount: 0}

  switch (coupon.type) {
    case 'flat':
      return {discount: coupon.value, deliveryDiscount: 0}
    case 'percentage':
      return {
        discount: Math.floor((subtotal * coupon.value) / 100),
        deliveryDiscount: 0,
      }
    case 'delivery':
      return {discount: 0, deliveryDiscount: coupon.value}
    default:
      return {discount: 0, deliveryDiscount: 0}
  }
}
