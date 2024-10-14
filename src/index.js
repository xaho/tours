async function parseTour(url) {
    const routeXml = await (await fetch(url)).text();
    const parser = new DOMParser();
    const route = parser.parseFromString(routeXml, 'text/xml');
    return Array.from(route.querySelectorAll('trk > trkseg > trkpt')).map(point => {
        return {lng: +point.getAttribute('lon'), lat: +point.getAttribute('lat')};
    });
}

window.initMap = async function () {
    const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker');
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0'
    });

    async function loadGpxToGmaps({files, albumUrl, date, color = '#FF0000'}) {
        for (const file of files) {
            const path = (await parseTour(file));
            new google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
            }).setMap(map);
            const marker = new AdvancedMarkerElement({
                map,
                position: path[0],
                title: /src\/(?<tourname>.*)\.gpx/.exec(file).groups.tourname,
                content: new PinElement({
                    glyph: "'" + (new Date(date).getFullYear() - 2000),
                    glyphColor: 'white',
                }).element,
                gmpClickable: !!albumUrl,
            });
            if (albumUrl) {
                marker.addListener('click', () => window.open(albumUrl, '_blank'));
            }
        }
    }

    async function addEventToMap({title, date, albumUrl, position}) {
        const marker = new AdvancedMarkerElement({
            map,
            position,
            title,
            content: new PinElement({
                glyph: "'" + (new Date(date).getFullYear() - 2000),
                background: '#1965C4',
                glyphColor: 'white',
                borderColor: '#1965C4'
            }).element
        });

        if (albumUrl) {
            marker.addListener('click', () => window.open(albumUrl, '_blank'));
        }
    }

    for (const event of [
        {date: '2021-10-10', title: 'JapFest', albumUrl: 'https://photos.app.goo.gl/Nf712gXEFfuAWzPi6', position: {lat: 52.9583015, lng: 6.5197671}},
        {date: '2022-07-03', title: 'Japan Classic Sunday', albumUrl: 'https://photos.app.goo.gl/hugWZThwUM18fShh9', position: {lat: 51.573976, lng: 5.659092}},
        {date: '2023-07-02', title: 'Japan Classic Sunday', albumUrl: 'https://photos.app.goo.gl/rnuKLQF1ddfF7ZQWA', position: {lat: 51.573976, lng: 5.661016}},
        {date: '2023-09-30', title: 'GoJapan', albumUrl: 'https://photos.app.goo.gl/EsMhXLd7uAsB8NGx5', position: {lat: 51.714717, lng: 4.883165}},
        {date: '2024-05-18', title: 'SPA Classic', albumUrl: 'https://photos.app.goo.gl/cuPdMh7APGJ3AnSa9', position: {lat: 50.442965, lng: 5.970453}},
        {date: '2024-07-06', title: 'CTD Summer Meet', albumUrl: 'https://photos.app.goo.gl/bSw33Cv9FAUcNwR3A', position: {lat: 51.638447, lng: 6.586215}},
        {date: '2024-07-07', title: 'Japan Classic Sunday', albumUrl: 'https://photos.app.goo.gl/mQm1eXdhwBV5zMYn6', position: {lat: 51.612371, lng: 4.901104}},
    ]) {
        await addEventToMap(event);
    }
    for (const route of [{
        files: ['src/2024-09 Z-ZX Club Noordpolderzijl - 1.gpx', 'src/2024-09 Z-ZX Club Noordpolderzijl - 2.gpx'],
        albumUrl: 'https://photos.app.goo.gl/ufm6n9MrmAGWD7v16',
        date: '2024-09-28'
    }, {
        files: ['src/2022-04 Z-ZX Club Bloesemrit.gpx'],
        albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
        date: '2022-04-24'
    }, {
        files: ['src/2021-08 Japrun.gpx'],
        albumUrl: 'https://photos.app.goo.gl/vTPYVUSa8vuRc7xD8',
        date: '2021-08-08'
    }, {
        files: ['src/2021-07 Belgium Z Owners route 1.gpx', 'src/2021-07 Belgium Z Owners route 2.gpx'],
        albumUrl: 'https://photos.app.goo.gl/RcRxjayz5LrttUCV9',
        date: '2021-07-10'
    }, {
        files: ['src/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 1.gpx', 'src/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 2.gpx'],
        albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
        date: '2022-04-24'
    }, {
        files: ['src/2022-06-12 Japrun.gpx'],
        albumUrl: 'https://photos.app.goo.gl/EzbnYyNSTbVnsMEx5',
        date: '2022-06-12',
        color: 'green'
    }, {
        files: ['src/2022-09 Z-ZX Club Zuid-Holland.gpx'],
        albumUrl: 'https://photos.app.goo.gl/J7hDeHaaavZBNfed6',
        date: '2022-09-17'
    }, {
        files: ['src/2022-10 Z-ZX Club Coevorden.gpx'],
        albumUrl: 'https://photos.app.goo.gl/AY5JFeMLGgAC5qBR8',
        date: '2022-10-08'
    }, {
        files: ['src/2023-04-25 Nurburgring.gpx'],
        albumUrl: 'https://photos.app.goo.gl/s9zxWwGZYqJvkUVa7',
        date: '2022-10-08'
    }, {
        files: ['src/2023-06 Z-ZX Club Lottum.gpx'],
        albumUrl: 'https://photos.app.goo.gl/M9LuAb1JyFxrs6sT8',
        date: '2023-06-18'
    }, {
        files: ['src/2023-09 Z-ZX Club kastelentocht.gpx', 'src/2023-09 Z-ZX Club kastelentocht zondag.gpx'],
        albumUrl: 'https://photos.app.goo.gl/LKB4ZQM5Q4erVRq68',
        date: '2023-09-23'
    }, {
        files: ['src/2024-04 Z-ZX Club Tulpenrit.gpx'],
        albumUrl: 'https://photos.app.goo.gl/sWDkWFf6RPj1Z3Ha6',
        date: '2024-04-21'
    }, {
        files: ['src/2024-06 Dalfsen 1.gpx', 'src/2024-06 Dalfsen 2.gpx'],
        albumUrl: 'https://photos.app.goo.gl/AWdHsYqPT63BHuyY7',
        date: '2024-06-02'
    }, {
        files: ['src/2021-05_Z-ZX_Club_Dongen.gpx'],
        albumUrl: 'https://photos.app.goo.gl/WuTqfw8ZXJSZze7MA',
        date: '2021-05-15'
    }, {
        files: ['src/2022-06_Z-ZX_Club_Kersenrit_Beneden_Leeuwen.gpx'],
        albumUrl: 'https://photos.app.goo.gl/8Zq268VVKrxyBMNK8',
        date: '2022-06-26',
        color: '#0000FF'
    }]) {
        await loadGpxToGmaps(route);
    }
};