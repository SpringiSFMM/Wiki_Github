import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Datenschutz() {
  const { isDarkMode } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-xl p-8 ${isDarkMode ? 'bg-dark-900/70 border border-dark-700' : 'bg-white border border-gray-200'} shadow-lg`}>
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Datenschutzerklärung
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Verantwortlicher
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>Patrick Guth</p>
              <p>Robert-Koch-Str. 24</p>
              <p>16303 Schwedt Oder</p>
              <p>Deutschland</p>
              <p className="mt-2">E-Mail: springisfm@aerox.cloud</p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Umfang der Verarbeitung personenbezogener Daten
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>
                Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung 
                einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung 
                personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers.
              </p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Kommunikation per E-Mail und Discord
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'} space-y-3`}>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>E-Mail-Kommunikation</h3>
              <p>
                Wenn Sie mit uns per E-Mail in Kontakt treten, werden die von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, 
                ggf. Ihr Name und Ihre Telefonnummer) von uns gespeichert, um Ihre Fragen zu beantworten. 
                Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, 
                oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.
              </p>

              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Discord-Kommunikation</h3>
              <p>
                Wenn Sie mit uns über Discord in Kontakt treten, werden die von Ihnen mitgeteilten Daten (Ihr Discord-Nutzername, 
                ggf. weitere Informationen, die Sie uns mitteilen) von uns gespeichert, um Ihre Anfragen zu bearbeiten.
                Bitte beachten Sie, dass Discord seine eigene Datenschutzrichtlinie hat, über die Sie sich auf der 
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className={`mx-1 ${isDarkMode ? 'text-cyto-400 hover:text-cyto-300' : 'text-cyto-600 hover:text-cyto-700'}`}>
                  Discord-Website
                </a>
                informieren können.
              </p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Ihre Rechte
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'} space-y-3`}>
              <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Recht auf Auskunft</li>
                <li>Recht auf Berichtigung oder Löschung</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
              </ul>
              <p>
                Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
                personenbezogenen Daten durch uns zu beschweren.
              </p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Änderung unserer Datenschutzbestimmungen
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen 
                Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, 
                z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              Fragen zum Datenschutz
            </h2>
            <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
              <p>
                Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt 
                an die für den Datenschutz verantwortliche Person:
              </p>
              <p className="mt-2">
                Patrick Guth<br />
                E-Mail: kontakt@cytooxien-wiki.de<br />
                Discord: cytooxien
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Datenschutz; 