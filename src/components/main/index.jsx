import { useContext, useEffect, useState } from 'react';
import './style.sass';
import { IoAirplane } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';
import { useTemplateVal } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../contexts/themeContext';

function Main({ data }) {
  const { globalTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const flights = data[0].slice(0, 15);
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
                <div className="centered-div">
                  <h1>{airlineInformation.departuresOrArrivals}</h1>
                  <img src={`assets/${planePicture}.png`} alt="" />
                </div>
              </section>
              <section className="dateArea">
                <span className="hour">
                  <IoAirplane size={35} />
                  <h1>{currentTime.toLocaleTimeString()}</h1>
                </span>
                <span className="date">{currentTime.toLocaleDateString()}</span>
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
              flights.map((flight, index) => {
                const lineColor = (viewWidth < 700 || index % 2 !== 0) ? globalTheme.lineColor : '';
                return (
                  <tr
                    key={flight.flight.number}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                  >
                    <td>{flight.destination}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight.number}</td>
                    <td>{flight.airline.name}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {flight.departure.scheduledTime}
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
