import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET cart items for a session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

  try {
    const cartResult = await pool.query('SELECT id FROM carts WHERE session_id = $1', [sessionId]);
    if (cartResult.rows.length === 0) return NextResponse.json([]);

    const cartId = cartResult.rows[0].id;
    const itemsResult = await pool.query(`
      SELECT ci.*, p.name, p.image_url 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
      ORDER BY ci.id DESC
    `, [cartId]);

    return NextResponse.json(itemsResult.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST add item to cart
export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, productId, quantity, customText, customColor, customSize, calculatedPrice } = body;

  if (!sessionId || !productId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // 1. Get or create cart
    let cartId;
    const cartResult = await pool.query('SELECT id FROM carts WHERE session_id = $1', [sessionId]);
    
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query('INSERT INTO carts (session_id) VALUES ($1) RETURNING id', [sessionId]);
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // 2. Insert cart item
    const insertResult = await pool.query(`
      INSERT INTO cart_items 
      (cart_id, product_id, quantity, custom_text, custom_color, custom_size, calculated_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [cartId, productId, quantity || 1, customText, customColor, customSize, calculatedPrice]);

    return NextResponse.json(insertResult.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}