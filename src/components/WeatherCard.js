import { celsiusToFaren, getDateDetails, getImgSrc } from "../fetchData";

const WeatherCard = ({ data, changeUnit }) => {
  const dateObj = getDateDetails(data && data.applicable_date);

  if (data) {
    return (
      <div className="weather-card">
        <div className="weather-card__head">
          {dateObj.timeDay === "Tomorrow" ? (
            <span>{dateObj.timeDay}</span>
          ) : (
            <>
              <span>{dateObj.dayWord},</span>
              <span>{dateObj.timeDay}</span>
              <span>{dateObj.month}</span>
            </>
          )}
        </div>
        <div className="weather-card__body">
          <img
            src={`/static/${getImgSrc(data.weather_state_name)}.png`}
            alt={data.weather_state_name}
          />
        </div>
        <div className="weather-card__footer">
          <span>
            {changeUnit
              ? celsiusToFaren(data.max_temp).toFixed(0)
              : data.max_temp.toFixed(0)}
            &deg;{changeUnit ? "F" : "C"}
          </span>
          <span id="minTemp">
            {changeUnit
              ? celsiusToFaren(data.min_temp).toFixed(0)
              : data.min_temp.toFixed(0)}
            &deg;{changeUnit ? "F" : "C"}
          </span>
        </div>
      </div>
    );
  } else {
    return "";
  }
};

export default WeatherCard;
