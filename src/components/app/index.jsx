import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dataAirports from '../../util/airports.json';
import Intro from '../intro';
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
const MIN_LOADING_DURATION = 2000;
// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Thin',
  'Roboto Light',
  'Roboto Regular',
  'Roboto Medium',
  'Roboto Bold',
  'Roboto Condensed',
  'Oswald',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const [results, setResults] = useState([]);
  useEffect(() => {
    const runTasks = async () => {
      try {
        const data = await Promise.all(tasks.map((task) => task()));
        setResults(data[0]);
      } catch (error) {
        console.error('Erro ao executar tarefas:', error);
      }
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
        <Loader
          placeholder={<Intro />}
          fonts={fonts}
          images={images}
          minDuration={MIN_LOADING_DURATION}
          tasks={tasks}
        >
          <div className={`app fade-in ${screenFormat}`}>
            <Main data={results} airports={dataAirports} />
          </div>
        </Loader>
      </ThemeContextParent>
    </I18nextProvider>
  );
}

export default App;
