export const restaurantMenus = {
  'chi-teng': {
    name: '熾騰',
    categories: [
      { id: 'main',  label: '主食飯類' },
      { id: 'sides', label: '單點' },
      { id: 'soup',  label: '熱湯' },
      { id: 'drink', label: '果漾果醋' }
    ],
    items: {
      main: [
        { id: 'm1', name: '獅子頭雞肉飯', price: 165, altLabel: '無配菜', altPrice: 145, enName: 'CHICKEN AND MEATBALL COMBO' },
        { id: 'm2', name: '雙倍雞肉飯',   price: 200, altLabel: '無配菜', altPrice: 180, enName: 'DOUBLE CHICKEN RICE' },
        { id: 'm3', name: '好吃雞肉飯',   price: 125, altLabel: '無配菜', altPrice: 105, enName: 'BONELESS DELICIOUS CHICKEN RICE' },
        { id: 'm4', name: '獅子頭飯',     price: 125, altLabel: '無配菜', altPrice: 105, enName: 'PORK MEATBALL RICE' },
        { id: 'm5', name: '咖哩雞肉飯',   price: 145, altLabel: '無配菜', altPrice: 125, enName: 'CURRY CHICKEN RICE' },
        { id: 'm6', name: '咖哩獅子頭飯', price: 145, altLabel: '無配菜', altPrice: 125, enName: 'CURRY MEATBALL RICE' },
        { id: 'm7', name: '咖哩醬飯',     price: 85,  altLabel: '無配菜', altPrice: 65,  enName: 'NO MEAT CURRY RICE' }
      ],
      sides: [
        { id: 's1', name: '好吃雞肉 (份)', price: 90 },
        { id: 's2', name: '獅子頭 (顆)',   price: 43 },
        { id: 's3', name: '炒時蔬',         price: 40 },
        { id: 's4', name: '水煮蛋',         price: 20 },
        { id: 's5', name: '白飯',            price: 15 }
      ],
      soup: [
        { id: 'p1', name: '貢丸湯', price: 35 },
        { id: 'p2', name: '魚丸湯', price: 35 },
        { id: 'p3', name: '綜合丸湯', price: 35 }
      ],
      drink: [
        { id: 'd1', name: '蘋果口味', price: 49 },
        { id: 'd2', name: '葡萄口味', price: 49 }
      ]
    }
  }
};

// Legacy export for backward compat
export const menuData = restaurantMenus['chi-teng'].items;
