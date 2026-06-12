import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout.jsx';
import { PrivateRoute } from './PrivateRoute.jsx';
import { AdminRoute } from './AdminRoute.jsx';

import { HomePage } from '@/pages/HomePage.jsx';
import { NotFound } from '@/pages/NotFound.jsx';
import { ComingSoon } from '@/pages/ComingSoon.jsx';

import { LoginPage } from '@/pages/auth/LoginPage.jsx';
import { RegisterPage } from '@/pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage.jsx';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage.jsx';

/**
 * Top-level route table. Auth pages render standalone (full-bleed shell);
 * everything else renders inside MainLayout (navbar/footer/cart drawer).
 *
 * Surfaces marked ComingSoon are scheduled for the next milestone — the
 * homepage, auth, and product/category APIs are fully live now.
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Standalone auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Main app shell */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/shop" element={<ComingSoon title="Shop" note="The full product listing with filters, sorting, and search arrives in the next milestone. Featured/Trending/New on the homepage are live now." />} />
        <Route path="/product/:slug" element={<ComingSoon title="Product detail" note="The product detail page (gallery, reviews, related items) is scheduled next." />} />
        <Route path="/cart" element={<ComingSoon title="Cart page" note="Use the cart drawer (bag icon) — it's fully functional. The full cart page is next." />} />
        <Route path="/wishlist" element={<ComingSoon title="Wishlist" note="Wishlist toggles work on product cards. The wishlist page is next." />} />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <ComingSoon title="Checkout" note="The multi-step checkout is scheduled for the next milestone." />
            </PrivateRoute>
          }
        />
        <Route
          path="/account/*"
          element={
            <PrivateRoute>
              <ComingSoon title="Account dashboard" note="Profile, orders, addresses, and security are scheduled next." />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <ComingSoon title="Admin dashboard" note="The admin surface (products, orders, users, reviews) is scheduled for the next milestone. Role-gating is already enforced here and server-side." />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
