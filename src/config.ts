import {
    createCollapsibleMapControl,
    createElement,
    createEventPin,
    createRoutePin,
    MapConfig,
    MARKER_TYPE,
    NamespacedTag,
    parseGPXFromUrl,
    Route,
    Tours,
    TRANSPORT_TYPE,
    TravelEvent
} from './index.js';

const filenameRegex = /..\/resources\/(?<tourname>.*)\.gpx/;

enum Organizer {
    ZX = 'Z-ZX Club',
    EpicCarEvents = 'Epic Car Events',
    BelgiumZOwners = 'Belgium Z Owners',
    GT86Club = 'GT86 Club',
    '402Automotive' = '402 Automotive',
    JCS = 'Japan Classic Sunday',
    DatsunFrance = 'Datsun-France',
    CTDGermany = 'CTD Germany',
}

type Tag = NamespacedTag<{
    Organizer: `${Organizer}`,
    Markers: `${MARKER_TYPE}`,
    Transport: `${TRANSPORT_TYPE}`
}>

const eventsData: {date: Date, tags: Tag[], title: string, position: {lat: number, lng: number}, albumUrl?: string}[] = [
    {
        date: new Date('2021-10-10'),
        title: 'JapFest',
        albumUrl: 'https://photos.app.goo.gl/Nf712gXEFfuAWzPi6',
        position: {lat: 52.9583015, lng: 6.5197671},
        tags: [{namespace: 'Organizer', tag: '402 Automotive'}]
    }, {
        date: new Date('2022-07-03'),
        title: 'Japan Classic Sunday',
        albumUrl: 'https://photos.app.goo.gl/hugWZThwUM18fShh9',
        position: {lat: 51.573976, lng: 5.659092},
        tags: [{namespace: 'Organizer', tag: 'Japan Classic Sunday'}]
    }, {
        date: new Date('2023-07-02'),
        title: 'Japan Classic Sunday',
        albumUrl: 'https://photos.app.goo.gl/rnuKLQF1ddfF7ZQWA',
        position: {lat: 51.573976, lng: 5.661016},
        tags: [{namespace: 'Organizer', tag: 'Japan Classic Sunday'}]
    }, {
        date: new Date('2023-09-30'),
        title: 'GoJapan',
        albumUrl: 'https://photos.app.goo.gl/EsMhXLd7uAsB8NGx5',
        position: {lat: 51.714717, lng: 4.883165},
        tags: [{namespace: 'Organizer', tag: '402 Automotive'}]
    }, {
        date: new Date('2024-05-18'),
        title: 'SPA Classic',
        albumUrl: 'https://photos.app.goo.gl/cuPdMh7APGJ3AnSa9',
        position: {lat: 50.442965, lng: 5.970453},
        tags: [{namespace: 'Organizer', tag: 'Datsun-France'}]
    }, {
        date: new Date('2024-07-06'),
        title: 'CTD Summer Meet',
        albumUrl: 'https://photos.app.goo.gl/bSw33Cv9FAUcNwR3A',
        position: {lat: 51.638447, lng: 6.586215},
        tags: [{namespace: 'Organizer', tag: 'CTD Germany'}]
    }, {
        date: new Date('2024-07-07'),
        title: 'Japan Classic Sunday',
        albumUrl: 'https://photos.app.goo.gl/mQm1eXdhwBV5zMYn6',
        position: {lat: 51.612371, lng: 4.901104},
        tags: [{namespace: 'Organizer', tag: 'Japan Classic Sunday'}]
    }, {
        date: new Date('2025-03-01'),
        title: 'ALV',
        albumUrl: 'https://photos.app.goo.gl/b7FLGqfXh6EjhWsU9',
        position: {lat: 51.9416639, lng: 5.7633148},
        tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
    }, {
        date: new Date('2025-05-23'),
        title: 'SPA Classic',
        albumUrl: 'https://photos.app.goo.gl/Y3aFsSKgHiUAJ4A7A',
        position: {lat: 50.442965, lng: 5.970453 + 0.002},
        tags: [{namespace: 'Organizer', tag: 'Datsun-France'}]
    }, {
        date: new Date('2025-08-30'),
        title: 'Kofferbakverkoop',
        albumUrl: 'https://photos.app.goo.gl/haa2SzPKDhMsruEt5',
        position: {lat: 51.883364, lng: 5.531067},
        tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
    }, {
        date: new Date('2025-09-07'),
        title: 'GoJapan',
        albumUrl: 'https://photos.app.goo.gl/7e1PAGrkiDsYjSgR8',
        position: {lat: 51.714717, lng: 4.883165 + 0.002},
        tags: [{namespace: 'Organizer', tag: '402 Automotive'}]
    }
];
const events: TravelEvent<Tag>[] = eventsData.map(e => {
    e.tags = [...(e.tags ?? []),
        {namespace: 'Transport', tag: TRANSPORT_TYPE.CAR},
        {namespace: 'Markers', tag: MARKER_TYPE.EVENT},
    ];
    return e;
});

async function getRoutes(): Promise<Route<Tag>[]> {
    const routesData: (Omit<Route<Tag>, 'segments' | 'title'> & {segments: {file: string}[]})[] = [
        {
            segments: [{file: '../resources/2024-09 Z-ZX Club Noordpolderzijl - 1.gpx'}, {file: '../resources/2024-09 Z-ZX Club Noordpolderzijl - 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ufm6n9MrmAGWD7v16',
            date: new Date('2024-09-28'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2022-04 Z-ZX Club Bloesemrit.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2021-08 Japrun.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/vTPYVUSa8vuRc7xD8',
            date: new Date('2021-08-08'),
            tags: [{namespace: 'Organizer', tag: Organizer.EpicCarEvents}]
        }, {
            segments: [{file: '../resources/2021-07 Belgium Z Owners route 1.gpx'}, {file: '../resources/2021-07 Belgium Z Owners route 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/RcRxjayz5LrttUCV9',
            date: new Date('2021-07-10'),
            tags: [{namespace: 'Organizer', tag: Organizer.BelgiumZOwners}]
        }, {
            segments: [{file: '../resources/2021-09-18 Z-ZX Club Funpark Meppen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/t8RMNywBsVaNTmKQ7',
            date: new Date('2021-09-18'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 1.gpx'}, {file: '../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2022-06-12 Japrun.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/EzbnYyNSTbVnsMEx5',
            date: new Date('2022-06-12',),
            color: 'green',
            tags: [{namespace: 'Organizer', tag: Organizer.EpicCarEvents}]
        }, {
            segments: [{file: '../resources/2022-09 Z-ZX Club Zuid-Holland.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/J7hDeHaaavZBNfed6',
            date: new Date('2022-09-17'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2022-10 Z-ZX Club Coevorden.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AY5JFeMLGgAC5qBR8',
            date: new Date('2022-10-08'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2023-04-25 Nurburgring.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/s9zxWwGZYqJvkUVa7',
            date: new Date('2022-10-08'),
        }, {
            segments: [{file: '../resources/2023-06 Z-ZX Club Lottum.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/M9LuAb1JyFxrs6sT8',
            date: new Date('2023-06-18'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2023-09 Z-ZX Club kastelentocht.gpx'}, {file: '../resources/2023-09 Z-ZX Club kastelentocht zondag.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/LKB4ZQM5Q4erVRq68',
            date: new Date('2023-09-23'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2024-04 Z-ZX Club Tulpenrit 1.gpx'}, {file: '../resources/2024-04 Z-ZX Club Tulpenrit 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/sWDkWFf6RPj1Z3Ha6',
            date: new Date('2024-04-21'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2024-06 Dalfsen 1.gpx'}, {file: '../resources/2024-06 Dalfsen 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AWdHsYqPT63BHuyY7',
            date: new Date('2024-06-02'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2021-05_Z-ZX_Club_Dongen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/WuTqfw8ZXJSZze7MA',
            date: new Date('2021-05-15'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2022-06_Z-ZX_Club_Kersenrit_Beneden_Leeuwen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/8Zq268VVKrxyBMNK8',
            date: new Date('2022-06-26'),
            color: '#0000FF',
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2024-10-20 Z-ZX Club Halloweenroute.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/WBSydxj79piRoWWN8',
            date: new Date('2024-10-20'),
            color: '#8C0DD1',
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2025-04-11 Z-ZX Club Cas Lamens.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/CdpQE24XbUrx8Gss6',
            date: new Date('2025-04-12'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2025-05-18 Z-ZX Club Limburg - Het Witte Goud.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AFMq2V8vMZjw82WR6',
            date: new Date('2025-05-18'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2025-06-28 Z-ZX Club - Groesbeek.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/pmSpqN8TS7KY5VcUA',
            date: new Date('2025-06-29'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2025-08-24 GT86 BBQ.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/qcQcTvpuThJ9iaZ2A',
            date: new Date('2025-08-24'),
            tags: [{namespace: 'Organizer', tag: Organizer.GT86Club}]
        }, {
            segments: [{file: '../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 1.gpx'}, {file: '../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-17'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2025-10-19 Z-ZX Club Jubileum zondag 1.gpx'}, {file: '../resources/2025-10-19 Z-ZX Club Jubileum zondag 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-19'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2026-06-07 Z-ZX Club - Kastelenroute Noord-Brabant.gpx'}],
            // albumUrl: 'https://photos.app.goo.gl/gJpqzsbXrj5qoSEt7',
            date: new Date('2026-06-07'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }, {
            segments: [{file: '../resources/2026-05-12 ESAV Gravel Rallye 1.gpx'}, {file: '../resources/2026-05-12 ESAV Gravel Rallye 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/gJpqzsbXrj5qoSEt7',
            date: new Date('2026-05-12'),
            tags: [{namespace: 'Organizer', tag: Organizer.ZX}]
        }];
    return await Promise.all(routesData.map(async (route) => {
        let {segments, ...routeRest} = route;
        const defaultRouteTags: Tag[] = [
            {namespace: 'Markers', tag: MARKER_TYPE.ROUTE},
            {namespace: 'Transport', tag: TRANSPORT_TYPE.CAR},
        ];
        return {
            segments: await Promise.all(segments.map(async segment => {
                let {file, ...segmentRest} = segment;
                return {
                    path: await parseGPXFromUrl(file),
                    tags: [...route.tags ?? [], ...defaultRouteTags],
                    ...segmentRest
                }
            })),
            title: filenameRegex.exec(segments[0].file)?.groups?.tourname ?? 'Unknown',
            ...routeRest
        };
    }));
}

const config: MapConfig = {
    map: {
        zoom: 0,
        renderingType: 'VECTOR',
        isFractionalZoomEnabled: false,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0',
    },
    initialBounds: {
        // 50.657453, 7.047325
        // 3.076172,50.278809,7.371826,53.657661
        south: 50.2,
        east: 7.5,
        north: 53.7,
        west: 3.05
    },
    key: 'AIzaSyBSlX2Yz056seqJJ-c3cnzHHWap8SlV8NQ',
    filters: {
        minYear: 2016,
        maxYear: 2026,
    }
};

window.addEventListener('map-loaded', (event: CustomEventInit<{ map: google.maps.Map }>): void => {
    const map = event.detail?.map;
    if (!map) return;
    // Draw legend
    const legend = document.getElementById('legend')!;
    legend.append(
        createRoutePin("'XX"),
        createElement('span', {styles: {marginLeft: '12px'}, textContent: 'Pitstop in route'}),
        createElement('div'),
        createRoutePin('', true),
        createElement('span', {styles: {marginLeft: '12px'}, textContent: 'Planned stop in route'}),
        createElement('div'),
        createEventPin("'XX"),
        createElement('span', {styles: {marginLeft: '12px'}, textContent: 'Event in the year \'XX\''}),
        createElement('div', {classlist: ['legend-subtext'], textContent: '(Click marker to view photos)'})
    );

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(createCollapsibleMapControl(legend, 'legend', true));
});

getRoutes().then(routes => {
    new Tours(config, routes, events)
        .initializeGmaps();
})
