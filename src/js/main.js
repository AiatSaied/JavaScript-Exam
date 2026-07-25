// variables
const countrySelect = document.getElementById("global-country");
const citySelect = document.getElementById("global-city");
const yearSelect = document.getElementById("global-year");
const exploreBtn = document.getElementById("global-search-btn");

// Destination
const selectedDestination = document.getElementById("selected-destination");
const selectedCountryName = document.getElementById("selected-country-name");
const selectedCityName = document.getElementById("selected-city-name");
const selectedCountryFlag = document.getElementById("selected-country-flag");

// Country Info
const countryInfo = document.getElementById("dashboard-country-info");
// const dashboardCountryFlag = document.querySelector(".dashboard-country-flag");
// const dashboardCountryTitle = document.querySelector(
//   ".dashboard-country-title",
// );

// Holidays
const holidaysSelection = document.getElementById("holidays-selection");
const holidaysContent = document.getElementById("holidays-content");

// Events
const eventsContent = document.getElementById("events-content");
const eventsSelection = document.getElementById("events-selection");

// Weather
const weatherContent = document.getElementById("weather-content");
const weatherSelection = document.getElementById("weather-selection");

// Long Weekends
const lwContent = document.getElementById("lw-content");
const lwSelection = document.querySelector(
  "#long-weekends-view .view-header-selection",
);

// Saved Plans
const plansContent = document.getElementById("plans-content");
const clearAllPlansBtn = document.getElementById("clear-all-plans-btn");

// Update the time every minute in the header of the page
function updateTime() {
  const countryDateTime = document.getElementById("current-datetime");
  // Get the current date and time
  const now = new Date();

  // rules for formatting the date and time
  const formattingRules = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date and time according to the rules
  const finalTime = now.toLocaleString("en-US", formattingRules);

  countryDateTime.textContent = finalTime;
}
updateTime();
// repeat the updateTime function every 60 seconds (1 minute)
setInterval(updateTime, 60000);

// Set the dashboard to empty state when no country is selected
function setEmptyDashboard() {
  if (selectedDestination) {
    selectedDestination.style.display = "none";
  }

  if (countryInfo) {
    countryInfo.innerHTML = `
      <div class="country-info-placeholder">
        <div class="placeholder-icon">
          <i class="fa-solid fa-globe"></i>
        </div>
        <p>Select a country to view detailed information</p>
      </div>
    `;
  }
}

// Set the holiday to empty state when no country is selected
function setEmptyHolidays() {
  if (holidaysSelection) {
    holidaysSelection.style.display = "none";
  }

  if (holidaysContent) {
    holidaysContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-calendar-xmark"></i>
      </div>
      <h3>No Country Selected</h3>
      <p> Select a country from the dashboard to explore public holidays</p>
      <button class="btn btn-primary" onclick="document.querySelector('[data-view=\\'dashboard\\']').click()">
        <i class="fa-solid fa-globe"></i>
        Go to Dashboard
      </button>
    </div>
  `;
    holidaysContent.style.display = "block";
  }
}

function setEmptyEvents() {
  if (eventsSelection !== null) {
    eventsSelection.style.display = "none";
  }

  if (eventsContent !== null) {
    eventsContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-ticket"></i>
        </div>
        <h3>No City Selected</h3>
        <p>Select a country and city from the dashboard to discover events</p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-view=\\'dashboard\\']').click()">
          <i class="fa-solid fa-globe"></i>
          Go to Dashboard
        </button>
      </div>
    `;

    eventsContent.style.display = "block";
  }
}

function setEmptyWeather() {
  if (weatherSelection !== null) {
    weatherSelection.style.display = "none";
  }

  if (weatherContent !== null) {
    weatherContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-cloud-question"></i>
        </div>
        <h3>No City Selected</h3>
        <p>Select a country and city from the dashboard to see the weather forecast</p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-view=\\'dashboard\\']').click()">
          <i class="fa-solid fa-globe"></i>
          Go to Dashboard
        </button>
      </div>
    `;

    weatherContent.style.display = "block";
  }
}

function setEmptyLongWeekends() {
  if (lwSelection !== null) {
    lwSelection.style.display = "none";
  }

  if (lwContent !== null) {
    lwContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-umbrella-beach"></i></div>
        <h3>No Country Selected</h3>
        <p>Select a country from the dashboard to discover long weekend opportunities</p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-view=\\'dashboard\\']').click()">
          <i class="fa-solid fa-globe"></i>
          Go to Dashboard
        </button>
      </div>
    `;

    lwContent.style.display = "block";
  }
}
setEmptyHolidays();
setEmptyDashboard();
setEmptyEvents();
setEmptyWeather();
setEmptyLongWeekends();

// Switch between sections based on the clicked nav item
function showSections() {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view");

  for (let i = 0; i < navItems.length; i++) {
    const item = navItems[i];

    item.addEventListener("click", function (e) {
      e.preventDefault();

      // remove "active" class from all nav items
      for (let j = 0; j < navItems.length; j++) {
        navItems[j].classList.remove("active");
      }

      // add "active" class to the clicked nav item
      item.classList.add("active");

      // remove "active" class from all views
      for (let k = 0; k < views.length; k++) {
        views[k].classList.remove("active");
      }

      // show the target view based on the clicked nav item and its data-view attribute
      const targetId = item.getAttribute("data-view") + "-view";
      document.getElementById(targetId).classList.add("active");

      if (item.getAttribute("data-view") === "events") {
        if (selectedData.city) {
          getEvents();
        } else {
          setEmptyEvents();
        }
      }
    });
  }
}

// Show the loading overlay icon when getting data from the API
function showLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (show) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

const API_KEY = "rc_live_4e13125c9f8340768c97acea10c97b55";

const NAGER_BASE_URL = "https://date.nager.at/api/v3";
// const REST_COUNTRIES_BASE_URL = "https://api.restcountries.com/countries/v5";
const REST_COUNTRIES_BASE_URL =
  "https://api.restcountries.com/countries/v5?response_fields_omit=names.translations&limit=1&pretty=1&q=";

const selectedData = {
  countryCode: null,
  countryName: null,
  city: null,
  year: new Date().getFullYear(),

  countryData: null,

  latitude: null,
  longitude: null,

  holidays: [],
  events: [],
  weather: [],
  longWeekends: [],
  savedPlans: [],
};

// Get the list of countries from the Nager API
async function getCountries() {
  try {
    const response = await fetch(`${NAGER_BASE_URL}/AvailableCountries`);
    const countries = await response.json();

    countrySelect.innerHTML = '<option value="">Select Country</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';

    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.countryCode;
      option.textContent = `${country.name}`;

      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading countries:", error);
    countrySelect.innerHTML =
      '<option value="">Failed to load countries</option>';
  }
}

async function changeCountry() {
  const countryCode = countrySelect.value;
  const countryName = countrySelect.options[countrySelect.selectedIndex].text;

  selectedData.countryCode = countryCode;
  selectedData.countryName = countryName;

  if (countryCode === "") {
    citySelect.innerHTML = '<option value="">No city data available</option>';
    selectedData.countryData = null;
    selectedData.city = null;
    return;
  }

  showLoading(true);

  try {
    const url = `${REST_COUNTRIES_BASE_URL}${encodeURIComponent(countryName)}`;
    // const url = `${REST_COUNTRIES_BASE_URL}${countryName}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    // selectedData.countryData = data[0];
    // selectedData.countryData = data.data.objects[0];
    const countryData = data.data.objects[0];

    selectedData.countryData = countryData;

    selectedData.latitude = countryData.coordinates.lat;
    selectedData.longitude = countryData.coordinates.lng;

    displayCity(countryData);

    console.log(countryData);
    // displayCity(selectedData.countryData);

    updateSelectedDestination();

    console.log(data);

    showLoading(false);
  } catch (error) {
    console.error("Error loading country details:", error);
    showLoading(false);
  }
}

function displayCity(countryData) {
  if (countryData && countryData.capitals && countryData.capitals.length > 0) {
    const capitalCity = countryData.capitals[0].name;

    citySelect.innerHTML = `<option value="${capitalCity}">${capitalCity}</option>`;

    selectedData.city = capitalCity;
  } else {
    citySelect.innerHTML = '<option value="">No city data available</option>';
    selectedData.city = "";
  }
}

function updateSelectedDestination() {
  selectedDestination.style.display = "flex";

  selectedCountryName.textContent = selectedData.countryName;
  selectedCityName.textContent = selectedData.city;

  selectedCountryFlag.src = `https://flagcdn.com/w40/${selectedData.countryCode.toLowerCase()}.png`;
  selectedCountryFlag.alt = `${selectedData.countryName} Flag`;
}

function exploreDestination() {
  if (selectedData.countryCode === "") {
    showToast("Please select a country.", "error");
    return;
  }

  selectedData.city = citySelect.value;
  selectedData.year = yearSelect.value;

  updateSelectedDestination();
  getHolidays();
  getEvents();
  getWeather();
  getLongWeekends();
  displayCountryInfo();
}

function displayCountryInfo() {
  const country = selectedData.countryData;
  console.log(country);
  if (country === "") {
    return;
  }

  const capital =
    country.capitals && country.capitals.length > 0
      ? country.capitals[0].name
      : "No city data available";

  const officialName = country.names.official || "N/A";

  const region = country.region || "N/A";
  const subregion = country.subregion || "N/A";

  const population = country.population
    ? country.population.toLocaleString()
    : "N/A";

  const area = country.area ? country.area.kilometers.toLocaleString() : "N/A";

  const timeZones = country.timezones ? country.timezones.join(", ") : "N/A";

  const continent =
    country.continents && country.continents.length > 0
      ? country.continents[0]
      : "N/A";

  const callingCode =
    country.calling_codes && country.calling_codes.length > 0
      ? country.calling_codes[0]
      : "N/A";

  const drivingSide = country.cars ? country.cars.driving_side : "N/A";

  const weekStarts = country.date.start_of_week || "N/A";

  let currency = "N/A";
  if (country.currencies && country.currencies.length > 0) {
    currency = country.currencies
      .map((currency) => {
        return `${currency.name} (${currency.code})`;
      })
      .join(", ");
  }

  let language = "N/A";

  if (country.languages && country.languages.length > 0) {
    language = country.languages.map((language) => language.name).join(", ");
  }

  let Neighbors = '<span class="extra-tag">None</span>';

  if (country.borders && country.borders.length > 0) {
    Neighbors = country.borders
      .map((border) => {
        return `<span class="extra-tag border-tag">${border}</span>`;
      })
      .join("");
  }

  countryInfo.innerHTML = `
    <div class="dashboard-country-header">
      <img 
        src="https://flagcdn.com/w160/${selectedData.countryCode.toLowerCase()}.png" 
        alt="${selectedData.countryName}" 
        class="dashboard-country-flag"
      >
      <div class="dashboard-country-title">
        <h3>${selectedData.countryName}</h3>
        <p class="official-name">${officialName}</p>
        <span class="region">
          <i class="fa-solid fa-location-dot"></i> ${region}${subregion ? ` • ${subregion}` : ""}
        </span>
      </div>
    </div>
    
    <div class="dashboard-local-time">
      <div class="local-time-display">
        <i class="fa-solid fa-globe"></i>
        <span class="local-time-value">Timezones:</span>
        <span class="local-time-zone">${timeZones}</span>
      </div>
    </div>
    
    <div class="dashboard-country-grid">
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-building-columns"></i>
        <span class="label">Capital</span>
        <span class="value">${capital}</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-users"></i>
        <span class="label">Population</span>
        <span class="value">${population}</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-ruler-combined"></i>
        <span class="label">Area</span>
        <span class="value">${area} km²</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-globe"></i>
        <span class="label">Continent</span>
        <span class="value">${continent}</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-phone"></i>
        <span class="label">Calling Code</span>
        <span class="value">${callingCode}</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-car"></i>
        <span class="label">Driving Side</span>
        <span class="value" style="text-transform: capitalize;">${drivingSide}</span>
      </div>
      <div class="dashboard-country-detail">
        <i class="fa-solid fa-calendar-week"></i>
        <span class="label">Week Starts</span>
        <span class="value" style="text-transform: capitalize;">${weekStarts}</span>
      </div>
    </div>
    
    <div class="dashboard-country-extras">
      <div class="dashboard-country-extra">
        <h4><i class="fa-solid fa-coins"></i> Currency</h4>
        <div class="extra-tags">
          <span class="extra-tag">${currency}</span>
        </div>
      </div>
      <div class="dashboard-country-extra">
        <h4><i class="fa-solid fa-language"></i> Languages</h4>
        <div class="extra-tags">
          <span class="extra-tag">${language}</span>
        </div>
      </div>
      <div class="dashboard-country-extra">
        <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
        <div class="extra-tags">
          ${Neighbors}
        </div>
      </div>
    </div>
    
    <div class="dashboard-country-actions">
      <a href="${country.links?.google_maps || "#"}" target="_blank" class="btn-map-link">
        <i class="fa-solid fa-map"></i> View on Google Maps
      </a>
    </div>
  `;
}

// show holidays for selected country
async function getHolidays() {
  try {
    const url = `${NAGER_BASE_URL}/PublicHolidays/${selectedData.year}/${selectedData.countryCode}`;

    const response = await fetch(url);
    const holidays = await response.json();

    selectedData.holidays = holidays;
    // console.log("Holidays fetched successfully!", holidays);

    if (holidaysSelection !== null) {
      holidaysSelection.style.display = "flex";

      holidaysSelection.innerHTML = `
        <div class="current-selection-badge">
          <img 
            src="https://flagcdn.com/w40/${selectedData.countryCode.toLowerCase()}.png" 
            alt="${selectedData.countryName}" 
            class="selection-flag"
          >
          <span>${selectedData.countryName}</span>
          <span class="selection-year">${selectedData.year}</span>
        </div>
      `;
    }

    displayHolidays();
  } catch (error) {
    console.error("Error getting holidays:", error);
    if (holidaysContent !== null) {
      holidaysContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3>Error loading holidays</h3>
          <p>Please try again later.</p>
        </div>
      `;
    }
  }
}

// show Holiday Cards
function displayHolidays() {
  // Clear the html of empty state
  holidaysContent.innerHTML = "";
  holidaysContent.style.display = "";

  // Check if there are no holidays for this country
  if (!selectedData.holidays || selectedData.holidays.length === 0) {
    holidaysContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-calendar-xmark"></i>
        </div>
        <h3>No Holidays Found</h3>
        <p>No public holidays found</p>
      </div>
    `;
    holidaysContent.style.display = "block";
    return;
  }

  holidaysContent.innerHTML = selectedData.holidays
    .map((holiday, index) => {
      var date = new Date(holiday.date);

      var savedPlans = getSavedPlans();
      var isSaved = false;

      for (var j = 0; j < savedPlans.length; j++) {
        if (
          savedPlans[j].type === "holiday" &&
          savedPlans[j].date === holiday.date &&
          savedPlans[j].title === holiday.name
        ) {
          isSaved = true;
          break;
        }
      }

      return `
        <div class="holiday-card">
          <div class="holiday-card-header">
            <div class="holiday-date-box">
              <span class="day">${date.toLocaleString("en-US", { day: "numeric" })}</span>
              <span class="month">${date.toLocaleString("en-US", { month: "short" }).toUpperCase()}</span>
            </div>
            <button
              class="holiday-action-btn ${isSaved ? "saved" : ""}"
              data-holiday-index="${index}"
            >
              <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
          <h3>${holiday.localName}</h3>
          <p class="holiday-name">${holiday.name}</p>
          <div class="holiday-card-footer">
            <span class="holiday-day-badge">
              <i class="fa-regular fa-calendar"></i> ${date.toLocaleString("en-US", { weekday: "long" })}
            </span>
            <span class="holiday-type-badge">${holiday.types[0]}</span>
          </div>
        </div>
    `;
    })
    .join("");

  var saveButtons = document.querySelectorAll(".holiday-action-btn");

  // Add click event to each button
  for (var i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener("click", function () {
      var index = this.getAttribute("data-holiday-index");

      saveHoliday(selectedData.holidays[index]);
    });
  }
}

function saveHoliday(holiday) {
  var savedPlans = getSavedPlans();

  var plan = {
    id: "holiday-" + holiday.date + "-" + holiday.name,
    type: "holiday",
    title: holiday.name,
    localName: holiday.localName,
    date: holiday.date,
    location: selectedData.countryName,
    countryCode: holiday.countryCode,
  };

  var alreadySaved = false;

  for (var i = 0; i < savedPlans.length; i++) {
    if (savedPlans[i].id === plan.id) {
      alreadySaved = true;
      break;
    }
  }

  if (alreadySaved) {
    showToast("This holiday is already saved.", "info");
    return;
  }

  savedPlans.push(plan);

  localStorage.setItem("mySavedPlans", JSON.stringify(savedPlans));
  // showToast("Holiday saved successfully!", "success");
  displayHolidays();
}

// show Events for selected country
async function getEvents() {
  try {
    const TICKETMASTER_API_KEY = "VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y";

    const city = encodeURIComponent(selectedData.city);
    const countryCode = selectedData.countryCode;

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&city=${city}&countryCode=${countryCode}&size=20`;

    const response = await fetch(url);
    const data = await response.json();

    selectedData.events = data._embedded?.events || [];
    console.log("Events fetched successfully!", selectedData.events);

    if (eventsSelection !== null) {
      eventsSelection.style.display = "flex";

      eventsSelection.innerHTML = `
        <div class="current-selection-badge">
          <img 
            src="https://flagcdn.com/w40/${selectedData.countryCode.toLowerCase()}.png" 
            alt="${selectedData.countryName}" 
            class="selection-flag"
          >
          <span>${selectedData.countryName}</span>
          <span class="selection-city"> ${selectedData.city}</span>
        </div>
      `;
    }
    displayEvents();
  } catch (error) {
    console.error("Error getting events:", error);
    selectedData.events = [];

    displayEvents();
  }
}

function displayEvents() {
  eventsContent.style.display = "";

  // Check if there are no events for this country
  if (!selectedData.events || selectedData.events.length === 0) {
    eventsContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-ticket"></i>
        </div>
        <h3>No Events Found</h3>
        <p>No events found for ${selectedData.city}</p>
      </div>
    `;
    return;
  }

  const savedPlans = getSavedPlans();

  let eventsHTML = "";
  // eventsContent.innerHTML = "";
  for (let i = 0; i < selectedData.events.length; i++) {
    const event = selectedData.events[i];
    const eventName = event.name || "Unnamed Event";
    const eventDate = event.dates?.start?.localDate || "Date not available";
    const eventTime = event.dates?.start?.localTime || "";

    const eventImage =
      event.images && event.images.length > 0
        ? event.images[0].url
        : "https://via.placeholder.com/640x427?text=No+Image";

    const category =
      event.classifications &&
      event.classifications.length > 0 &&
      event.classifications[0].segment
        ? event.classifications[0].segment.name
        : "Event";

    const venue =
      event._embedded &&
      event._embedded.venues &&
      event._embedded.venues.length > 0
        ? event._embedded.venues[0].name
        : "Venue not available";

    const planId = `event-${event.id}`;
    const isSaved = savedPlans.some((plan) => plan.id === planId);
    const eventData = JSON.stringify(event).replace(/"/g, "&quot;");

    eventsHTML += `
        <div class="event-card">
          <div class="event-card-image">
            <img src="${eventImage}" alt="${eventName}"/>
            <span class="event-card-category">${category}</span>
            <button class="event-card-save ${isSaved ? "saved" : ""}" onclick="savePlan('event', ${eventData})">
              <i class="fa-${isSaved ? "solid" : "regular"} fa-heart"></i>
            </button>
          </div>
          <div class="event-card-body">
            <h3>${eventName}</h3>
            <div class="event-card-info">
              <div>
                <i class="fa-regular fa-calendar"></i>${eventDate} ${eventTime ? `at ${eventTime.substring(0, 5)}` : ""}
              </div>
              <div>
                <i class="fa-solid fa-location-dot"></i>${venue}
              </div>
            </div>
            <div class="event-card-footer">
              <button class="btn-event">
                <i class="fa-regular fa-heart"></i> Save
              </button>
              <a href="${event.url || "#"}" target="_blank" class="btn-buy-ticket"
                ><i class="fa-solid fa-ticket"></i> Buy Tickets</a
              >
            </div>
          </div>
        </div>
    `;
  }

  eventsContent.innerHTML = eventsHTML;
}

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

function getWeatherCondition(code) {
  if (code === 0)
    return {
      desc: "Clear sky",
      icon: "fa-sun",
      color: "#f59e0b",
      status: "weather-sunny",
    };
  if (code === 1)
    return {
      desc: "Mainly clear",
      icon: "fa-sun",
      color: "#f59e0b",
      status: "weather-sunny",
    };
  if (code === 2)
    return {
      desc: "Partly cloudy",
      icon: "fa-cloud-sun",
      color: "#94a3b8",
      status: "weather-cloudy",
    };
  if (code === 3)
    return {
      desc: "Overcast",
      icon: "fa-cloud",
      color: "#686d74",
      status: "weather-cloudy",
    };
  if (code === 45)
    return {
      desc: "Fog",
      icon: "fa-smog",
      color: "#94a3b8",
      status: "weather-foggy",
    };
  if (code === 48)
    return {
      desc: "Rime fog",
      icon: "fa-smog",
      color: "#94a3b8",
      status: "weather-foggy",
    };
  if (code === 51)
    return {
      desc: "Light drizzle",
      icon: "fa-cloud-rain",
      color: "#3067c0",
      status: "weather-rainy",
    };
  if (code === 53)
    return {
      desc: "Moderate drizzle",
      icon: "fa-cloud-rain",
      color: "#3067c0",
      status: "weather-rainy",
    };
  if (code === 55)
    return {
      desc: "Dense drizzle",
      icon: "fa-cloud-rain",
      color: "#3067c0",
      status: "weather-rainy",
    };
  if (code === 61)
    return {
      desc: "Slight rain",
      icon: "fa-cloud-showers-heavy",
      color: "#3067c0",
      status: "weather-rainy",
    };

  if (code === 63)
    return {
      desc: "Moderate rain",
      icon: "fa-cloud-showers-heavy",
      color: "#3067c0",
      status: "weather-rainy",
    };

  if (code === 65)
    return {
      desc: "Heavy rain",
      icon: "fa-cloud-showers-heavy",
      color: "#3067c0",
      status: "weather-rainy",
    };

  if (code === 71)
    return {
      desc: "Slight snow",
      icon: "fa-snowflake",
      color: "#bfdbfe",
      status: "weather-snowy",
    };

  if (code === 73)
    return {
      desc: "Moderate snow",
      icon: "fa-snowflake",
      color: "#93c5fd",
      status: "weather-snowy",
    };

  if (code === 75)
    return {
      desc: "Heavy snow",
      icon: "fa-snowflake",
      color: "#60a5fa",
      status: "weather-snowy",
    };

  if (code === 80)
    return {
      desc: "Slight rain showers",
      icon: "fa-cloud-rain",
      color: "#60a5fa",
      status: "weather-rainy",
    };

  if (code === 81)
    return {
      desc: "Moderate rain showers",
      icon: "fa-cloud-showers-heavy",
      color: "#3b82f6",
      status: "weather-rainy",
    };

  if (code === 82)
    return {
      desc: "Violent rain showers",
      icon: "fa-cloud-showers-heavy",
      color: "#2563eb",
      status: "weather-rainy",
    };

  if (code === 95)
    return {
      desc: "Slight thunderstorm",
      icon: "fa-bolt",
      color: "#eab308",
      status: "weather-stormy",
    };

  if (code === 96)
    return {
      desc: "Moderate thunderstorm with hail",
      icon: "fa-cloud-bolt",
      color: "#ca8a04",
      status: "weather-stormy",
    };

  if (code === 99)
    return {
      desc: "Heavy thunderstorm",
      icon: "fa-cloud-bolt",
      color: "#ca8a04",
      status: "weather-stormy",
    };

  return {
    desc: "Unknown",
    icon: "fa-cloud",
    color: "#94a3b8",
    status: "weather-default",
  };
}

async function getWeather() {
  if (
    selectedData.latitude === null ||
    selectedData.latitude === undefined ||
    selectedData.longitude === null ||
    selectedData.longitude === undefined
  ) {
    setEmptyWeather();
    return;
  }

  showLoading(true);

  try {
    const url =
      `${OPEN_METEO_BASE_URL}?latitude=${selectedData.latitude}` +
      `&longitude=${selectedData.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m` +
      `&hourly=temperature_2m,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
      `&timezone=auto` +
      `&forecast_days=7`;

    const response = await fetch(url);
    const data = await response.json();

    selectedData.weather = data;
    console.log("Weather fetched successfully!", selectedData.weather);

    if (weatherSelection !== null) {
      weatherSelection.style.display = "flex";
      weatherSelection.innerHTML = `
        <div class="current-selection-badge">
          <img 
            src="https://flagcdn.com/w40/${selectedData.countryCode.toLowerCase()}.png" 
            alt="${selectedData.countryName}" 
            class="selection-flag"
          >
          <span>${selectedData.countryName}</span>
          <span class="selection-city"> ${selectedData.city}</span>
        </div>
      `;
    }

    displayWeather();

    showLoading(false);
  } catch (error) {
    console.error("Error loading weather:", error);

    selectedData.weather = null;

    if (weatherContent !== null) {
      weatherContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-cloud-question"></i></div>
          <h3>Weather Unavailable</h3>
          <p>Could not load weather data</p>
        </div>
      `;
    }
    showLoading(false);
  }
}

function getWindDirection(degree) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degree / 45) % 8];
}

function getUvStatus(uv) {
  if (uv <= 2) return { text: "LOW", class: "low" };
  if (uv <= 5) return { text: "MODERATE", class: "moderate" };
  if (uv <= 7) return { text: "HIGH", class: "high" };
  if (uv <= 10) return { text: "VERY HIGH", class: "very-high" };
  return { text: "EXTREME", class: "extreme" };
}

function displayWeather() {
  const weather = selectedData.weather;
  weatherContent.style.display = "";

  if (!weather || !weather.current || !weather.daily) {
    setEmptyWeather();
    return;
  }

  const current = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;

  const weatherCondition = getWeatherCondition(current.weather_code);

  const windDirection = getWindDirection(current.wind_direction_10m);

  const todayUV = daily.uv_index_max ? daily.uv_index_max[0] : "N/A";
  const uvStatus = getUvStatus(todayUV);
  // const uvIndex = daily.uv_index_max[0];

  // const precipitationProbability = daily.precipitation_probability_max[0];
  const precipitationProbability =
    daily.precipitation_probability_max &&
    daily.precipitation_probability_max[0] !== undefined
      ? daily.precipitation_probability_max[0]
      : 0;

  const formattedDate = new Date(daily.time[0]).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const sunrise = daily.sunrise
    ? new Date(daily.sunrise[0]).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  const sunset = daily.sunset
    ? new Date(daily.sunset[0]).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  const weatherHTML = `
        <!-- Current Weather Hero -->
        <div class="weather-hero-card ${weatherCondition.status}">
          <div class="weather-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${selectedData.city}</span>
            <span class="weather-time">${formattedDate}</span>
          </div>
          <div class="weather-hero-main">
            <div class="weather-hero-left">
              <div class="weather-hero-icon">
                <i class="fa-solid ${weatherCondition.icon}" style="color: ${weatherCondition.color};"></i>
              </div>
              <div class="weather-hero-temp">
                <span class="temp-value">${Math.round(current.temperature_2m)}</span>
                <span class="temp-unit">°C</span>
              </div>
            </div>
            <div class="weather-hero-right">
              <div class="weather-condition">${weatherCondition.desc}</div>
              <div class="weather-feels">Feels like ${Math.round(current.apparent_temperature)}°C</div>
              <div class="weather-high-low">
                <span class="high"
                  ><i class="fa-solid fa-arrow-up"></i> ${Math.round(daily.temperature_2m_max[0])}°</span
                >
                <span class="low"
                  ><i class="fa-solid fa-arrow-down"></i> ${Math.round(daily.temperature_2m_min[0])}°</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Details Grid -->
        <div class="weather-details-grid">
          <div class="weather-detail-card">
            <div class="detail-icon humidity">
              <i class="fa-solid fa-droplet"></i>
            </div>
            <div class="detail-info">
              <span class="detail-label">Humidity</span>
              <span class="detail-value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-bar">
              <div class="detail-bar-fill" style="width: ${current.relative_humidity_2m}%"></div>
            </div>
          </div>
          
          <div class="weather-detail-card">
            <div class="detail-icon wind">
              <i class="fa-solid fa-wind"></i>
            </div>
            <div class="detail-info">
              <span class="detail-label">Wind</span>
              <span class="detail-value">${Math.round(current.wind_speed_10m)} km/h</span>
            </div>
            <div class="detail-extra">${windDirection}</div>
          </div>
          
          <div class="weather-detail-card">
            <div class="detail-icon uv">
              <i class="fa-solid fa-sun"></i>
            </div>
            <div class="detail-info">
              <span class="detail-label">UV Index</span>
              <span class="detail-value">${todayUV}</span>
            </div>
            <div class="detail-extra uv-level ${uvStatus.class}">${uvStatus.text}</div>
          </div>

          <div class="weather-detail-card">
            <div class="detail-icon precip">
              <i class="fa-solid fa-cloud-rain"></i>
            </div>
            <div class="detail-info">
              <span class="detail-label">Precipitation</span>
              <span class="detail-value">${precipitationProbability}%</span>
            </div>
            <div class="detail-extra">${current.precipitation}mm expected</div>
          </div>

          <div class="weather-detail-card sunrise-sunset">
            <div class="sun-times-visual">
              <div class="sun-time sunrise">
                <i class="fa-solid fa-sunrise"></i>
                <span class="sun-label">Sunrise</span>
                <span class="sun-value">${sunrise}</span>
              </div>
              <div class="sun-time sunset">
                <i class="fa-solid fa-sunset"></i>
                <span class="sun-label">Sunset</span>
                <span class="sun-value">${sunset}</span>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Hourly Forecast -->
        <div class="weather-section">
          <h3 class="weather-section-title">
            <i class="fa-solid fa-clock"></i> Hourly Forecast
          </h3>
          <div class="hourly-scroll">
            ${displayHourlyForecast(weather)}
          </div>
        </div>

        <!-- 7-Day Forecast -->
        <div class="weather-section">
          <h3 class="weather-section-title">
            <i class="fa-solid fa-calendar-week"></i> 7-Day Forecast
          </h3>
          <div class="forecast-list">
            ${displayDailyForecast(daily)}
          </div>
        </div>
  `;

  weatherContent.innerHTML = weatherHTML;
}

function displayHourlyForecast(weather) {
  const hourlyTimes = weather.hourly.time;
  const hourlyTemperatures = weather.hourly.temperature_2m;
  const hourlyCodes = weather.hourly.weather_code;

  const currentTime = new Date(weather.current.time);

  // Find the current hour
  let currentIndex = 0;

  for (let i = 0; i < hourlyTimes.length; i++) {
    const hourTime = new Date(hourlyTimes[i]);

    if (hourTime >= currentTime) {
      currentIndex = i;
      break;
    }
  }

  // Display 24 hours starting from Now
  let hourlyHTML = "";

  for (let i = currentIndex; i < currentIndex + 24; i++) {
    if (i >= hourlyTimes.length) {
      break;
    }

    const date = new Date(hourlyTimes[i]);
    const weatherInfo = getWeatherCondition(hourlyCodes[i]);

    let timeLabel;

    if (i === currentIndex) {
      timeLabel = "Now";
    } else {
      timeLabel = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    }

    hourlyHTML += `
      <div class="hourly-item ${i === currentIndex ? "now" : ""}">
        <span class="hourly-time">${timeLabel}</span>

        <div class="hourly-icon">
          <i 
            class="fa-solid ${weatherInfo.icon}"
            style="color: ${weatherInfo.color}"
          ></i>
        </div>

        <span class="hourly-temp">
          ${Math.round(hourlyTemperatures[i])}°
        </span>
      </div>
    `;
  }

  return hourlyHTML;
}

function displayDailyForecast(daily) {
  if (!daily || !daily.time) {
    return "";
  }

  let forecastHTML = "";

  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i]);

    const weatherInfo = getWeatherCondition(daily.weather_code[i]);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const dayDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });

    const isToday = i === 0;

    const precipitation =
      daily.precipitation_probability_max &&
      daily.precipitation_probability_max[i] !== undefined
        ? daily.precipitation_probability_max[i]
        : 0;

    forecastHTML += `
      <div class="forecast-day ${isToday ? "today" : ""}">

        <div class="forecast-day-name">
          <span class="day-label">
            ${isToday ? "Today" : dayName}
          </span>

          <span class="day-date">
            ${dayDate}
          </span>
        </div>

        <div class="forecast-icon">
          <i class="fa-solid ${weatherInfo.icon}"></i>
        </div>

        <div class="forecast-temps">
          <span class="temp-max">
            ${Math.round(daily.temperature_2m_max[i])}°
          </span>

          <span class="temp-min">
            ${Math.round(daily.temperature_2m_min[i])}°
          </span>
        </div>

        <div class="forecast-precip">
          ${
            precipitation > 0
              ? `
                <i class="fa-solid fa-droplet"></i>
                <span>${precipitation}%</span>
              `
              : ""
          }
        </div>

      </div>
    `;
  }

  return forecastHTML;
}

// show Long Weekends for selected country
async function getLongWeekends() {
  try {
    const url = `https://date.nager.at/api/v3/LongWeekend/${selectedData.year}/${selectedData.countryCode}`;

    const response = await fetch(url);

    if (!response.ok)
      throw new Error("Long weekends not found for this location/year");

    const data = await response.json();

    selectedData.longWeekends = data || [];

    console.log(
      "Long Weekends fetched successfully!",
      selectedData.longWeekends,
    );

    if (lwSelection) {
      lwSelection.style.display = "block";

      lwSelection.innerHTML = `
        <div class="current-selection-badge">
          <img 
            src="https://flagcdn.com/w40/${selectedData.countryCode.toLowerCase()}.png" 
            alt="${selectedData.countryName}" 
            class="selection-flag"
          >
          <span>${selectedData.countryName}</span>
          <span class="selection-year">${selectedData.year}</span>
        </div>
      `;
    }

    displayLongWeekends();
  } catch (error) {
    console.error("Error loading long weekends:", error);
    selectedData.longWeekends = [];
    displayLongWeekends();
  }
}

function displayLongWeekends() {
  if (!lwContent) return;
  lwContent.style.display = "";

  if (!selectedData.longWeekends || selectedData.longWeekends.length === 0) {
    lwContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-umbrella-beach"></i></div>
        <h3>No Long Weekends</h3>
        <p>No long weekends found for ${selectedData.countryName}.</p>
      </div>
    `;
    lwContent.style.display = "block";
    return;
  }

  const savedPlans = getSavedPlans();

  lwContent.innerHTML = selectedData.longWeekends
    .map((lw, index) => {
      const start = new Date(lw.startDate);
      const end = new Date(lw.endDate);

      const startFormat = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const endFormat = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const dateRange = `${startFormat} - ${endFormat}`;

      const isBridge = lw.needBridgeDay;
      const infoClass = isBridge ? "warning" : "success";
      const infoIcon = isBridge ? "fa-info-circle" : "fa-check-circle";
      const infoText = isBridge
        ? "Requires taking a bridge day off"
        : "No extra days off needed!";

      let visualDaysHTML = "";
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const dayName = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const dayNum = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? "weekend" : "";

        visualDaysHTML += `
        <div class="lw-day ${isWeekend}">
          <span class="name">${dayName}</span><span class="num">${dayNum}</span>
        </div>
      `;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const planId = `lw-${lw.startDate}-${lw.dayCount}`;
      const isSaved = savedPlans.some((plan) => plan.id === planId);
      const lwData = JSON.stringify(lw).replace(/"/g, "&quot;");

      return `
      <div class="lw-card">
        <div class="lw-card-header">
          <span class="lw-badge">
            <i class="fa-solid fa-calendar-days"></i> ${lw.dayCount} Days
          </span>
          <button class="holiday-action-btn ${isSaved ? "saved" : ""}" onclick="savePlan('long-weekend', ${lwData})">
            <i class="fa-${isSaved ? "solid" : "regular"} fa-heart"></i>
          </button>
        </div>
        
        <h3>Long Weekend #${index + 1}</h3>
        <div class="lw-dates">
          <i class="fa-regular fa-calendar"></i> ${dateRange}
        </div>
        <div class="lw-info-box ${infoClass}">
          <i class="fa-solid ${infoIcon}"></i> ${infoText}
        </div>
        <div class="lw-days-visual">
          ${visualDaysHTML}
        </div>
      </div>
    `;
    })
    .join("");
}

// Saved Plans
// LocalStorage key
// const PLANS_STORAGE_KEY = "mySavedPlans";

// Get Saved Plans from LocalStorage
function getSavedPlans() {
  return JSON.parse(localStorage.getItem("mySavedPlans")) || [];
}

function savePlan(type, item) {
  console.log("Type:", type);
  console.log("Item:", item);

  var savedPlans = getSavedPlans();

  var alreadySaved = false;

  for (var i = 0; i < savedPlans.length; i++) {
    if (
      savedPlans[i].type === type &&
      savedPlans[i].item.name === item.name &&
      savedPlans[i].item.date === item.date
    ) {
      alreadySaved = true;
      break;
    }
  }

  if (alreadySaved) {
    showToast("This item is already saved.", "info");
    return;
  }

  savedPlans.push({
    type: type,
    item: item,
  });

  localStorage.setItem("mySavedPlans", JSON.stringify(savedPlans));
  showToast("Saved successfully!", "success");

  console.log("Plan saved successfully!");
}

function displaySavedPlans() {
  var savedPlans = getSavedPlans();

  if (plansContent === null) {
    return;
  }

  if (savedPlans.length === 0) {
    plansContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-heart-crack"></i>
        </div>
        <h3>No Saved Plans Yet</h3>
        <p>
          Start exploring and save holidays, events, or long weekends
          you like!
        </p>
        <button class="btn-primary" id="start-exploring-btn">
          <i class="fa-solid fa-compass"></i>
          Start Exploring
        </button>
      </div>
    `;

    return;
  }

  var plansHTML = "";

  for (var i = 0; i < savedPlans.length; i++) {
    var plan = savedPlans[i];

    plansHTML += `
      <div class="plan-card">
        <span class="plan-card-type ${plan.type}">${plan.type}</span>
        <div class="plan-card-content">
          <h4>${plan.title}</h4>

          <div class="plan-card-details">
            <div><i class="fa-regular fa-calendar"></i>${plan.date}</div>
            <div><i class="fa-solid fa-location-dot"></i>${plan.location}</div>
          </div>
          
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deletePlan('${plan.id}')">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }

  plansContent.innerHTML = plansHTML;
}

function deletePlan(planId) {
  Swal.fire({
    title: "Remove Plan?",
    text: "Are you sure you want to remove this plan?",
    icon: "warning",
    showCancelButton: !0,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, remove it!",
    cancelButtonText: "Cancel",
  }).then(function (result) {
    if (result.isConfirmed) {
      var savedPlans = getSavedPlans();
      var updatedPlans = [];

      for (var i = 0; i < savedPlans.length; i++) {
        if (savedPlans[i].id !== planId) {
          updatedPlans.push(savedPlans[i]);
        }
      }

      localStorage.setItem("mySavedPlans", JSON.stringify(updatedPlans));

      displaySavedPlans();

      Swal.fire({
        title: "Removed!",
        text: "The plan has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

if (clearAllPlansBtn !== null) {
  clearAllPlansBtn.addEventListener("click", function () {
    var savedPlans = getSavedPlans();

    if (savedPlans.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Saved Plans",
        text: "There are no saved plans to clear.",
        confirmButtonText: "OK",
      });

      return;
    }

    Swal.fire({
      title: "Clear All Plans?",
      text: "This will permanently delete all your saved plans. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, clear all!",
      cancelButtonText: "Cancel",
    }).then(function (result) {
      if (result.isConfirmed) {
        localStorage.removeItem("mySavedPlans");

        displaySavedPlans();

        Swal.fire({
          title: "Cleared!",
          text: "All your plans have been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  });
}

// when the clear button (x) is clicked, return to the empty state
const clearBtn = document.getElementById("clear-selection-btn");
clearBtn.addEventListener("click", () => {
  countrySelect.value = "";
  citySelect.innerHTML = '<option value="">Select City</option>';

  // Clear the state
  selectedData.countryCode = null;
  selectedData.countryName = null;
  selectedData.city = null;
  selectedData.countryData = null;

  // Return to the empty state when NO country is selected
  setEmptyDashboard();
  setEmptyHolidays();
  setEmptyEvents();
  setEmptyWeather();
  setEmptyLongWeekends();
});

// Initialize the app
function loadApp() {
  showSections();
  getCountries();

  setEmptyDashboard();
  setEmptyHolidays();
  setEmptyEvents();
  setEmptyWeather();
  setEmptyLongWeekends();

  countrySelect.addEventListener("change", changeCountry);

  citySelect.addEventListener("change", () => {
    selectedData.city = citySelect.value;
    // selectedData.city = "New York";
  });

  yearSelect.addEventListener("change", () => {
    selectedData.year = yearSelect.value;
  });
  exploreBtn.addEventListener("click", exploreDestination);
}

document.addEventListener("DOMContentLoaded", loadApp);
