import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content py-5">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
