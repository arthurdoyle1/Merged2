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
