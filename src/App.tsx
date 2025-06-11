import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertsProvider } from './contexts/AlertsContext';
import { QueryClient } from 'react-query';
import { Toaster } from 'sonner';

import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Account from './pages/Account';
import ManageLocations from './pages/ManageLocations';
import Search from './pages/Search';
import SitterProfile from './pages/SitterProfile';
import EditProfile from './pages/EditProfile';
import Inbox from './pages/Inbox';
import RequestDetails from './pages/RequestDetails';
import CreateSitterProfile from './pages/CreateSitterProfile';
import TestGoogleAPI from "./pages/TestGoogleAPI";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertsProvider>
          <QueryClient>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/account" element={<Account />} />
                <Route path="/manage-locations" element={<ManageLocations />} />
                <Route path="/search" element={<Search />} />
                <Route path="/sitter-profile/:id" element={<SitterProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/request-details/:id" element={<RequestDetails />} />
                <Route path="/create-sitter-profile" element={<CreateSitterProfile />} />
                <Route path="/test-google-api" element={<TestGoogleAPI />} />
              </Routes>
              <Toaster />
            </div>
          </QueryClient>
        </AlertsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
