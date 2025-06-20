
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AlertsProvider } from "@/contexts/AlertsContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUpFlow from "./pages/SignUpFlow";
import ExistingUserLoginPage from "./pages/ExistingUserLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SearchSelection from "./pages/SearchSelection";
import FindParents from "./pages/FindParents";
import ConnectionsPage from "./pages/ConnectionsPage";
import Profile from "./pages/Profile";
import SitterProfile from "./pages/SitterProfile";
import ProductSearchPage from "./pages/ProductSearchPage";
import ProductPage from "./pages/ProductPage";
import Settings from "./pages/Settings";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Language from "./pages/Language";
import PrivacySettings from "./pages/PrivacySettings";
import Security from "./pages/Security";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AddReview from "./pages/AddReview";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import ManageLocations from "./pages/ManageLocations";
import OnboardingPage from "./pages/OnboardingPage";
import NewlyRecommendedSittersPage from "./pages/NewlyRecommendedSittersPage";
import NewlyRecommendedProductsPage from "./pages/NewlyRecommendedProductsPage";
import EditProfile from "./pages/EditProfile";
import AlertsPage from "./pages/AlertsPage";
import EntitySearchPage from "./pages/EntitySearchPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEditUser from "./pages/AdminEditUser";
import AdminSitters from "./pages/AdminSitters";
import AdminProducts from "./pages/AdminProducts";
import AdminEditSitter from "./pages/AdminEditSitter";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminContentModeration from "./pages/AdminContentModeration";
import AdminImport from "./pages/AdminImport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AlertsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/signup" element={<SignUpFlow />} />
            <Route path="/login" element={<ExistingUserLoginPage />} />
            <Route path="/login-existing" element={<ExistingUserLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchSelection /></ProtectedRoute>} />
            <Route path="/find-sitter" element={<ProtectedRoute><EntitySearchPage type="sitter" mode="discovery" /></ProtectedRoute>} />
            <Route path="/find-parents" element={<ProtectedRoute><FindParents /></ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/sitter/:id" element={<ProtectedRoute><SitterProfile /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><EntitySearchPage type="product" mode="discovery" /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
            <Route path="/search-for-review/sitter" element={<ProtectedRoute><EntitySearchPage type="sitter" mode="review" /></ProtectedRoute>} />
            <Route path="/search-for-review/product" element={<ProtectedRoute><EntitySearchPage type="product" mode="review" /></ProtectedRoute>} />
            <Route path="/add-review" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
            <Route path="/activity-feed" element={<ProtectedRoute><ActivityFeedPage /></ProtectedRoute>} />
            <Route path="/newly-recommended-sitters" element={<ProtectedRoute><NewlyRecommendedSittersPage /></ProtectedRoute>} />
            <Route path="/newly-recommended-products" element={<ProtectedRoute><NewlyRecommendedProductsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/my-homes" element={<ProtectedRoute><ManageLocations /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
            <Route path="/privacy-settings" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path="/admin/users" element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            } />
            <Route path="/admin/users/:userId/edit" element={
              <AdminLayout>
                <AdminEditUser />
              </AdminLayout>
            } />
            <Route path="/admin/sitters" element={
              <AdminLayout>
                <AdminSitters />
              </AdminLayout>
            } />
            <Route path="/admin/sitters/:sitterId" element={
              <AdminLayout>
                <AdminEditSitter />
              </AdminLayout>
            } />
            <Route path="/admin/products" element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            } />
            <Route path="/admin/products/:productId" element={
              <AdminLayout>
                <AdminEditProduct />
              </AdminLayout>
            } />
            <Route path="/admin/content-moderation" element={
              <AdminLayout>
                <AdminContentModeration />
              </AdminLayout>
            } />
            <Route path="/admin/import" element={
              <AdminLayout>
                <AdminImport />
              </AdminLayout>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AdminToolbar />
        </BrowserRouter>
      </TooltipProvider>
    </AlertsProvider>
  </QueryClientProvider>
);

export default App;
