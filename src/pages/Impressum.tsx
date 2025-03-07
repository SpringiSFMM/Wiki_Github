import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Impressum() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
        Impressum
      </h1>
      
      <div className={`space-y-8 ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Diensteanbieter
          </h2>
          <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
            <p>Patrick Guth<br />Robert-Koch-Straße 24</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Kontaktmöglichkeiten
          </h2>
          <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
            <p>E-Mail-Adresse: springisfm@aerox.cloud</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Journalistisch-redaktionelle Angebote
          </h2>
          <div className={`${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
            <p>Inhaltlich verantwortlich: Patrick Guth</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
            Haftungs- und Schutzrechtshinweise
          </h2>
          <div className={`space-y-6 ${isDarkMode ? 'text-dark-200' : 'text-gray-700'}`}>
            <div className="space-y-4">
              <h3 className={`text-xl font-medium ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Haftungsausschluss
              </h3>
              <p className="leading-relaxed">
                Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, 
                dienen jedoch nur der Information und entfalten keine rechtlich bindende Wirkung, sofern es sich nicht 
                um gesetzlich verpflichtende Informationen (z. B. das Impressum, die Datenschutzerklärung, AGB oder 
                verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig 
                oder teilweise zu ändern oder zu löschen, soweit vertragliche Verpflichtungen unberührt bleiben. 
                Alle Angebote sind freibleibend und unverbindlich.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className={`text-xl font-medium ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Urheberrechte und Markenrechte
              </h3>
              <p className="leading-relaxed">
                Alle auf dieser Website dargestellten Inhalte, wie Texte, Fotografien, Grafiken, Marken und Warenzeichen 
                sind durch die jeweiligen Schutzrechte (Urheberrechte, Markenrechte) geschützt. Die Verwendung, 
                Vervielfältigung usw. unterliegen unseren Rechten oder den Rechten der jeweiligen Urheber bzw. Rechteinhaber.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className={`text-xl font-medium ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                Hinweise auf Rechtsverstöße
              </h3>
              <p className="leading-relaxed">
                Sollten Sie innerhalb unseres Internetauftritts Rechtsverstöße bemerken, bitten wir Sie uns auf diese 
                hinzuweisen. Wir werden rechtswidrige Inhalte und Links nach Kenntnisnahme unverzüglich entfernen.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
