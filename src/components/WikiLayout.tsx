import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Book } from 'lucide-react';
import { cn } from '../lib/utils';

interface WikiLayoutProps {
  children: React.ReactNode;
}

export function WikiLayout({ children }: WikiLayoutProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(true);

  const categories = [
    {
      title: 'Getting Started',
      icon: <Book className="h-4 w-4" />,
      items: [
        { title: 'Welcome Guide', path: '/wiki/getting-started/welcome' },
        { title: 'Basic Mechanics', path: '/wiki/getting-started/mechanics' },
        { title: 'First Farm', path: '/wiki/getting-started/first-farm' },
      ]
    },
    // ... other categories
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-dark-900 border-r border-dark-800 transition-transform duration-200 ease-in-out z-30",
          !isOpen && "-translate-x-64"
        )}
      >
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center mb-2 text-neon-400">
                  {category.icon}
                  <span className="ml-2 font-semibold">{category.title}</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={cn(
                          "block py-1 px-2 rounded-lg text-sm transition-colors",
                          location.pathname === item.path
                            ? "bg-neon-500/10 text-neon-400"
                            : "text-dark-200 hover:text-neon-400 hover:bg-dark-800"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-dark-900 text-neon-400 p-2 rounded-r-lg border border-l-0 border-dark-800 z-40"
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
      </button>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-200 ease-in-out",
        isOpen ? "ml-64" : "ml-0"
      )}>
        {children}
      </main>
    </div>
  );
}