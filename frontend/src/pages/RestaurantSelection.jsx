import React from 'react';
import { useNavigate } from 'react-router-dom';

const restaurants = [
  {
    id: 'chicken-honke',
    name: '雞肉本家',
    description: '炭火熟成 ‧ 職人手作串燒',
    tag: 'Signature',
    tagColor: 'primary',
    rating: '4.9',
    ratingIcon: 'star',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5YqJtYXOP0srzORRn5di47g7sI4nTHTfuMXuzYqLOnGRkysp62QnIJQbMygM5vXAvLJ0dUvHoNDWIPh_vHgryDUIWSLqTTZozX3IAA-1ibEXgMY5OEcBI9_wCoLFs-JBUy56HOGpvbYmRdKvixJ4HZl5wo7JQAN4E1fC7NbbYS5-ly-g1kV_Pa-CBD_FHz2z5RcipIP0nvtaQbBf4Roqak0UKJ_LkJqWI6hHEP9LCSrDq-_a58p7bTeUt4t6H3Q2wt8vSyttyjlgb',
    neonStyle: { boxShadow: '0 0 10px rgba(129,236,255,0.2), inset 0 0 5px rgba(129,236,255,0.1)', border: '1px solid rgba(129,236,255,0.3)' }
  },
  {
    id: 'chi-teng',
    name: '熾騰',
    description: '極品和牛 ‧ 火焰料理藝術',
    tag: 'Premium',
    tagColor: 'secondary',
    rating: 'Hot',
    ratingIcon: 'local_fire_department',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7PE8cD-4gN3hkeCXzDuwarS9JFtvQEZOA0Iq5NWdckzt-hvaJVmjMSjWv2x_VdpVvMpQ46ME2jaJKNZKB3cPr4z5FFlqF7yRnjWVJ5a3ZFAk24UprjlFGPkRob3cBmqqzj9qy-kWZ22AI7TIG13K3gn4XZ2Pe1p4jbAqGhwW9Etmz_x-2vVn5RvZgiATiZeT__m12hxDY5U5em58ca8trBPQ66kvtjB5llmGYgsqnVbC_nsm3P9pe7nUWn_Qs9vSl8VB79GZCpjUy',
    neonStyle: { boxShadow: '0 0 10px rgba(233,102,255,0.2), inset 0 0 5px rgba(233,102,255,0.1)', border: '1px solid rgba(233,102,255,0.3)' }
  },
  {
    id: 'chuan-feng',
    name: '川豐',
    description: '新派川味 ‧ 椒麻層次探索',
    tag: 'Modern',
    tagColor: 'tertiary',
    rating: 'New',
    ratingIcon: 'restaurant',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ida5u2CV9KdI4riCUXuYwM7pm2ctL8KvwDbdp0Or2t1TiMICpQ9iOhgBv_42kHedkl3IuhPQ3pogJOavr3qdFgvUa5g7OV60QTT1pvOJvvyOwDotYYQnfTOWbsU_CjUsJAzlSq4Vy5XX6b5iWo4qsVVY2t5lyg0uMhhj2KtojLxUGxhqcKVSYiIaclK0p50yCitzLGNEt47djLQESqkxDFQWemIqqPZ7b-Pk2FK6sWjB6dlRzGnLte1ehDzAYjzj3KoDjZG7IoQs',
    neonStyle: { border: '1px solid rgba(68,72,79,0.3)' }
  }
];

const tagColorMap = {
  primary:   { bg: 'rgba(129,236,255,0.1)', border: 'rgba(129,236,255,0.2)', text: '#81ecff' },
  secondary: { bg: 'rgba(233,102,255,0.1)', border: 'rgba(233,102,255,0.2)', text: '#e966ff' },
  tertiary:  { bg: 'rgba(166,140,255,0.1)', border: 'rgba(166,140,255,0.2)', text: '#a68cff' }
};

const RestaurantSelection = ({ setSelectedRestaurant, onClearOrder }) => {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    // Clear cart when switching restaurants
    if (onClearOrder) onClearOrder();
    setSelectedRestaurant(id);
    navigate('/menu');
  };

  return (
    <div className="bg-[#f7f9fa] min-h-screen font-body">
      <header className="header">
        <h1 className="font-headline font-bold text-gray-900">精選餐廳</h1>
      </header>

      <main className="px-6 py-10 pb-32 max-w-5xl mx-auto">
        <section className="mb-10 text-center">
          <h2 className="font-headline text-3xl font-bold text-gray-900 mb-2 tracking-tight">精選餐廳</h2>
          <p className="text-gray-500 font-body">選擇您的美味食堂</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => {
            return (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <img alt={r.name} className="w-full h-56 object-cover" src={r.image} />
                <div className="p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2">
                        {r.tag}
                      </span>
                      <h3 className="font-headline text-2xl font-bold text-gray-900 mb-1">{r.name}</h3>
                      <p className="text-gray-500 text-sm">{r.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <span className="material-symbols-outlined text-sm">{r.ratingIcon}</span>
                      <span className="text-xs font-bold">{r.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <nav className="app-bottom-nav">
        <button onClick={() => navigate('/')} className="flex flex-1 flex-col items-center justify-center text-red-500 active:scale-90 duration-300">
          <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>home</span>
          <span className="font-body font-semibold text-[10px] mt-1">首頁</span>
        </button>
        <button onClick={() => navigate(-1)} className="flex flex-1 flex-col items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90 duration-300">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-body font-semibold text-[10px] mt-1">返回</span>
        </button>
      </nav>
    </div>
  );
};

export default RestaurantSelection;
