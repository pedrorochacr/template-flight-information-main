import { I18nextProvider } from 'react-i18next';
import { useScreenInfo, useMedia } from '@dsplay/react-template-utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dataAirports from '../../util/airports.json';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import ThemeContextParent from '../../contexts/themeContext';

function App() {
  const { screenFormat } = useScreenInfo();
  const [results, setResults] = useState([]);
  const media = useMedia();
  const API_KEY = media.apiKey;
  const airportIATA = media.iataCode;
  const departureArrival = media.arrivalDeparture;
  useEffect(() => {
    function fetchFlightsData() {
      return axios.get(`https://aviation-edge.com/v2/public/timetable?key=${API_KEY}&iataCode=${airportIATA}&type=${departureArrival}`)
        .then((response) => response.data)
        .catch((error) => {
          throw error; // Propague o erro para que a carga não continue se a requisição falhar
        });
    }
    fetchFlightsData()
      .then((data) => {
        setResults(data);
      });
  }, []); // Dependências do useEffect

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContextParent>
        <div className={`app fade-in ${screenFormat}`}>
          <Main data={results} airports={dataAirports} />
        </div>
      </ThemeContextParent>
    </I18nextProvider>
  );
}

export default App;
