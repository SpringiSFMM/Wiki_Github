import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function FWSites() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 py-20 px-4 sm:px-6 lg:px-8 rounded-xl overflow-hidden shadow-md relative border border-dark-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYwOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyto-600/20 to-transparent opacity-50"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-800/80 backdrop-blur-sm mb-8 p-4 ring-2 ring-cyto-500/30">
            <span className="text-white text-3xl">🌐</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">FWSites</h1>
          <p className="text-xl text-dark-200 mb-10 max-w-2xl mx-auto">
            Professionelle Webentwicklung für Gaming-Communities und Minecraft-Server
          </p>
          <a
            href="https://fwsites.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-cyto-600 text-white rounded-lg font-semibold hover:bg-cyto-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <span>Besuche FWSites</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-cyto-400 mb-10 relative inline-block">
          Über FWSites
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-cyto-500 to-transparent rounded-full"></span>
        </h2>
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-10 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyto-500/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <p className="text-dark-200 mb-6 relative z-10">
            FWSites ist ein führendes Unternehmen in der Webentwicklung, das sich auf die Erstellung maßgeschneiderter Websites und Plattformen für Gaming-Communities und Minecraft-Server spezialisiert hat. Mit jahrelanger Erfahrung und tiefem Verständnis für die Bedürfnisse von Spieleservern bietet FWSites erstklassige Lösungen, die sowohl funktional als auch ästhetisch ansprechend sind.
          </p>
          <p className="text-dark-200 leading-relaxed mb-6">
            Als vertrauenswürdiger Partner von Kaktus Tycoon hat FWSites maßgeblich zur Entwicklung unserer Online-Präsenz beigetragen und uns geholfen, eine professionelle und benutzerfreundliche Plattform für unsere Community zu schaffen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-cyto-400 text-2xl group-hover:scale-125 transition-transform duration-300">✓</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyto-400 mb-3 group-hover:text-cyto-300 transition-colors">Maßgeschneiderte Lösungen</h3>
                <p className="text-dark-300">
                  Jedes Projekt wird individuell nach den Bedürfnissen des Kunden entwickelt.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-cyto-400 text-2xl group-hover:scale-125 transition-transform duration-300">⟨⟩</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyto-400 mb-3 group-hover:text-cyto-300 transition-colors">Moderne Technologien</h3>
                <p className="text-dark-300">
                  Einsatz von neuester Frameworks und Entwicklungsmethoden.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-cyto-400 text-2xl group-hover:scale-125 transition-transform duration-300">⚡</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyto-400 mb-3 group-hover:text-cyto-300 transition-colors">Schnelle Performance</h3>
                <p className="text-dark-300">
                  Optimierte Websites für schnelle Ladezeiten und reibungslose Benutzererfahrung.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-cyto-400 text-2xl group-hover:scale-125 transition-transform duration-300">🔒</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyto-400 mb-3 group-hover:text-cyto-300 transition-colors">Sicherheit & Zuverlässigkeit</h3>
                <p className="text-dark-300">
                  Höchste Sicherheitsstandards und zuverlässige Hosting-Lösungen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-cyto-400 mb-10 relative inline-block">
          Unsere Dienstleistungen
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-cyto-500 to-transparent rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group transform hover:scale-[1.02]">
            <div className="h-3 bg-gradient-to-r from-cyto-500 to-accent-400"></div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-lg bg-dark-800 flex items-center justify-center mb-6 group-hover:bg-dark-700 transition-colors duration-300">
                <span className="text-2xl">🖥️</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-4">Website-Entwicklung</h3>
              <p className="text-dark-300 mb-6">
                Responsive Websites mit modernem Design und benutzerfreundlicher Oberfläche.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Landing Pages
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Community-Portale
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Server-Showcases
                </li>
              </ul>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group transform hover:scale-[1.02]">
            <div className="h-3 bg-gradient-to-r from-cyto-500 to-accent-400"></div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-lg bg-dark-800 flex items-center justify-center mb-6 group-hover:bg-dark-700 transition-colors duration-300">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-4">Shop-Systeme</h3>
              <p className="text-dark-300 mb-6">
                Vollständig integrierte E-Commerce-Lösungen für Minecraft-Server.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Rang-Verkauf
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Sichere Zahlungsabwicklung
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Automatisierte Lieferung
                </li>
              </ul>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group transform hover:scale-[1.02]">
            <div className="h-3 bg-gradient-to-r from-cyto-500 to-accent-400"></div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-lg bg-dark-800 flex items-center justify-center mb-6 group-hover:bg-dark-700 transition-colors duration-300">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-4">Custom Plugins & Apps</h3>
              <p className="text-dark-300 mb-6">
                Maßgeschneiderte Erweiterungen und Anwendungen für einzigartige Anforderungen.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Web-Apps
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  Discord-Integrationen
                </li>
                <li className="flex items-center text-dark-300">
                  <span className="text-cyto-400 mr-2">•</span>
                  API-Entwicklung
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-dark-900 to-dark-800 rounded-xl overflow-hidden shadow-md p-10 relative border border-dark-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYwOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyto-600/10 to-transparent opacity-80"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Bereit für deine eigene Website?</h2>
            <p className="text-dark-200 text-lg mb-10 max-w-2xl mx-auto">
              Kontaktiere FWSites noch heute und erhalte ein unverbindliches Angebot für dein Projekt.
            </p>
            <a
              href="https://fwsites.de/kontakt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-cyto-600 text-white rounded-lg font-semibold hover:bg-cyto-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span>Kontakt aufnehmen</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
