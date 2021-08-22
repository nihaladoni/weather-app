import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";

import "./App.css";
import CardText from "./components/CardText";
import SearchBar from "./components/SearchBar";
import Slider from "./components/Slider";
import Toast from "./components/Toast";
import WeatherCard from "./components/WeatherCard";
import {
  celsiusToFaren,
  getCurrentLocation,
  getDateDetails,
  getImgSrc,
  getWeather,
} from "./fetchData";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {}, []);

  const [bool, setBool] = useState(false);
  const [term, setTerm] = useState("");
  const [changeUnit, setChangeUnit] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [history, setHistory] = useLocalStorage("history", []);
  const [isLoading, setIsLoading] = useState(false);

  const todayWeather =
    locationData.length !== 0 && locationData.consolidated_weather[0];

  const todayTemp = todayWeather && todayWeather.the_temp;
  const todayWeatherState = todayWeather && todayWeather.weather_state_name;
  const todayWindSpeed = todayWeather && todayWeather.wind_speed.toFixed(0);
  const todayWindDirection =
    todayWeather && todayWeather.wind_direction_compass;
  const todayHumidity = todayWeather && todayWeather.humidity;
  const todayVisibility = todayWeather && todayWeather.visibility.toFixed(1);
  const todayAirPressure = todayWeather && todayWeather.air_pressure;

  const allDays =
    locationData.length !== 0 &&
    locationData.consolidated_weather.filter((d, i) => i !== 0);

  let imgSrc = todayWeatherState && getImgSrc(todayWeatherState);

  const dateObj = getDateDetails(todayWeather?.applicable_date);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      return "Geolocation is not supported by this browser.";
    }
  };

  async function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    setIsLoading(true);
    await getCurrentLocation({ lat, lon }).then((d) => {
      setLocationData(d);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    getWeather("delhi").then((d) => {
      setLocationData(d);
      setIsLoading(false);
    });
  }, []);

  const handleSeachSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    getWeather(term).then((d) => {
      if (d.length !== 0) {
        setLocationData(d);
        setIsLoading(false);
      } else {
        (() => {
          setShowErr(true);
          setTimeout(() => {
            setShowErr(false);
          }, 2000);
          setIsLoading(false);
        })();
      }
    });

    setHistory([...history, term]);
    setTerm("");
    setBool(false);
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      fadeSpeed={200}
      text="Loading..."
      styles={{
        overlay: (base) => ({
          ...base,
          background: "rgba(16, 14, 29, 0.99)",
        }),
      }}
    >
      <div className="App">
        <aside>
          {showErr ? <Toast /> : null}
          <div className="aside__header">
            {bool ? (
              <>
                <div onClick={() => setHistory([])}>
                  <span
                    className="material-icons-outlined material-icons"
                    style={{ backgroundColor: "transparent" }}
                  >
                    delete
                  </span>
                </div>

                <div className="temperature-container">
                  <button
                    className="temp-button"
                    onClick={() => {
                      setChangeUnit(false);
                      setBool(false);
                    }}
                  >
                    &deg;C
                  </button>

                  <button
                    className="temp-button faren"
                    onClick={() => {
                      setChangeUnit(true);
                      setBool(false);
                    }}
                  >
                    &deg;F
                  </button>
                </div>
                <div onClick={() => setBool(false)}>
                  <span
                    className="material-icons-outlined material-icons"
                    style={{ backgroundColor: "transparent" }}
                  >
                    close
                  </span>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setBool(true)}>Search for places</button>
                <div onClick={getLocation}>
                  <span className="material-icons-outlined material-icons">
                    my_location
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="aside__body">
            {bool ? (
              <>
                <SearchBar
                  onSubmit={handleSeachSubmit}
                  term={term}
                  setTerm={setTerm}
                />
                <div className="search__history">
                  {history &&
                    history.map((data, i) => (
                      <React.Fragment key={i}>
                        <button
                          className="search__history--button"
                          onClick={() => {
                            setIsLoading(true);
                            getWeather(data).then((d) => {
                              if (d.length !== 0) {
                                setLocationData(d);
                                setIsLoading(false);
                              } else {
                                (() => {
                                  setShowErr(true);
                                  setTimeout(() => {
                                    setShowErr(false);
                                  }, 2000);
                                })();
                                setIsLoading(false);
                              }
                            });
                            setBool(false);
                          }}
                        >
                          {data}
                          <span className="material-icons-outlined material-icons">
                            navigate_next
                          </span>
                        </button>
                      </React.Fragment>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className="aside__body--top bg-cloud"
                  style={{
                    backgroundImage: `url('/static/Cloud-background.png')`,
                    filter: "opacity(.5)",
                  }}
                >
                  <img
                    src={`/static/${imgSrc}.png`}
                    alt="weather-icon"
                    id="weather-img"
                    style={{ filter: "opacity(1)" }}
                  />
                </div>
                <div className="aside__body--bottom">
                  <div className="temp-container">
                    <h1>
                      {changeUnit
                        ? todayTemp && celsiusToFaren(todayTemp).toFixed(2)
                        : todayTemp && todayTemp.toFixed(2)}
                    </h1>
                    <span className="temp">&deg;{changeUnit ? "F" : "C"}</span>
                  </div>
                  <h4>{todayWeatherState}</h4>
                  <div className="day">
                    <p>{dateObj.timeDay}</p>
                    <span>.</span>
                    <p>
                      {dateObj.dayWord},{dateObj.day}
                      {dateObj.month}
                    </p>
                  </div>
                  <div className="location">
                    <span className="material-icons-outlined material-icons md-18">
                      location_on
                    </span>
                    <p>{locationData && locationData.title}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        <main>
          <div className="temperature-container">
            <button
              className="temp-button"
              onClick={() => setChangeUnit(false)}
            >
              &deg;C
            </button>

            <button
              className="temp-button faren"
              onClick={() => setChangeUnit(true)}
            >
              &deg;F
            </button>
          </div>
          <div className="main__top">
            {allDays &&
              allDays.map((d) => (
                <React.Fragment key={d.id}>
                  <WeatherCard data={d} changeUnit={changeUnit} />
                </React.Fragment>
              ))}
          </div>
          <div className="main__bottom">
            <h5>Today’s Hightlights </h5>

            <div className="card-container">
              <CardText
                head="Wind status"
                body="mph"
                bodyData={todayWindSpeed}
                foot={todayWindDirection}
              />
              <CardText
                head="Humidity"
                body="%"
                bodyData={todayHumidity}
                foot={<Slider num={todayHumidity} />}
              />
              <CardText
                head="Visibility"
                body="miles"
                bodyData={todayVisibility}
              />
              <CardText
                head="Air Pressure"
                body="mb"
                bodyData={todayAirPressure}
              />
            </div>
          </div>
        </main>
        <footer>
          <p>
            created by <strong>nihal</strong> - devChallenges.io
          </p>
        </footer>
      </div>
    </LoadingOverlay>
  );
}

export default App;
