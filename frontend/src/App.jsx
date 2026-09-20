import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import CreateTrip from './pages/CreateTrip';
import ItineraryPlanner from './pages/ItineraryPlanner';
import BudgetCalculator from './pages/BudgetCalculator';
import Weather from './pages/Weather';
import MyTrips from './pages/MyTrips';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#242424', color: '#f0ebe0', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' },
            success: { iconTheme: { primary: '#7a8c5e', secondary: '#f0ebe0' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/trips/:tripId/itinerary" element={<ProtectedRoute><ItineraryPlanner /></ProtectedRoute>} />
          <Route path="/trips/:tripId/budget" element={<ProtectedRoute><BudgetCalculator /></ProtectedRoute>} />
          <Route path="/trips/:tripId/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
          <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
