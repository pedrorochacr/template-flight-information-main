import { useContext, useEffect, useState } from 'react';
import './style.sass';
import { IoAirplane } from 'react-icons/io5';
import { useTemplateVal } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../contexts/themeContext';
import Intro from '../intro';

const formattedUpdateTime = {
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
};
const dateOptions = {
  hour: '2-digit',
  minute: '2-digit',
};
function Main({ data, airports }) {
  const { globalTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState(new Date());
  const flights = data;
  const flightsReduced = flights.filter((flight) => {
    const flightTime = new Date(flight.departure.scheduledTime);
    return flightTime <= currentTime;
  });
  flightsReduced.sort((a, b) => {
    const scheduledTimeA = new Date(a.departure.scheduledTime);
    const scheduledTimeB = new Date(b.departure.scheduledTime);
    return scheduledTimeB - scheduledTimeA;
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const updateCurrentTime = () => {
      setUpdateTime(new Date());
    };
    updateCurrentTime();
    const updateInterval = setInterval(updateCurrentTime, 15 * 60 * 1000);
    return () => clearInterval(updateInterval);
  }, []);

  useEffect(() => {
    if (flightsReduced) {
      setLoading(false);
    }
  }, [data]);
  const logoPicture = useTemplateVal('logoPicture', '');
  const name = useTemplateVal('nome');
  const viewWidth = window.innerWidth;
  const airpoirtName = airports.find((a) => a.codeIataAirport === 'BSB');
  const { t } = useTranslation();
  let { planePicture } = airlineInformation;

  if (planePicture !== 'up' && planePicture !== 'down') {
    planePicture = 'up';
  }
  if (loading) {
    return (
      <Intro />
    );
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
                    <h1>{currentTime.toLocaleTimeString()}</h1>
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
              <th>Terminal</th>
            </tr>
          </thead>
          <tbody>
            {
              flightsReduced.map((flight, index) => {
                const lineColor = (viewWidth < 700 || index % 2 !== 0) ? globalTheme.lineColor : '';
                const flightDate = new Date(flight.departure.scheduledTime);
                const { iataCode } = flight.arrival;
                const destination = airports.find((a) => a.codeIataAirport === iataCode);
                return (
                  <tr
                    key={flight.flight.number}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                  >
                    <td>{destination.nameAirport}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight.number}</td>
                    <td>{flight.airline.name}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {flightDate.toLocaleString('pt-BR', dateOptions)}
                    </td>
                    <td>{flight.departure.gate}</td>
                    <td>{flight.departure.terminal}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
      <footer className="updateTime" style={{ backgroundColor: globalTheme.secondaryColor }}>
        {airpoirtName.nameAirport}
        ,
        {' '}
        {t('update')}
        {' '}
        {updateTime.toLocaleString('pt-BR', formattedUpdateTime).replace(/,|às/g, '')}
        {name}
      </footer>
    </div>

  );
}

export default Main;
