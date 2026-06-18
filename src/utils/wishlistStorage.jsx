const WISHLIST_KEY = 'user_wishlist'

export const getWishlist = () => {
  const wishlist = localStorage.getItem(WISHLIST_KEY)
  return wishlist ? JSON.parse(wishlist) : []
}

export const addToWishlist = item => {
  const wishlist = getWishlist()
  // Prevent adding duplicates
  if (!wishlist.find(i => i.id === item.id)) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist, item]))
  }
}

export const removeFromWishlist = itemId => {
  const wishlist = getWishlist()
  const updated = wishlist.filter(i => i.id !== itemId)
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated))
}
