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
const dashboardCountryFlag = document.querySelector(".dashboard-country-flag");
const dashboardCountryTitle = document.querySelector(
  ".dashboard-country-title",
);

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

// Set the dashboard to an empty state when no country is selected
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

setEmptyDashboard();

// Switch between views sections based on the clicked nav item
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
    });
  }
}

// Show the loading overlay when getting data from the API
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
  holidays: [],
  events: [],
  weather: [],
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
    // const url = `${REST_COUNTRIES_BASE_URL}${encodeURIComponent(countryName)}`;
    const url = `${REST_COUNTRIES_BASE_URL}${countryName}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    // selectedData.countryData = data[0];
    selectedData.countryData = data.data.objects[0];

    displayCity(selectedData.countryData);

    // console.log(selectedData.countryData);

    updateSelectedDestination();

    console.log(data);

    showLoading(false);
  } catch (error) {
    console.error("Error loading country details:", error);
    showLoading(false);
  }
}

// function displayCity(countryData) {
//   if (countryData && countryData.capital) {
//     const capitalCity = countryData.capital[0];

//     citySelect.innerHTML = `<option value="${capitalCity}" selected>${capitalCity}</option>`;
//     selectedData.city = capitalCity;
//   } else {
//     citySelect.innerHTML = '<option value="">No city data available</option>';
//     selectedData.city = null;
//   }
// }
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
    alert("Please select a country.");
    return;
  }

  selectedData.city = citySelect.value;
  selectedData.year = yearSelect.value;

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

  let currencyText = "N/A";
  if (country.currencies && country.currencies.length > 0) {
    currencyText = country.currencies
      .map((currency) => {
        return `${currency.name} (${currency.code})`;
      })
      .join(", ");
  }

  let languageText = "N/A";

  if (country.languages && country.languages.length > 0) {
    languageText = country.languages
      .map((language) => language.name)
      .join(", ");
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
          <span class="extra-tag">${currencyText}</span>
        </div>
      </div>
      <div class="dashboard-country-extra">
        <h4><i class="fa-solid fa-language"></i> Languages</h4>
        <div class="extra-tags">
          <span class="extra-tag">${languageText}</span>
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

  // Return to the empty state when no country is selected
  setEmptyDashboard();
});

// Initialize the app
function loadApp() {
  showSections();
  getCountries();

  countrySelect.addEventListener("change", changeCountry);

  citySelect.addEventListener("change", () => {
    selectedData.city = citySelect.value;
  });

  yearSelect.addEventListener("change", () => {
    selectedData.year = yearSelect.value;
  });
  exploreBtn.addEventListener("click", exploreDestination);
}

document.addEventListener("DOMContentLoaded", loadApp);
