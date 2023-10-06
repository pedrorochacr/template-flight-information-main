import { useContext, useEffect, useState } from 'react';
import './style.sass';
import { IoAirplane } from 'react-icons/io5';
import axios from 'axios';
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
  const [flights, setFlights] = useState([]);
  const API_KEY = useTemplateVal('key');
  const airportIATA = useTemplateVal('CodigoIATA');
  const departureArrival = useTemplateVal('ChegadaSaida');
  async function fetchFlightsData() {
    const type = departureArrival === 'Chegada' ? 'arrival' : 'departure';
    const response = await axios.get(`https://aviation-edge.com/v2/public/timetable?key=${API_KEY}&iataCode=${airportIATA}&type=${type}`);
    return response.data;
  }
  useEffect(() => {
    const flightsReduced = data.filter((flight) => {
      const arrival = departureArrival === 'Chegada';
      const time = arrival ? flight.arrival.scheduledTime : flight.departure.scheduledTime;
      const flightTime = new Date(time);
      const codesharedIsNotNull = flight.codeshared === null;
      return flightTime >= currentTime && codesharedIsNotNull;
    });
    flightsReduced.sort((a, b) => {
      const arrival = departureArrival === 'Chegada';
      const timeA = arrival ? a.arrival.scheduledTime : a.departure.scheduledTime;
      const timeB = arrival ? b.arrival.scheduledTime : b.departure.scheduledTime;
      const scheduledTimeA = new Date(timeA);
      const scheduledTimeB = new Date(timeB);
      return scheduledTimeA - scheduledTimeB;
    });
    setFlights(flightsReduced);
  }, [data]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const updateCurrentTime = async () => {
      setUpdateTime(new Date());
      let flightsUpdated = await fetchFlightsData();
      flightsUpdated = flightsUpdated.filter((flight) => {
        const arrival = departureArrival === 'Chegada';
        const time = arrival ? flight.arrival.scheduledTime : flight.departure.scheduledTime;
        const flightTime = new Date(time);
        const codesharedIsNotNull = flight.codeshared === null;
        return flightTime >= currentTime && codesharedIsNotNull;
      });
      flightsUpdated.sort((a, b) => {
        const arrival = departureArrival === 'Chegada';
        const timeA = arrival ? a.arrival.scheduledTime : a.departure.scheduledTime;
        const timeB = arrival ? b.arrival.scheduledTime : b.departure.scheduledTime;
        const scheduledTimeA = new Date(timeA);
        const scheduledTimeB = new Date(timeB);
        return scheduledTimeA - scheduledTimeB;
      });
      setFlights(flightsUpdated);
    };
    const initialUpdateTimeout = setTimeout(updateCurrentTime, 15 * 60 * 1000);
    const updateInterval = setInterval(updateCurrentTime, 15 * 60 * 1000);
    return () => {
      clearTimeout(initialUpdateTimeout);
      clearInterval(updateInterval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, []);
  const viewWidth = window.innerWidth;
  const iataAirpot = useTemplateVal('CodigoIATA');
  const airpoirtName = airports.find((a) => a.codeIataAirport === iataAirpot);
  const { t } = useTranslation();
  let planePicture = 'up';
  if (departureArrival === 'Chegada') {
    planePicture = 'down';
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
                <div>
                  <h1>{departureArrival === 'Chegada' ? t('arrivals') : t('departures')}</h1>
                  <img src={`./assets/${planePicture}.png`} alt="" />
                </div>
                <div>
                  <div>
                    <h1>{currentTime.toLocaleTimeString()}</h1>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <div>
                  <h1>{departureArrival === 'Chegada' ? t('arrivals') : t('departures')}</h1>
                  <img src={`./assets/${planePicture}.png`} alt="" />
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
              <th>{departureArrival === 'Chegada' ? t('origin') : t('destination')}</th>
              <th>{t('flight')}</th>
              <th>{t('airline')}</th>
              <th>{t('time')}</th>
              <th>{t('gate')}</th>
              <th>Terminal</th>
            </tr>
          </thead>
          <tbody>
            {
              flights.map((flight, index) => {
                const lineColor = (viewWidth < 700 || index % 2 !== 0) ? globalTheme.lineColor : '';
                const arrival = departureArrival === 'Chegada';
                const arrivalTime = flight.arrival.scheduledTime;
                const departureTime = flight.departure.scheduledTime;
                const varDate = arrival ? arrivalTime : departureTime;
                const flightDate = new Date(varDate);
                const { iataCode } = arrival ? flight.departure : flight.arrival;
                const destination = airports.find((a) => a.codeIataAirport === iataCode);
                const gate = arrival ? flight.arrival.gate : flight.departure.gate;
                const terminal = arrival ? flight.arrival.terminal : flight.departure.terminal;
                return (
                  <tr
                    key={flight.flight.number}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                    className="flightData"
                  >
                    <td>{destination.nameAirport}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight.number}</td>
                    <td>{flight.airline.name}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {flightDate.toLocaleString('pt-BR', dateOptions)}
                    </td>
                    <td>{gate}</td>
                    <td>{terminal}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
      <footer className="updateTime" style={{ backgroundColor: globalTheme.secondaryColor }}>
        <p>{airpoirtName.nameAirport}</p>
        <p>{updateTime.toLocaleString('pt-BR', formattedUpdateTime).replace(/,|às/g, '')}</p>
      </footer>
    </div>

  );
}

export default Main;
