
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertsProvider } from './contexts/AlertsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Search from './pages/Search';
import TestGoogleAPI from "./pages/TestGoogleAPI";
import EntitySearchPage from './pages/EntitySearchPage';
import ProductSearchPage from './pages/ProductSearchPage';
import AddReview from './pages/AddReview';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Help from './pages/Help';
import ExistingUserLoginPage from './pages/ExistingUserLoginPage';
import Alerts from './pages/Alerts';
import Language from './pages/Language';
import FindParents from './pages/FindParents';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import PaymentMethods from './pages/PaymentMethods';
import SearchSelection from './pages/SearchSelection';
import Home from './pages/Home';
import Settings from './pages/Settings';
import ProductPage from './pages/ProductPage';
import Security from './pages/Security';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertsProvider>
          <QueryClientProvider client={queryClient}>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/existing-user-login" element={<ExistingUserLoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search-selection" element={<SearchSelection />} />
                <Route path="/find-parents" element={<FindParents />} />
                <Route path="/product-search" element={<ProductSearchPage />} />
                <Route path="/entity-search" element={<EntitySearchPage type="sitter" mode="discovery" />} />
                <Route path="/add-review" element={<AddReview />} />
                <Route path="/help" element={<Help />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/language" element={<Language />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/security" element={<Security />} />
                <Route path="/test-google-api" element={<TestGoogleAPI />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </QueryClientProvider>
        </AlertsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
