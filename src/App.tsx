
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ExistingUserLoginPage from "./pages/ExistingUserLoginPage";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SearchMock from "./pages/SearchMock";
import SearchSelection from "./pages/SearchSelection";
import FindParents from "./pages/FindParents";
import Profile from "./pages/Profile";
import SitterProfile from "./pages/SitterProfile";
import ProductSearchPage from "./pages/ProductSearchPage";
import Settings from "./pages/Settings";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Language from "./pages/Language";
import Privacy from "./pages/Privacy";
import PrivacySettings from "./pages/PrivacySettings";
import Security from "./pages/Security";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AddReview from "./pages/AddReview";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import ManageLocations from "./pages/ManageLocations";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-existing" element={<ExistingUserLoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchSelection />} />
          <Route path="/search-mock" element={<SearchMock />} />
          <Route path="/find-sitter" element={<Search />} />
          <Route path="/find-parents" element={<FindParents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/sitter/:id" element={<SitterProfile />} />
          <Route path="/shop" element={<ProductSearchPage />} />
          <Route path="/add-review" element={<AddReview />} />
          <Route path="/activity-feed" element={<ActivityFeedPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/my-homes" element={<ManageLocations />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/language" element={<Language />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-settings" element={<PrivacySettings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
