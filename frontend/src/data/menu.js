export const restaurantMenus = {
  'chi-teng': {
    name: '熾騰',
    categories: [
      { id: 'hot',    label: '熱門' },
      { id: 'double', label: '雙拼' },
      { id: 'sides',  label: '單點' }
    ],
    items: {
      hot: [
        { id: 'b1', name: '極牛燒肉丼飯', price: 130, altLabel: '加肉', altPrice: 150 },
        { id: 'b2', name: '火山唐揚丼飯', price: 130, altLabel: '加肉', altPrice: 150 },
        { id: 'b3', name: '野豚醬燒丼飯', price: 130, altLabel: '加肉', altPrice: 150 }
      ],
      double: [
        { id: 'b4', name: '極牛x唐揚雞雙拼', price: 150 },
        { id: 'b5', name: '野豚x唐揚雞雙拼', price: 150 },
        { id: 'b6', name: '極牛x野豚雙拼', price: 150 },
        { id: 'b7', name: '極牛x酥炸魚排雙拼', price: 170 },
        { id: 'b8', name: '野豚x酥炸魚排雙拼', price: 170 },
        { id: 'b9', name: '唐揚雞x酥炸魚排雙拼', price: 170 }
      ],
      sides: [
        { id: 's1', name: '極牛燒肉', price: 100 },
        { id: 's2', name: '野豚醬燒', price: 100 },
        { id: 's3', name: '火山唐揚雞', price: 100 },
        { id: 's4', name: '糖心蛋(半顆)', price: 15 }
      ]
    }
  }
};

// Legacy export for backward compat
export const menuData = restaurantMenus['chi-teng'].items;
