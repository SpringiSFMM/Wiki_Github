import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Impressum() {
  const { isDarkMode } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-xl p-8 ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'} shadow-lg`}>
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Impressum
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Angaben gemäß § 5 TMG
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>Patrick Guth</p>
              <p>Robert-Koch-Str. 24</p>
              <p>16303 Schwedt Oder</p>
              <p>Deutschland</p>
              <p className="mt-2"><strong>Hinweis:</strong> Keine Paket/Briefannahme</p>
              <p><strong>Status:</strong> Privatperson</p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Kontakt
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>E-Mail: springisfm@aerox.cloud</p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Verantwortlich für den Inhalt
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>Patrick Guth</p>
              <p>Robert-Koch-Str. 24</p>
              <p>16303 Schwedt Oder</p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Haftungsausschluss
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'} space-y-3`}>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Haftung für Inhalte</h3>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>

              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Impressum;
