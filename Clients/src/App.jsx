import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import RoleSelect from './pages/RoleSelect';
import RestaurantPage from './pages/RestaurantPage';
import NgoPage from './pages/NgoPage';
import RestaurantForgotPassword from './pages/RestaurantForgotPassword';
import NgoForgotPassword from './pages/NgoForgotPassword';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantPostFood from './pages/RestaurantPostFood';
import NgoDashboard from './pages/NgoDashboard';
import NgoBrowseListings from './pages/NgoBrowseListings';
import RestaurantNotifications from './pages/RestaurantNotifications';
import NgoNotifications from './pages/NgoNotifications';
import NgoMyPickups from './pages/NgoMyPickups';
import RestaurantRatings from './pages/RestaurantRatings';
import NgoRatings from './pages/NgoRatings';
import NgoProfile from './pages/NgoProfile';

import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  // Exclude footer ONLY from dashboard pages as requested
  const isDashboardPage =
    location.pathname.startsWith('/restaurant/') ||
    location.pathname.startsWith('/ngo/') ||
    location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/start" element={<RoleSelect />} />
          <Route path="/start/:mode" element={<RoleSelect />} />
          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/ngo" element={<NgoPage />} />
          <Route path="/restaurant/forgot-password" element={<RestaurantForgotPassword />} />
          <Route path="/ngo/forgot-password" element={<NgoForgotPassword />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/post" element={<RestaurantPostFood />} />
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/ngo/browse" element={<NgoBrowseListings />} />
          <Route path="/restaurant/notifications" element={<RestaurantNotifications />} />
          <Route path="/ngo/notifications" element={<NgoNotifications />} />
          <Route path="/ngo/pickups" element={<NgoMyPickups />} />
          <Route path="/restaurant/ratings" element={<RestaurantRatings />} />
          <Route path="/ngo/ratings" element={<NgoRatings />} />
          <Route path="/ngo/profile" element={<NgoProfile />} />
        </Routes>
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

export default App;