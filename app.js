// app.js
document.addEventListener('DOMContentLoaded', function() {
    mapboxgl.accessToken = config.mapboxAccessToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [170.4068, -14.9244],
        zoom: 5.5
    });

// Define global variables for data and filtered data
let geojsonData = {};
const filteredGeojson = {
    type: 'FeatureCollection',
    features: [],
};

function createPopup(currentFeature) {
    const popups = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popups[0]) popups[0].remove();
  
    const popupContent = document.createElement('div');
  
    // Heading line
    const headingBox = document.createElement('div');
    const popupHeading = currentFeature.properties['Diplomacy_category']; // Replace 'heading' with the actual property name
    headingBox.innerHTML = '<h2 style="font-weight: bold;">' + (popupHeading || 'Default Heading') + '</h2>';
    headingBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
    headingBox.style.paddingBottom = '10px'; // Adding padding
    popupContent.appendChild(headingBox);
  
    // Description line
    const descriptionBox = document.createElement('div');
    const popupDescription = currentFeature.properties['Comments']; // Replace 'description' with the actual property name
    descriptionBox.innerHTML = '<p>' + (popupDescription || 'Default Description') + '</p>';
    descriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
    descriptionBox.style.paddingBottom = '10px'; // Adding padding
    popupContent.appendChild(descriptionBox);
  
    // Three sets of two boxes on a line
    const categoryBox1 = document.createElement('div');
    const category1 = currentFeature.properties['Delivering_Country']; // Replace 'category1' with the actual property name
    categoryBox1.innerHTML = '<p><strong>Delivering Country</strong> ' + category1 + '</p>';
    categoryBox1.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
    popupContent.appendChild(categoryBox1);
  
    const categoryBox2 = document.createElement('div');
    const category2 = currentFeature.properties['Receiving_Countries']; // Replace 'category2' with the actual property name
    categoryBox2.innerHTML = '<p><strong>Receiving Country</strong> ' + category2 + '</p>';
    categoryBox2.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
    popupContent.appendChild(categoryBox2);
  
  // Final description box as a hyperlink
  const finalDescriptionBox = document.createElement('div');
  const finalDescription = currentFeature.properties['Source']; // Replace 'finalDescription' with the actual property name
  const finalDescriptionLink = currentFeature.properties['Source']; // Replace 'finalDescriptionLink' with the actual property name
  
  if (finalDescriptionLink !== undefined && finalDescriptionLink !== null) {
    finalDescriptionBox.innerHTML = '<p><strong>Source</strong> <a href="' + finalDescription + '" target="_blank" style="text-decoration: underline; color: blue;">' + (finalDescription || '') + '</a></p>';
    finalDescriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
    finalDescriptionBox.style.paddingBottom = '10px'; // Adding padding
    popupContent.appendChild(finalDescriptionBox);
  }
  
  // Styling for the popup content
  popupContent.style.border = '1px solid #ccc'; // Adding an overall border
  popupContent.style.padding = '10px'; // Adding padding
  popupContent.style.width = 'auto'; // Adjust the width as needed
  popupContent.style.height = 'auto'; // Adjust the height as needed
  
  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentFeature.geometry.coordinates)
    .setDOMContent(popupContent)
    .addTo(map);
  
  }

// Function to fly to a location
function flyToLocation(currentFeature) {
    map.flyTo({
        center: currentFeature,
        zoom: 14,
    });
}

function buildLocationList(locationData) {
    /* Add a new listing section to the sidebar. */
    const listings = document.getElementById('listings');
    listings.innerHTML = '';
    locationData.features.forEach((location, i) => {
      const prop = location.properties;
  
      const listing = listings.appendChild(document.createElement('div'));
      /* Assign a unique `id` to the listing. */
      listing.id = 'listing-' + prop.id;
  
      /* Assign the `item` class to each listing for styling. */
      listing.className = 'item';
  
      /* Add the link to the individual listing created above. */
      const link = listing.appendChild(document.createElement('button'));
      link.className = 'title';
      link.id = 'link-' + prop.id;
      link.innerHTML =
        '<p style="line-height: 1.25">' + prop[columnHeaders[0]] + '</p>';
  
      /* Add details to the individual listing. */
      const details = listing.appendChild(document.createElement('div'));
      details.className = 'content';
  
      for (let i = 1; i < columnHeaders.length; i++) {
        const div = document.createElement('div');
        div.innerText += prop[columnHeaders[i]];
        div.className;
        details.appendChild(div);
      }
  
      link.addEventListener('click', function () {
        const clickedListing = location.geometry.coordinates;
        flyToLocation(clickedListing);
        createPopup(location);
  
        const activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
  
        const divList = document.querySelectorAll('.content');
        const divCount = divList.length;
        for (i = 0; i < divCount; i++) {
          divList[i].style.maxHeight = null;
        }
  
        for (let i = 0; i < geojsonData.features.length; i++) {
          this.parentNode.classList.remove('active');
          this.classList.toggle('active');
          const content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    });
  }

  function buildDropDownList(title, listItems) {
    const filtersDiv = document.getElementById('filters');
    const mainDiv = document.createElement('div');
    const filterTitle = document.createElement('h3');
    filterTitle.innerText = title;
    filterTitle.classList.add('py12', 'txt-bold');
    mainDiv.appendChild(filterTitle);
  
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container', 'center');
  
    const dropDown = document.createElement('select');
    dropDown.classList.add('select', 'filter-option');
  
    const selectArrow = document.createElement('div');
    selectArrow.classList.add('select-arrow');
  
    const firstOption = document.createElement('option');
  
    dropDown.appendChild(firstOption);
    selectContainer.appendChild(dropDown);
    selectContainer.appendChild(selectArrow);
    mainDiv.appendChild(selectContainer);
  
    for (let i = 0; i < listItems.length; i++) {
      const opt = listItems[i];
      const el1 = document.createElement('option');
      el1.textContent = opt;
      el1.value = opt;
      dropDown.appendChild(el1);
    }
    filtersDiv.appendChild(mainDiv);
  }

// Build checkbox function
// title - the name or 'category' of the selection e.g. 'Languages: '
// listItems - the array of filter items
// To DO: Clean up code - for every third checkbox, create a div and append new checkboxes to it

function buildCheckbox(title, listItems) {
    const filtersDiv = document.getElementById('filters');
    const mainDiv = document.createElement('div');
    const filterTitle = document.createElement('div');
    const formatcontainer = document.createElement('div');
    filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
    formatcontainer.classList.add(
      'center',
      'flex-parent',
      'flex-parent--column',
      'px3',
      'flex-parent--space-between-main',
    );
    const secondLine = document.createElement('div');
    secondLine.classList.add(
      'center',
      'flex-parent',
      'py12',
      'px3',
      'flex-parent--space-between-main',
    );
    filterTitle.innerText = title;
    mainDiv.appendChild(filterTitle);
    mainDiv.appendChild(formatcontainer);
  
    for (let i = 0; i < listItems.length; i++) {
      const container = document.createElement('label');
  
      container.classList.add('checkbox-container');
  
      const input = document.createElement('input');
      input.classList.add('px12', 'filter-option');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', listItems[i]);
      input.setAttribute('value', listItems[i]);
  
      const checkboxDiv = document.createElement('div');
      const inputValue = document.createElement('p');
      inputValue.innerText = listItems[i];
      checkboxDiv.classList.add('checkbox', 'mr6');
      checkboxDiv.appendChild(Assembly.createIcon('check'));
  
      container.appendChild(input);
      container.appendChild(checkboxDiv);
      container.appendChild(inputValue);
  
      formatcontainer.appendChild(container);
    }
    filtersDiv.appendChild(mainDiv);
  }

// Initialize filters
function initializeFilters() {
    // Assuming config.filters is defined in your config file
    const filterSettings = config.filters;
    filterSettings.forEach((filter) => {
        if (filter.type === 'checkbox') {
            buildCheckbox(filter.title, filter.listItems);
        } else if (filter.type === 'dropdown') {
            buildDropDownList(filter.title, filter.listItems);
        }
    });
}
map.on('load', function() {
    // Load GeoJSON data from a file or API
    fetch('.collisions1601.geojson')
        .then(response => response.json())
        .then(data => {
            geojsonData = data;

            // Add the source and layer for the GeoJSON data
            map.addSource('geojsonSource', {
                type: 'geojson',
                data: geojsonData
            });

            map.addLayer({
                id: 'collisions',
                type: 'circle',
                source: 'geojsonSource',
                // ... rest of the layer properties ...
            });

            // Initialize the filters after the map and data are loaded
            initializeFilters();
        });
});




    map.on('load', () => {
        map.addLayer({
            id: 'collisions',
            type: 'circle',
            source: {
                type: 'geojson',
                data: './collisions1601.geojson'
            },
            paint: {
                'circle-radius': 7,
                'circle-color': [
                    'match',
                    ['get', 'Diplomacy_category'],
                    'Arms control', '#3D2E5D',
                    'Cultural Diplomacy (Defence)', '#3D2E5D',
                    // ... More color mappings ...
                    '#808080'
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.7,
            },
            filter: ['==', ['number', ['get', 'Year']], 2020]
        });

        map.on('click', 'collisions', (e) => {
            if (e.features.length > 0) {
                const clickedFeature = e.features[0];
                createPopup(clickedFeature);
            }
        });
    });

    function createPopup(currentFeature) {
        const popups = document.getElementsByClassName('mapboxgl-popup');
        /** Check if there is already a popup on the map and if so, remove it */
        if (popups[0]) popups[0].remove();
      
        const popupContent = document.createElement('div');
      
        // Heading line
        const headingBox = document.createElement('div');
        const popupHeading = currentFeature.properties['Diplomacy_category']; // Replace 'heading' with the actual property name
        headingBox.innerHTML = '<h2 style="font-weight: bold;">' + (popupHeading || 'Default Heading') + '</h2>';
        headingBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
        headingBox.style.paddingBottom = '10px'; // Adding padding
        popupContent.appendChild(headingBox);
      
        // Description line
        const descriptionBox = document.createElement('div');
        const popupDescription = currentFeature.properties['Comments']; // Replace 'description' with the actual property name
        descriptionBox.innerHTML = '<p>' + (popupDescription || 'Default Description') + '</p>';
        descriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
        descriptionBox.style.paddingBottom = '10px'; // Adding padding
        popupContent.appendChild(descriptionBox);
      
        // Three sets of two boxes on a line
        const categoryBox1 = document.createElement('div');
        const category1 = currentFeature.properties['Delivering_Country']; // Replace 'category1' with the actual property name
        categoryBox1.innerHTML = '<p><strong>Delivering Country</strong> ' + category1 + '</p>';
        categoryBox1.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
        popupContent.appendChild(categoryBox1);
      
        const categoryBox2 = document.createElement('div');
        const category2 = currentFeature.properties['Receiving_Countries']; // Replace 'category2' with the actual property name
        categoryBox2.innerHTML = '<p><strong>Receiving Country</strong> ' + category2 + '</p>';
        categoryBox2.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
        popupContent.appendChild(categoryBox2);
      
      // Final description box as a hyperlink
      const finalDescriptionBox = document.createElement('div');
      const finalDescription = currentFeature.properties['Source']; // Replace 'finalDescription' with the actual property name
      const finalDescriptionLink = currentFeature.properties['Source']; // Replace 'finalDescriptionLink' with the actual property name
      
      if (finalDescriptionLink !== undefined && finalDescriptionLink !== null) {
        finalDescriptionBox.innerHTML = '<p><strong>Source</strong> <a href="' + finalDescription + '" target="_blank" style="text-decoration: underline; color: blue;">' + (finalDescription || '') + '</a></p>';
        finalDescriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
        finalDescriptionBox.style.paddingBottom = '10px'; // Adding padding
        popupContent.appendChild(finalDescriptionBox);
      }
      
      // Styling for the popup content
      popupContent.style.border = '1px solid #ccc'; // Adding an overall border
      popupContent.style.padding = '10px'; // Adding padding
      popupContent.style.width = 'auto'; // Adjust the width as needed
      popupContent.style.height = 'auto'; // Adjust the height as needed
      
      new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(currentFeature.geometry.coordinates)
        .setDOMContent(popupContent)
        .addTo(map);
      
      }


    document.getElementById('slider').addEventListener('input', (event) => {
        const year = parseInt(event.target.value);
        document.getElementById('active-year').innerText = year;
        map.setFilter('collisions', ['==', ['number', ['get', 'Year']], year]);
    });

    document.getElementById('show-all-years').addEventListener('change', (event) => {
        const year = parseInt(document.getElementById('slider').value);
        const showAllYears = event.target.checked;
        document.getElementById('active-year').innerText = showAllYears ? 'All Years' : year;
        map.setFilter('collisions', showAllYears ? null : ['==', ['number', ['get', 'Year']], year]);
    });
});
