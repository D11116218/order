export const restaurantMenus = {
  'chi-teng': {
    name: '熾騰',
    categories: [
      { id: 'main',  label: '主餐系列' },
      { id: 'addon', label: '特色加點' },
      { id: 'sides', label: '精選單點' }
    ],
    items: {
      main: [
        { id: 'm1', name: '極牛燒肉丼飯',        price: 130, altLabel: '大(加肉)', altPrice: 150, enName: 'PREMIUM BEEF BBQ BOWL' },
        { id: 'm2', name: '火山唐揚丼飯',         price: 130, altLabel: '大(加肉)', altPrice: 150, enName: 'VOLCANO KARAAGE BOWL' },
        { id: 'm3', name: '野豚醬燒丼飯',         price: 130, altLabel: '大(加肉)', altPrice: 150, enName: 'PORK YAKINIKU BOWL' },
        { id: 'm4', name: '極牛x唐揚雞雙拼',      price: 150, enName: 'BEEF & KARAAGE COMBO' },
        { id: 'm5', name: '野豚x唐揚雞雙拼',      price: 150, enName: 'PORK & KARAAGE COMBO' },
        { id: 'm6', name: '極牛x野豚雙拼',         price: 150, enName: 'BEEF & PORK COMBO' },
        { id: 'm7', name: '極牛x酥炸魚排雙拼',    price: 170, enName: 'BEEF & FISH COMBO' },
        { id: 'm8', name: '野豚x酥炸魚排雙拼',    price: 170, enName: 'PORK & FISH COMBO' },
        { id: 'm9', name: '唐揚雞x酥炸魚排雙拼',  price: 170, enName: 'KARAAGE & FISH COMBO' }
      ],
      addon: [
        { id: 'a1', name: '加點糖心蛋（半顆）', price: 10 }
      ],
      sides: [
        { id: 's1', name: '極牛燒肉',       price: 100 },
        { id: 's2', name: '野豚醬燒',       price: 100 },
        { id: 's3', name: '火山唐揚雞',     price: 100 },
        { id: 's4', name: '糖心蛋（半顆）', price: 15  }
      ]
    }
  }
};

// Legacy export for backward compat
export const menuData = restaurantMenus['chi-teng'].items;
