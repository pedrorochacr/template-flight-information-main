import { useContext } from 'react';
import './style.sass';
import { format, parseISO } from 'date-fns';
import { useTemplateVal } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../contexts/themeContext';

function Main() {
  const { globalTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualiza a hora a cada segundo
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  const logoPicture = useTemplateVal('logoPicture', '');
  const airlineInformation = useTemplateVal('airlineInformation', '');
  const viewWidth = window.innerWidth;
  const { t } = useTranslation();

  let { planePicture } = airlineInformation;

  if (planePicture !== 'up' && planePicture !== 'down') {
    planePicture = 'up';
  }

  return (
    <div className="main">
      <header style={{ backgroundColor: globalTheme.primaryColor }}>
        {
          viewWidth < 700 ? (
            <>
              <section id="sectionHeader">
                <div id="logo">
                  <img src={logoPicture === '' ? 'dsplayLogo.png' : logoPicture} alt="" />
                </div>
                <div>
                  <div>
                    <h1>{airlineInformation.departuresOrArrivals}</h1>
                    <img src={`./assets/${planePicture}.png`} alt="" />
                  </div>
                  <div>
                    <h1>{currentTime}</h1>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <div id="logo">
                  <img src={logoPicture} alt="" />
                </div>
                <div>
                  <h1>{airlineInformation.departuresOrArrivals}</h1>
                  <img src={`assets/${planePicture}.png`} alt="" />
                </div>
              </section>
              <section className='dateArea'>
                <span>
                  <h1>{airlineInformation.airportName}</h1>
                </span>
                
              </section>
            </>
          )
        }
      </header>
      <section className="table">
        <table>
          <thead>
            <tr style={{ backgroundColor: globalTheme.secondaryColor }}>
              <th>{t('destination')}</th>
              <th>{t('flight')}</th>
              <th>{t('airline')}</th>
              <th>{t('time')}</th>
              <th>{t('gate')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {
              airlineInformation.flights.map((flight, index) => {
                const lineColor = (viewWidth < 700 || index % 2 !== 0) ? globalTheme.lineColor : '';

                return (
                  <tr
                    key={flight.flight + flight.airline}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                  >
                    <td>{flight.destination}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight}</td>
                    <td>
                      <img
                        src={flight.airline === '' ? './assets/earth.png' : flight.airline}
                        alt="Airline"
                        className="airline-img"
                      />
                    </td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {format(parseISO(flight.departureTime), 'HH:mm a')}
                    </td>
                    <td>{flight.gate}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.status}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
      <footer style={{ backgroundColor: globalTheme.secondaryColor }}>
        {t('update')}
        {' '}
        {format(parseISO(airlineInformation.lastUpdate), 'HH:mm a EEEE MMM dd, yyyy')}
      </footer>
    </div>

  );
}

export default Main;
