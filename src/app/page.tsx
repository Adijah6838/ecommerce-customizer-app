import Link from 'next/link';
import { pool } from '@/lib/db';

async function getProducts() {
  const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  return result.rows;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CustomPrint Studio</h1>
          <Link href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            View Cart
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-500 mt-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${parseFloat(product.base_price).toFixed(2)}</span>
                  <Link href={`/product/${product.id}`} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                    Customize
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}