
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ExistingUserLoginPage from "./pages/ExistingUserLoginPage";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import SitterProfile from "./pages/SitterProfile";
import Essentials from "./pages/Essentials";
import Settings from "./pages/Settings";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Language from "./pages/Language";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AddReview from "./pages/AddReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-existing" element={<ExistingUserLoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/find-sitter" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/sitter/:id" element={<SitterProfile />} />
          <Route path="/shop" element={<Essentials />} />
          <Route path="/add-review" element={<AddReview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/language" element={<Language />} />
          <Route path="/privacy" element={<Privacy />} />
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
