const input = document.getElementById('country-input');
const button = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    countryName = countryName.trim();

    if (!countryName){

    
        countryInfo.classList.add('hidden');
        borderSection.classList.add('hidden');
        borderSection.innerHTML = '';
        errorMessage.textContent = 'Please enter a country name.';
        errorMessage.classList.remove('hidden');
     return;
    }
    try {
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderSection.classList.add('hidden');
        borderSection.innerHTML = '';

        // Show loading spinner
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

         // Update DOM
        document.getElementById('country-info').innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag">
`;

        countryInfo.classList.remove('hidden');

        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];
        // Update bordering countries section
                const borderDiv = document.createElement('div');
                borderDiv.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;
                borderSection.appendChild(borderDiv);
            }

            borderSection.classList.remove('hidden');
        }

    } catch (error) {
        // Show error message
        errorMessage.textContent = 'Unable to fetch country data. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide spinner
        spinner.classList.add('hidden');
    }
}
button.addEventListener('click', () => {
    searchCountry(input.value.trim());
});
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(input.value.trim());
    }
});