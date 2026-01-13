import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Categories from './pages/Categories';
import Invoices from './pages/Invoices';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If roles are specified and user role doesn't match
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <CategoryProvider>
              <InvoiceProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  {/* Main Layout Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    {/* Billing (Common Dashboard) */}
                    <Route index element={<Billing />} />
                    <Route path="invoices" element={<Invoices />} />

                    {/* Manager Only Routes */}
                    <Route path="sales" element={
                      <ProtectedRoute allowedRoles={['manager']}>
                        <Sales />
                      </ProtectedRoute>
                    } />
                    <Route path="inventory" element={
                      <ProtectedRoute allowedRoles={['manager']}>
                        <Inventory />
                      </ProtectedRoute>
                    } />
                    <Route path="categories" element={
                      <ProtectedRoute allowedRoles={['manager']}>
                        <Categories />
                      </ProtectedRoute>
                    } />
                  </Route>

                </Routes>
              </InvoiceProvider>
            </CategoryProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
