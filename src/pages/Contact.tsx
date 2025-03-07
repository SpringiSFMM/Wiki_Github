import React from 'react';
import { Mail, MessageSquare, ExternalLink } from 'lucide-react';

export function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-dark-900/50 backdrop-blur-sm rounded-xl border border-dark-800/50 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-cyto-400 mb-6">Kontakt</h1>
        
        <p className="text-dark-200 mb-8">
          Hast du Fragen, Anregungen oder Feedback zum Wiki? Du kannst mich gerne über folgende Wege kontaktieren:
        </p>
        
        <div className="space-y-6">
          {/* E-Mail Kontakt */}
          <div className="bg-dark-850/70 rounded-xl p-6 border border-dark-800/30 transition-all duration-300 hover:border-cyto-700/30 hover:bg-dark-850/90">
            <div className="flex items-start">
              <div className="p-3 bg-cyto-600/10 rounded-lg mr-4">
                <Mail className="h-6 w-6 text-cyto-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-100 mb-2">E-Mail</h2>
                <p className="text-dark-300 mb-3">
                  Du kannst mir eine E-Mail an folgende Adresse senden:
                </p>
                <a 
                  href="mailto:springisfm@aerox.cloud" 
                  className="text-cyto-400 hover:text-cyto-300 transition-colors duration-300 font-medium flex items-center"
                >
                  springisfm@aerox.cloud
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Discord Kontakt */}
          <div className="bg-dark-850/70 rounded-xl p-6 border border-dark-800/30 transition-all duration-300 hover:border-cyto-700/30 hover:bg-dark-850/90">
            <div className="flex items-start">
              <div className="p-3 bg-cyto-600/10 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-cyto-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-100 mb-2">Discord</h2>
                <p className="text-dark-300 mb-3">
                  Du kannst mich auch über Discord kontaktieren:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-dark-300 w-24">Username:</span>
                    <span className="text-cyto-400 font-medium">springi_sfm</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-dark-300 w-24">ID:</span>
                    <span className="text-cyto-400 font-medium">563877348173414454</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 p-5 bg-dark-900/70 border border-dark-800/50 rounded-lg">
          <h3 className="text-lg font-semibold text-dark-100 mb-2">Hinweis</h3>
          <p className="text-dark-300">
            Dieses Wiki wurde von einem Communitymitglied erstellt und wird von diesem betrieben. 
            Es handelt sich um keine offizielle Seite von Cytooxien. Es findet keine Kooperation mit Cytooxien statt. 
            Cytooxien haftet nicht und ist für diese Seite nicht verantwortlich.
          </p>
        </div>
      </div>
    </div>
  );
}
