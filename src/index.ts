/// <reference types="@types/google.maps" />
/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />

async function parseTour(url: string) {
    const routeXml = await (await fetch(url)).text();
    const parser = new DOMParser();
    const route = parser.parseFromString(routeXml, 'text/xml');
    return Array.from(route.querySelectorAll('trk > trkseg > trkpt')).map(point => {
        return {lng: +point.getAttribute('lon')!, lat: +point.getAttribute('lat')!};
    });
}

async function initMap() {
    const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker');
    const elements: {
        markers: { element: HTMLElement, date: Date, type: string }[],
        lines: { element: google.maps.Polyline, date: Date, type: string }[]
    } = {markers: [], lines: []};

    function createRoutePin(text: string, pitstop = false) {
        return new PinElement({
            glyphText: pitstop ? undefined : text,
            glyphColor: pitstop ? undefined : 'white',
        }).element;
    }

    function createEventPin(text: string) {
        return new PinElement({
            glyphText: text,
            background: '#1965C4',
            glyphColor: 'white',
            borderColor: '#1965C4'
        }).element;
    }

    const map: google.maps.Map = new google.maps.Map(document.getElementById('map')!, {
        zoom: 8,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0'
    });

    // Draw legend
    const legend = document.getElementById('legend')!;
    const redPin = createRoutePin("'XX");
    redPin.style.display = 'inline-block';
    let div = document.createElement('div');
    div.innerHTML = `${redPin.outerHTML}<span>Tour in the year 'XX</span>`;
    legend.appendChild(div);

    const pitstopPin = createRoutePin('', true);
    pitstopPin.style.display = 'inline-block';
    div = document.createElement('div');
    div.innerHTML = `${pitstopPin.outerHTML}<span>Planned stop in route</span>`;
    legend.appendChild(div);

    const bluePin = createEventPin("'XX");
    bluePin.style.display = 'inline-block';
    div = document.createElement('div');
    div.innerHTML = `${bluePin.outerHTML}<span>Event in the year 'XX</span>`;
    legend.appendChild(div);
    div = document.createElement('div');
    div.classList.add('legend-subtext');
    div.innerHTML = '(Click marker to view photos)';
    legend.appendChild(div);

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

    async function loadGpxToGmaps({files, albumUrl, date, type = '', color = '#FF0000'}: {
        files: string[],
        albumUrl: string,
        date: Date,
        type: string,
        color?: string
    }) {
        const elements: {
            markers: { element: HTMLElement, date: Date, type: string }[],
            lines: { element: google.maps.Polyline, date: Date, type: string }[]
        } = {markers: [], lines: []};
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const path = (await parseTour(file));
            const polyline = new google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: .6,
                strokeWeight: 3,
            });
            elements.lines.push({element: polyline, date: date, type});
            polyline.setMap(map);
            polyline.set('originalColor', color);
            google.maps.event.addListener(polyline, 'mouseover', () => {
                polyline.setOptions({strokeColor: '#1493FF', zIndex: 1, strokeOpacity: 1});
            });
            google.maps.event.addListener(polyline, 'mouseout', () => {
                polyline.setOptions({strokeColor: polyline.get('originalColor'), zIndex: 0, strokeOpacity: .6});
            });
            const markerContent = createRoutePin("'" + (new Date(date).getFullYear() - 2000), i > 0);
            markerContent.onmouseenter = function (event: MouseEvent) {
                polyline.setOptions({strokeColor: '#1493FF', zIndex: 1, strokeOpacity: 1});
                event.stopPropagation();
                event.preventDefault();
            };
            markerContent.onmouseleave = function (event: MouseEvent) {
                polyline.setOptions({strokeColor: polyline.get('originalColor'), zIndex: 0, strokeOpacity: .6});
                event.stopPropagation();
                event.preventDefault();
            };
            const marker = new AdvancedMarkerElement({
                map,
                position: path[0],
                title: /..\/resources\/(?<tourname>.*)\.gpx/.exec(file)?.groups?.tourname,
                content: markerContent,
                gmpClickable: !!albumUrl,
                zIndex: 1 - i
            });
            if (albumUrl) {
                marker.addListener('click', () => window.open(albumUrl, '_blank'));
            }
            elements.markers.push({element: marker, date: new Date(date), type});
        }
        return elements;
    }

    async function addEventToMap({title, date, albumUrl, position, type}: {
        title: string,
        date: Date,
        albumUrl: string,
        position: { lat: number, lng: number },
        type: string
    }) {
        const marker = new AdvancedMarkerElement({
            map,
            position,
            title,
            content: createEventPin("'" + (new Date(date).getFullYear() - 2000))
        });

        if (albumUrl) {
            marker.addListener('click', () => window.open(albumUrl, '_blank'));
        }
        return {element: marker, date: date, type};
    }

    for (const event of [
        {
            date: new Date('2021-10-10'),
            title: 'JapFest',
            albumUrl: 'https://photos.app.goo.gl/Nf712gXEFfuAWzPi6',
            position: {lat: 52.9583015, lng: 6.5197671}
        },
        {
            date: new Date('2022-07-03'),
            title: 'Japan Classic Sunday',
            albumUrl: 'https://photos.app.goo.gl/hugWZThwUM18fShh9',
            position: {lat: 51.573976, lng: 5.659092}
        },
        {
            date: new Date('2023-07-02'),
            title: 'Japan Classic Sunday',
            albumUrl: 'https://photos.app.goo.gl/rnuKLQF1ddfF7ZQWA',
            position: {lat: 51.573976, lng: 5.661016}
        },
        {
            date: new Date('2023-09-30'),
            title: 'GoJapan',
            albumUrl: 'https://photos.app.goo.gl/EsMhXLd7uAsB8NGx5',
            position: {lat: 51.714717, lng: 4.883165}
        },
        {
            date: new Date('2024-05-18'),
            title: 'SPA Classic',
            albumUrl: 'https://photos.app.goo.gl/cuPdMh7APGJ3AnSa9',
            position: {lat: 50.442965, lng: 5.970453}
        },
        {
            date: new Date('2024-07-06'),
            title: 'CTD Summer Meet',
            albumUrl: 'https://photos.app.goo.gl/bSw33Cv9FAUcNwR3A',
            position: {lat: 51.638447, lng: 6.586215}
        },
        {
            date: new Date('2024-07-07'),
            title: 'Japan Classic Sunday',
            albumUrl: 'https://photos.app.goo.gl/mQm1eXdhwBV5zMYn6',
            position: {lat: 51.612371, lng: 4.901104}
        },
        {
            date: new Date('2025-03-01'),
            title: 'ALV',
            albumUrl: 'https://photos.app.goo.gl/b7FLGqfXh6EjhWsU9',
            position: {lat: 51.9416639, lng: 5.7633148}
        },
        {
            date: new Date('2025-05-23'),
            title: 'SPA Classic',
            albumUrl: 'https://photos.app.goo.gl/Y3aFsSKgHiUAJ4A7A',
            position: {lat: 50.442965, lng: 5.970453 + 0.002}
        },
        {
            date: new Date('2025-08-30'),
            title: 'Kofferbakverkoop',
            albumUrl: 'https://photos.app.goo.gl/haa2SzPKDhMsruEt5',
            position: {lat: 51.883364, lng: 5.531067}
        },
        {
            date: new Date('2025-09-07'),
            title: 'GoJapan',
            albumUrl: 'https://photos.app.goo.gl/7e1PAGrkiDsYjSgR8',
            position: {lat: 51.714717, lng: 4.883165 + 0.002}
        }
    ]) {
        elements.markers.push(await addEventToMap({...event, type: 'event'}));
    }
    for (const route of [
        {
            files: ['../resources/2024-09 Z-ZX Club Noordpolderzijl - 1.gpx', '../resources/2024-09 Z-ZX Club Noordpolderzijl - 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/ufm6n9MrmAGWD7v16',
            date: new Date('2024-09-28'),
        }, {
            files: ['../resources/2022-04 Z-ZX Club Bloesemrit.gpx'],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
        }, {
            files: ['../resources/2021-08 Japrun.gpx'],
            albumUrl: 'https://photos.app.goo.gl/vTPYVUSa8vuRc7xD8',
            date: new Date('2021-08-08'),
        }, {
            files: ['../resources/2021-07 Belgium Z Owners route 1.gpx', '../resources/2021-07 Belgium Z Owners route 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/RcRxjayz5LrttUCV9',
            date: new Date('2021-07-10'),
        }, {
            files: ['../resources/2021-09-18 Z-ZX Club Funpark Meppen.gpx'],
            albumUrl: 'https://photos.app.goo.gl/t8RMNywBsVaNTmKQ7',
            date: new Date('2021-09-18'),
        }, {
            files: ['../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 1.gpx', '../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
        }, {
            files: ['../resources/2022-06-12 Japrun.gpx'],
            albumUrl: 'https://photos.app.goo.gl/EzbnYyNSTbVnsMEx5',
            date: new Date('2022-06-12',),
            color: 'green'
        }, {
            files: ['../resources/2022-09 Z-ZX Club Zuid-Holland.gpx'],
            albumUrl: 'https://photos.app.goo.gl/J7hDeHaaavZBNfed6',
            date: new Date('2022-09-17'),
        }, {
            files: ['../resources/2022-10 Z-ZX Club Coevorden.gpx'],
            albumUrl: 'https://photos.app.goo.gl/AY5JFeMLGgAC5qBR8',
            date: new Date('2022-10-08'),
        }, {
            files: ['../resources/2023-04-25 Nurburgring.gpx'],
            albumUrl: 'https://photos.app.goo.gl/s9zxWwGZYqJvkUVa7',
            date: new Date('2022-10-08'),
        }, {
            files: ['../resources/2023-06 Z-ZX Club Lottum.gpx'],
            albumUrl: 'https://photos.app.goo.gl/M9LuAb1JyFxrs6sT8',
            date: new Date('2023-06-18'),
        }, {
            files: ['../resources/2023-09 Z-ZX Club kastelentocht.gpx', '../resources/2023-09 Z-ZX Club kastelentocht zondag.gpx'],
            albumUrl: 'https://photos.app.goo.gl/LKB4ZQM5Q4erVRq68',
            date: new Date('2023-09-23'),
        }, {
            files: ['../resources/2024-04 Z-ZX Club Tulpenrit 1.gpx', '../resources/2024-04 Z-ZX Club Tulpenrit 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/sWDkWFf6RPj1Z3Ha6',
            date: new Date('2024-04-21'),
        }, {
            files: ['../resources/2024-06 Dalfsen 1.gpx', '../resources/2024-06 Dalfsen 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/AWdHsYqPT63BHuyY7',
            date: new Date('2024-06-02'),
        }, {
            files: ['../resources/2021-05_Z-ZX_Club_Dongen.gpx'],
            albumUrl: 'https://photos.app.goo.gl/WuTqfw8ZXJSZze7MA',
            date: new Date('2021-05-15'),
        }, {
            files: ['../resources/2022-06_Z-ZX_Club_Kersenrit_Beneden_Leeuwen.gpx'],
            albumUrl: 'https://photos.app.goo.gl/8Zq268VVKrxyBMNK8',
            date: new Date('2022-06-26'),
            color: '#0000FF'
        }, {
            files: ['../resources/2024-10-20 Z-ZX Club Halloweenroute.gpx'],
            albumUrl: 'https://photos.app.goo.gl/WBSydxj79piRoWWN8',
            date: new Date('2024-10-20'),
            color: '#8C0DD1'
        }, {
            files: ['../resources/2025-04-11 Z-ZX Club Cas Lamens.gpx'],
            albumUrl: 'https://photos.app.goo.gl/CdpQE24XbUrx8Gss6',
            date: new Date('2025-04-12'),
        }, {
            files: ['../resources/2025-05-18 Z-ZX Club Limburg - Het Witte Goud.gpx'],
            albumUrl: 'https://photos.app.goo.gl/AFMq2V8vMZjw82WR6',
            date: new Date('2025-05-18'),
        }, {
            files: ['../resources/2025-06-28 Z-ZX Club - Groesbeek.gpx'],
            albumUrl: 'https://photos.app.goo.gl/pmSpqN8TS7KY5VcUA',
            date: new Date('2025-06-29'),
        }, {
            files: ['../resources/2025-08-24 GT86 BBQ.gpx'],
            albumUrl: 'https://photos.app.goo.gl/qcQcTvpuThJ9iaZ2A',
            date: new Date('2025-08-24'),
        }, {
            files: ['../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 1.gpx', '../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-17'),
        }, {
            files: ['../resources/2025-10-19 Z-ZX Club Jubileum zondag 1.gpx', '../resources/2025-10-19 Z-ZX Club Jubileum zondag 2.gpx'],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-19'),
        }]) {
        const {markers, lines} = await loadGpxToGmaps({...route, type: 'car'});
        elements.markers.push(...markers);
        elements.lines.push(...lines);
    }

    function createButton() {
        const controlButton = Object.assign(
            document.createElement('button'),
            {
                textContent: 'Center Map',
                title: 'Click to recenter the map',
            });
        controlButton.addEventListener('click', () => {
        });
        return controlButton;
    }

    const button = createButton();
    const filter = document.createElement('div');
    filter.id = 'filters';
    const input = document.createElement('p');
    input.id = 'amount';
    const slider = document.createElement('div');
    slider.id = 'slider-range';
    filter.append(button, input, slider);
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(filter);

    function updateAmount(lower: number, upper: number) {
        $(input).text(`${lower} - ${upper}`);
        // set visibility
        elements.markers.forEach(marker => {
            marker.element.style.visibility = marker.date.getFullYear() <= upper && marker.date.getFullYear() >= lower ?
                'visible' : 'hidden';
        });
        elements.lines.forEach(line => {
            line.element.setVisible(
                (line.date.getFullYear() <= upper && line.date.getFullYear() >= lower)
            );
        });
    }

    $(slider).slider({
        range: true,
        min: 2016,
        max: new Date().getFullYear(),
        values: [new Date().getFullYear(), new Date().getFullYear()],
        slide: function (event, ui) {
            updateAmount(ui.values?.[0] ?? 0, ui.values?.[1] ?? 0);
        }
    });
    updateAmount(new Date().getFullYear(), new Date().getFullYear());

    // Type filters
    // Determine options based on entries in elements array
}
