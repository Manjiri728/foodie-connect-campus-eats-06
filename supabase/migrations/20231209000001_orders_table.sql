
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  time_slot JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date TEXT NOT NULL,
  upi_details JSONB,
  payment_status TEXT DEFAULT 'pending'
);

-- Add RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own orders
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own orders
CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for staff to view all orders
CREATE POLICY "Staff can view all orders" 
  ON orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'staff'
    )
  );
