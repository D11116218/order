/**
 * Calculates the total price for a single order item including customization extras.
 * @param {Object} item - The order item object.
 * @returns {number} The total price for this item.
 */
export const getItemTotalPrice = (item) => {
  if (!item) return 0;
  
  const basePrice = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  let extra = 0;
  
  // Customization rules
  // Check both selectedOptions (object) and remark (string) as fallback
  const isAddEgg = 
    (item.selectedOptions && item.selectedOptions.egg === '糖心蛋(半顆)+10') ||
    (item.remark && item.remark.includes('糖心蛋(半顆)+10'));

  if (isAddEgg) {
    extra += 10;
  }
  
  return (basePrice + extra) * quantity;
};

/**
 * Calculates the total amount for all items in the order.
 * @param {Array} orderItems - Array of order item objects.
 * @returns {number} The total order amount.
 */
export const getOrderTotal = (orderItems) => {
  if (!Array.isArray(orderItems)) return 0;
  return orderItems.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
};
