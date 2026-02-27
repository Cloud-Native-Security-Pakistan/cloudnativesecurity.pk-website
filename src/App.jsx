import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import BrandPage from './pages/BrandPage';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen text-slate-200">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/team" element={<Placeholder title="Team" />} />
            <Route path="/events" element={<Placeholder title="Events" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
