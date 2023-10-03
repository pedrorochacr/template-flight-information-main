import { I18nextProvider } from 'react-i18next';
import { useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dataAirports from '../../util/airports.json';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import ThemeContextParent from '../../contexts/themeContext';
// console.log(U, Loader)
const API_KEY = '08b5aa-fd83fa';
function fetchFlightsData() {
  return axios.get(`https://aviation-edge.com/v2/public/timetable?key=${API_KEY}&iataCode=BSB&type=departure`)
    .then((response) => response.data)
    .catch((error) => {
      throw error; // Propague o erro para que a carga não continue se a requisição falhar
    });
}

const tasks = [
  () => fetchFlightsData(), // Suponha que fetchFlightsData seja uma função que retorna uma Promise
];
// fonts to preload

function App() {
  const { screenFormat } = useScreenInfo();
  const [results, setResults] = useState([]);
  useEffect(() => {
    const runTasks = async () => {
      const data = await Promise.all(tasks.map((task) => task()));
      setResults(data[0]);
    };
    runTasks();
  }, []);
  const logoPicture = useTemplateVal('logoPicture', '');
  const airlineInformation = useTemplateVal('airlineInformation', '');

  const images = [
    airlineInformation.planePicture,
    logoPicture,
  ];

  airlineInformation.flights.map((item) => images.push(item.airline));

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
