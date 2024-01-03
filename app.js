// app.js
document.addEventListener('DOMContentLoaded', function() {
    mapboxgl.accessToken = config.mapboxAccessToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [170.4068, -14.9244],
        zoom: 5.5
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
            const properties = e.features[0].properties;
            const year = properties.Year;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`Year: ${year}`)
                .addTo(map);
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
        updateMapYear(event.target.value);
    });

    document.getElementById('show-all-years').addEventListener('change', (event) => {
        updateMapYear(document.getElementById('slider').value, event.target.checked);
    });

    function updateMapYear(year, showAllYears = false) {
        year = parseInt(year);
        map.setFilter('collisions', showAllYears ? null : ['==', ['number', ['get', 'Year']], year]);
        document.getElementById('active-year').innerText = showAllYears ? 'All Years' : year;
    }
});
