const ADDRESS_KEY = 'user_addresses'

export const getAddresses = () => {
  return (
    JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [
      {id: 1, label: 'Home', address: 'Madhapur, Hyderabad, Telangana'},
      {id: 2, label: 'Office', address: 'Hitech City, Hyderabad, Telangana'},
    ]
  )
}
