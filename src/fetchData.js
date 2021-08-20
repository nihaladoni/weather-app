let URL = `${process.env.REACT_APP_CORS_URL}https://www.metaweather.com/api/location`;

export const getCurrentLocation = async ({ lat, lon }) => {
  try {
    const a = await (
      await fetch(`${URL}/search/?lattlong=${lat},${lon}`)
    ).json();
    return await getWeatherById(a[0].woeid);
  } catch (error) {
    return error;
  }
};

export const getWeatherById = async (id) => {
  return await (await fetch(`${URL}/${id}/`)).json();
};
export const getWeather = async (term) => {
  const res = await (await fetch(`${URL}/search/?query=${term}`)).json();

  if (res.length !== 0) {
    return await getWeatherById(res[0].woeid);
  } else {
    return [];
  }
};

export const getDateDetails = (dateString) => {
  const dayString = new Date(dateString).toString();
  const dayWord = dayString.substring(0, 3);
  const month = dayString.substring(4, 7);
  const day = Number(dayString.substring(8, 10));
  const timeDay =
    day === new Date().getDate()
      ? "Today"
      : day === new Date().getDate() + 1
      ? "Tomorrow"
      : day;
  return { dayWord, month, day, timeDay };
};

export const getImgSrc = (imgName) => {
  return imgName.split(" ").join("");
};

export const celsiusToFaren = (cel) => {
  return (cel * 9) / 5 + 32;
};
