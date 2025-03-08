import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';

export function Imprint() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-8">
      <section className={`rounded-2xl ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-slate-200 shadow-sm'} overflow-hidden`}>
        <div className="p-6 md:p-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} mb-6`}>Impressum</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-4`}>Angaben gemäß § 5 TMG</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-dark-700' : 'border-slate-200'}`}>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>Max Mustermann</p>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>Musterstraße 123</p>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>12345 Musterstadt</p>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>Deutschland</p>
              </div>
            </div>
            
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-4`}>Kontakt</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-dark-700' : 'border-slate-200'} space-y-3`}>
                <div className="flex items-center">
                  <Phone className={`h-5 w-5 mr-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />
                  <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>+49 123 456789</p>
                </div>
                <div className="flex items-center">
                  <Mail className={`h-5 w-5 mr-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />
                  <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>kontakt@beispiel.de</p>
                </div>
                <div className="flex items-center">
                  <Globe className={`h-5 w-5 mr-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`} />
                  <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>www.beispiel.de</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-4`}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-dark-700' : 'border-slate-200'}`}>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>Max Mustermann</p>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>Musterstraße 123</p>
                <p className={`${isDarkMode ? 'text-dark-200' : 'text-slate-700'}`}>12345 Musterstadt</p>
              </div>
            </div>
            
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-4`}>Haftungsausschluss</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-dark-700' : 'border-slate-200'} space-y-4`}>
                <div>
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-2`}>Haftung für Inhalte</h3>
                  <p className={`${isDarkMode ? 'text-dark-300' : 'text-slate-600'}`}>
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-2`}>Haftung für Links</h3>
                  <p className={`${isDarkMode ? 'text-dark-300' : 'text-slate-600'}`}>
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-2`}>Urheberrecht</h3>
                  <p className={`${isDarkMode ? 'text-dark-300' : 'text-slate-600'}`}>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-slate-900'} mb-4`}>Hinweis zur Kaktus Tycoon - Wiki</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-800/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-dark-700' : 'border-slate-200'}`}>
                <p className={`${isDarkMode ? 'text-dark-300' : 'text-slate-700'}`}>
                  Dieses Wiki wurde von einem Communitymitglied erstellt und wird von diesem betrieben. 
                  Es handelt sich um keine offizielle Seite von Kaktus Tycoon. Es findet keine Kooperation mit Kaktus Tycoon statt. 
                  Kaktus Tycoon haftet nicht und ist für diese Seite nicht verantwortlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
