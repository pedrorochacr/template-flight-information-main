import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import ThemeContextParent from '../../contexts/themeContext';

// console.log(U, Loader)

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

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();

  // images to preload
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
            <Main />
          </div>
        </Loader>
      </ThemeContextParent>
    </I18nextProvider>
  );
}

export default App;
