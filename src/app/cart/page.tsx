'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) { setLoading(false); return; }
    
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); });
  }, []);

  const total = items.reduce((sum, item) => sum + parseFloat(item.calculated_price) * item.quantity, 0);

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link href="/" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow flex gap-6 items-center">
                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.custom_size} | Color: {item.custom_color}</p>
                  {item.custom_text && <p className="text-sm text-gray-600 italic">&quot;{item.custom_text}&quot;</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${parseFloat(item.calculated_price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
              <span className="text-xl font-bold">Order Total:</span>
              <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}