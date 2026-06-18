// src/utils/rewardService.js

// Mock function to get points (replace with your logic, e.g., from localStorage)
export const getRewardPoints = () => {
  return parseInt(localStorage.getItem('rewardPoints') || '0', 10)
}

// Function to add points (e.g., 1 point per 10 rupees)
export const addRewardPoints = grandTotal => {
  const pointsEarned = Math.floor(grandTotal / 10)
  const currentPoints = getRewardPoints()
  localStorage.setItem(
    'rewardPoints',
    (currentPoints + pointsEarned).toString(),
  )
  return pointsEarned
}

// Function to redeem points
export const redeemRewardPoints = pointsToRedeem => {
  const currentPoints = getRewardPoints()
  if (currentPoints >= pointsToRedeem) {
    localStorage.setItem(
      'rewardPoints',
      (currentPoints - pointsToRedeem).toString(),
    )
    return true
  }
  return false
}
