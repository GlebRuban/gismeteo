async function getData(params = {}) {
  
  const apiKey = '112310842157e7cca360989cbfadcc59';
  const baseUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${params.city}&appid=${apiKey}&units=metric&lang=ru`;
  const data = await fetch(makeUrl(baseUrl, params)).then(s => s.json());

  mapData(data);
}


function makeUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([name, value]) => {
    url.searchParams.append(name, value);
  })
  return url;
}

function getImage(imageName) {
  return `http://openweathermap.org/img/wn/${imageName}@2x.png`
}

function mapData(data) {
  const dates = data.list.map(item => String(item.dt_txt).split(' ').at(0));
  const groupedData = {}; 
  dates.forEach((date) => {
    groupedData[date] = data.list.filter(item => String(item.dt_txt).startsWith(date));
  });

  console.log({ groupedData, data });
  generateList(groupedData, data);
}


function generateList(groupedData = {}, data) {
  const listGroup = document.querySelector('#list-group');

  Object.entries(groupedData).map(([key, value]) => {
    listGroup.innerHTML += `
      <li class="list-group-item mb-3">
        <div class="content-wrapper">
          <div class="header-content">
            <i class="bi bi-arrows-angle-expand" onclick="expandRow(this)"></i>
            <h1 class="display-4" id="header">${key}</h1>
          </div>
          <div class="content hide">
            <h1 class="display-6">${data.city.name}/${data.city.country}</h1>
            ${generateDays(value)}
          </div>
        </div>
      </li>
    `
  });
}

function expandRow(element) {
  if (element.className === 'bi bi-arrows-angle-expand') {
    element.className = 'bi bi-arrows-angle-contract'
  } else {
    element.className = 'bi bi-arrows-angle-expand'
  }
  element.parentElement.parentElement.querySelector('.content').classList.toggle('hide');
}

function generateDays(days = []) {
  return days.map((day) => {
    return `
      <hr/>
      <h1 class="display-7">${day.dt_txt}</h1>
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <img src="${getImage(day.weather[0].icon)}" />
          <h1 class="display-5">${day.main.temp}°C</h1>
        </div>
        <h1 class="display-5">${day.weather[0].description}</h1>
      </div>
      <h1 class="display-7">Чуствуется как: ${day.main.feels_like}°C</h1>
      <h1 class="display-7">Влажность: ${day.main.humidity}%</h1>
      <h1 class="display-7">Давление: ${day.main.pressure} мм рт. ст</h1>
      <h1 class="display-7">Видимость: ${day.visibility} метров</h1>
      <h1 class="display-7">Ветер: ${day.wind.speed} м/с</h1>
    `;
  }).join('');

}

getData({ city: 'Калининград' });
