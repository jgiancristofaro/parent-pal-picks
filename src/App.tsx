
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { AlertsContextProvider } from '@/contexts/AlertsContext';
import Index from './pages/Index';
import Login from './pages/Login';
import ExistingUserLoginPage from './pages/ExistingUserLoginPage';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ActivityFeedPage from './pages/ActivityFeedPage';
import NewlyRecommendedSittersPage from './pages/NewlyRecommendedSittersPage';
import NewlyRecommendedProductsPage from './pages/NewlyRecommendedProductsPage';
import Settings from './pages/Settings';
import ManageLocations from './pages/ManageLocations';
import PrivacySettings from './pages/PrivacySettings';
import Security from './pages/Security';
import PaymentMethods from './pages/PaymentMethods';
import Language from './pages/Language';
import Help from './pages/Help';
import About from './pages/About';
import Notifications from './pages/Notifications';
import Alerts from './pages/Alerts';
import AlertsPage from './pages/AlertsPage';
import FindParents from './pages/FindParents';
import SitterProfile from './pages/SitterProfile';
import ProductPage from './pages/ProductPage';
import ProductSearchPage from './pages/ProductSearchPage';
import SearchSelection from './pages/SearchSelection';
import AddReview from './pages/AddReview';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserEdit from './pages/AdminUserEdit';
import AdminSitters from './pages/AdminSitters';
import AdminSitterEdit from './pages/AdminSitterEdit';
import AdminProducts from './pages/AdminProducts';
import AdminProductEdit from './pages/AdminProductEdit';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthContextProvider>
      <AlertsContextProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/existing-user-login" element={<ExistingUserLoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/search-selection" element={<ProtectedRoute><SearchSelection /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductSearchPage /></ProtectedRoute>} />
              <Route path="/find-parents" element={<ProtectedRoute><FindParents /></ProtectedRoute>} />
              <Route path="/profile/:id?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/activity" element={<ProtectedRoute><ActivityFeedPage /></ProtectedRoute>} />
              <Route path="/newly-recommended-sitters" element={<ProtectedRoute><NewlyRecommendedSittersPage /></ProtectedRoute>} />
              <Route path="/newly-recommended-products" element={<ProtectedRoute><NewlyRecommendedProductsPage /></ProtectedRoute>} />
              <Route path="/sitter/:id" element={<ProtectedRoute><SitterProfile /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
              <Route path="/add-review" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/locations" element={<ProtectedRoute><ManageLocations /></ProtectedRoute>} />
              <Route path="/settings/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
              <Route path="/settings/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
              <Route path="/settings/language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/alerts-page" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute><AdminUserEdit /></ProtectedRoute>} />
              <Route path="/admin/sitters" element={<ProtectedRoute><AdminSitters /></ProtectedRoute>} />
              <Route path="/admin/sitters/:id" element={<ProtectedRoute><AdminSitterEdit /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/products/:id" element={<ProtectedRoute><AdminProductEdit /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AlertsContextProvider>
    </AuthContextProvider>
  );
}

export default App;
