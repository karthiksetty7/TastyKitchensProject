const ORDER_HISTORY_KEY = 'order_history'

/*
 * Retrieves the full order history from local storage.
 * Returns an empty array if no history exists.
 */
export const getOrderHistory = () => {
  const orders = localStorage.getItem(ORDER_HISTORY_KEY)
  try {
    return orders ? JSON.parse(orders) : []
  } catch (error) {
    console.error('Error parsing order history:', error)
    return []
  }
}

/*
 * Saves a new order to the history.
 * Ensures the newest order is at the top of the array.
 */
export const saveOrder = newOrder => {
  const orders = getOrderHistory()

  const sanitizedOrder = {
    ...newOrder,
    subtotal: newOrder.subtotal || 0,
    discount: newOrder.discount || 0,
    deliveryDiscount: newOrder.deliveryDiscount || 0,
    finalAmount: newOrder.finalAmount || 0,
    couponCode: newOrder.couponCode || null,
    savedAt: new Date().toISOString(),
  }

  orders.unshift(sanitizedOrder)
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders))
}
