export const DELIVERY_FEE = 40
export const FREE_DELIVERY_THRESHOLD = 1000
export const GST_PERCENTAGE = 5

export const calculateGST = amount => {
  return Math.round((amount * GST_PERCENTAGE) / 100)
}

export const getDeliveryFee = subtotal => {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export const calculateFinalAmount = ({
  subtotal,
  deliveryFee,
  gst,
  discount,
}) => {
  // Using Math.max to ensure the total doesn't go below 0
  return Math.max(
    0,
    Number((subtotal + deliveryFee + gst - discount).toFixed(2)),
  )
}
