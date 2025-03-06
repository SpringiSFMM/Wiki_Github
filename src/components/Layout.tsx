import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, Menu, X, Home, Sprout, Users, ExternalLink } from 'lucide-react';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const location = useLocation();

  const mainNavItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Sprout size={20} />, label: 'Wiki', path: '/wiki' },
    { icon: <Users size={20} />, label: 'Community', path: '/community' },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-neon-400">Cactus Tycoon</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-neon-400 bg-dark-800'
                      : 'text-dark-100 hover:text-neon-400 hover:bg-dark-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-2 rounded-lg text-dark-100 hover:text-neon-400 hover:bg-dark-800"
              >
                <Search size={20} />
              </button>

              <a
                href="https://play.cytooxien.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors font-semibold"
              >
                <span>Play Now</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-dark-100 hover:text-neon-400 hover:bg-dark-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-800 bg-dark-900/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-3">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-neon-400 bg-dark-800'
                      : 'text-dark-100 hover:text-neon-400 hover:bg-dark-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search wiki..."
                  className="w-full px-4 py-2 bg-dark-800 text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-500 placeholder-dark-400"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              </div>
              <a
                href="https://play.cytooxien.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-neon-600 text-dark-950 rounded-lg hover:bg-neon-500 transition-colors font-semibold"
              >
                <span>Play Now</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setIsSearchOpen(false)}
            >
              <div className="absolute inset-0 bg-dark-950 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-dark-800">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search wiki..."
                    className="w-full px-4 py-3 text-dark-100 rounded-lg bg-dark-800 focus:outline-none focus:ring-2 focus:ring-neon-500 placeholder-dark-400"
                    autoFocus
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-dark-300">Quick Links</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { title: 'Getting Started', path: '/wiki/getting-started' },
                      { title: 'Farming Guide', path: '/wiki/farming' },
                      { title: 'Server Rules', path: '/wiki/rules' },
                      { title: 'Automation', path: '/wiki/automation' },
                    ].map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 rounded hover:bg-dark-800 text-dark-200 hover:text-neon-400"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 text-dark-100 mt-16 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold text-neon-400 mb-4">Cactus Tycoon</h2>
              <p className="text-dark-300 mb-4">
                Join our Minecraft community and become the ultimate cactus farmer. Experience unique gameplay, events, and a friendly atmosphere.
              </p>
              <div className="flex space-x-4">
                <a href="https://discord.gg/cytooxien" target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-neon-400">
                  Discord
                </a>
                <a href="https://twitter.com/cytooxien" target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-neon-400">
                  Twitter
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-dark-100">Wiki</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/wiki/getting-started" className="text-dark-300 hover:text-neon-400">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link to="/wiki/guides" className="text-dark-300 hover:text-neon-400">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/wiki/rules" className="text-dark-300 hover:text-neon-400">
                    Rules
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-dark-100">Server</h3>
              <ul className="space-y-2">
                <li>
                  <p className="text-dark-300">IP: play.cytooxien.de</p>
                </li>
                <li>
                  <p className="text-dark-300">Version: 1.20.4</p>
                </li>
                <li>
                  <Link to="/status" className="text-dark-300 hover:text-neon-400">
                    Server Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-dark-800">
            <p className="text-center text-dark-400">
              &copy; {new Date().getFullYear()} Cactus Tycoon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}