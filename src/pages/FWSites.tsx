import React from 'react';
import { ExternalLink } from 'lucide-react';

export function FWSites() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 py-20 px-4 sm:px-6 lg:px-8 rounded-xl overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYwOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-8 p-4 ring-2 ring-white/20">
            <span className="text-white text-3xl">🌐</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 text-shadow">FWSites</h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Professionelle Webentwicklung für Gaming-Communities und Minecraft-Server
          </p>
          <a
            href="https://fwsites.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Besuche FWSites</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-neon-400 mb-10 relative inline-block">
          Über FWSites
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-neon-400 to-transparent rounded-full"></span>
        </h2>
        <div className="bg-dark-900 rounded-xl border border-dark-800 p-10 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-500/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <p className="text-dark-200 mb-6 relative z-10">
            FWSites ist ein führendes Unternehmen in der Webentwicklung, das sich auf die Erstellung maßgeschneiderter Websites und Plattformen für Gaming-Communities und Minecraft-Server spezialisiert hat. Mit jahrelanger Erfahrung und tiefem Verständnis für die Bedürfnisse von Spieleservern bietet FWSites erstklassige Lösungen, die sowohl funktional als auch ästhetisch ansprechend sind.
          </p>
          <p className="text-dark-200 mb-10 relative z-10">
            Als vertrauenswürdiger Partner von Cytooxien hat FWSites maßgeblich zur Entwicklung unserer Online-Präsenz beigetragen und uns geholfen, eine professionelle und benutzerfreundliche Plattform für unsere Community zu schaffen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-neon-400 text-2xl group-hover:scale-125 transition-transform duration-300">✓</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-3 group-hover:text-neon-300 transition-colors">Maßgeschneiderte Lösungen</h3>
                <p className="text-dark-300">
                  Jedes Projekt wird individuell nach den Bedürfnissen des Kunden entwickelt.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-neon-400 text-2xl group-hover:scale-125 transition-transform duration-300">⟨⟩</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-3 group-hover:text-neon-300 transition-colors">Moderne Technologien</h3>
                <p className="text-dark-300">
                  Einsatz von neuester Frameworks und Entwicklungsmethoden.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-neon-400 text-2xl group-hover:scale-125 transition-transform duration-300">⚡</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-3 group-hover:text-neon-300 transition-colors">Optimierte Performance</h3>
                <p className="text-dark-300">
                  Schnelle Ladezeiten und optimierte Benutzeroberflächen für beste Nutzererfahrung.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 group">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="text-neon-400 text-2xl group-hover:scale-125 transition-transform duration-300">👥</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-3 group-hover:text-neon-300 transition-colors">Community-Fokus</h3>
                <p className="text-dark-300">
                  Spezialisierung auf die Bedürfnisse von Gaming-Communities und Spieleservern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-neon-400 mb-10 relative inline-block">
          Angebotene Dienstleistungen
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-neon-400 to-transparent rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-900 rounded-xl border border-dark-800 p-8 hover:border-neon-500/50 transition-all duration-500 group hover:shadow-lg hover:shadow-neon-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="mb-6 p-1 relative z-10">
              <div className="text-neon-400 text-3xl group-hover:scale-125 transition-transform duration-300">🌐</div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 relative z-10 group-hover:text-neon-400 transition-colors">Website-Entwicklung</h3>
            <p className="text-dark-300 relative z-10">
              Responsive Websites mit modernem Design, optimiert für alle Geräte und Bildschirmgrößen.
            </p>
          </div>

          <div className="bg-dark-900 rounded-xl border border-dark-800 p-8 hover:border-neon-500/50 transition-all duration-500 group hover:shadow-lg hover:shadow-neon-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="mb-6 p-1 relative z-10">
              <div className="text-neon-400 text-3xl group-hover:scale-125 transition-transform duration-300">⟨⟩</div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 relative z-10 group-hover:text-neon-400 transition-colors">Spieler-Portale</h3>
            <p className="text-dark-300 relative z-10">
              Interaktive Plattformen für Spieler mit Statistiken, Profilen und Community-Funktionen.
            </p>
          </div>

          <div className="bg-dark-900 rounded-xl border border-dark-800 p-8 hover:border-neon-500/50 transition-all duration-500 group hover:shadow-lg hover:shadow-neon-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="mb-6 p-1 relative z-10">
              <div className="text-neon-400 text-3xl group-hover:scale-125 transition-transform duration-300">🛒</div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 relative z-10 group-hover:text-neon-400 transition-colors">Shop-Systeme</h3>
            <p className="text-dark-300 relative z-10">
              Integrierte Webshops für Minecraft-Server mit sicheren Zahlungsmethoden und Automatisierung.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 rounded-xl p-10 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYwOCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Interesse an einer Zusammenarbeit?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto relative z-10">
            Besuche die FWSites-Website, um mehr über die angebotenen Dienstleistungen zu erfahren und ein unverbindliches Angebot anzufordern.
          </p>
          <a
            href="https://fwsites.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg relative z-10"
          >
            <span>Zu FWSites</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
