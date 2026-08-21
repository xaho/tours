const filenameRegex = /..\/resources\/(?<tourname>.*)\.gpx/;

async function getRoutes(): Promise<Route[]> {
    return await Promise.all([
        {
            segments: [{file: '../resources/2024-09 Z-ZX Club Noordpolderzijl - 1.gpx'}, {file: '../resources/2024-09 Z-ZX Club Noordpolderzijl - 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ufm6n9MrmAGWD7v16',
            date: new Date('2024-09-28'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2022-04 Z-ZX Club Bloesemrit.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2021-08 Japrun.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/vTPYVUSa8vuRc7xD8',
            date: new Date('2021-08-08'),
            tags: [{namespace: 'Organizer', tag: 'Epic Car Events'}]
        }, {
            segments: [{file: '../resources/2021-07 Belgium Z Owners route 1.gpx'}, {file: '../resources/2021-07 Belgium Z Owners route 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/RcRxjayz5LrttUCV9',
            date: new Date('2021-07-10'),
            tags: [{namespace: 'Organizer', tag: 'Belgium Z Owners'}]
        }, {
            segments: [{file: '../resources/2021-09-18 Z-ZX Club Funpark Meppen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/t8RMNywBsVaNTmKQ7',
            date: new Date('2021-09-18'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 1.gpx'}, {file: '../resources/2022-04-24 Z-ZX Club Gooi- en Vechtstreek 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/mkJi1BNcH4f6yFNS9',
            date: new Date('2022-04-24'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2022-06-12 Japrun.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/EzbnYyNSTbVnsMEx5',
            date: new Date('2022-06-12',),
            color: 'green',
            tags: [{namespace: 'Organizer', tag: 'Epic Car Events'}]
        }, {
            segments: [{file: '../resources/2022-09 Z-ZX Club Zuid-Holland.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/J7hDeHaaavZBNfed6',
            date: new Date('2022-09-17'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2022-10 Z-ZX Club Coevorden.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AY5JFeMLGgAC5qBR8',
            date: new Date('2022-10-08'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2023-04-25 Nurburgring.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/s9zxWwGZYqJvkUVa7',
            date: new Date('2022-10-08'),
        }, {
            segments: [{file: '../resources/2023-06 Z-ZX Club Lottum.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/M9LuAb1JyFxrs6sT8',
            date: new Date('2023-06-18'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2023-09 Z-ZX Club kastelentocht.gpx'}, {file: '../resources/2023-09 Z-ZX Club kastelentocht zondag.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/LKB4ZQM5Q4erVRq68',
            date: new Date('2023-09-23'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2024-04 Z-ZX Club Tulpenrit 1.gpx'}, {file: '../resources/2024-04 Z-ZX Club Tulpenrit 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/sWDkWFf6RPj1Z3Ha6',
            date: new Date('2024-04-21'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2024-06 Dalfsen 1.gpx'}, {file: '../resources/2024-06 Dalfsen 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AWdHsYqPT63BHuyY7',
            date: new Date('2024-06-02'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2021-05_Z-ZX_Club_Dongen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/WuTqfw8ZXJSZze7MA',
            date: new Date('2021-05-15'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2022-06_Z-ZX_Club_Kersenrit_Beneden_Leeuwen.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/8Zq268VVKrxyBMNK8',
            date: new Date('2022-06-26'),
            color: '#0000FF',
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2024-10-20 Z-ZX Club Halloweenroute.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/WBSydxj79piRoWWN8',
            date: new Date('2024-10-20'),
            color: '#8C0DD1',
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2025-04-11 Z-ZX Club Cas Lamens.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/CdpQE24XbUrx8Gss6',
            date: new Date('2025-04-12'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2025-05-18 Z-ZX Club Limburg - Het Witte Goud.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/AFMq2V8vMZjw82WR6',
            date: new Date('2025-05-18'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2025-06-28 Z-ZX Club - Groesbeek.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/pmSpqN8TS7KY5VcUA',
            date: new Date('2025-06-29'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2025-08-24 GT86 BBQ.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/qcQcTvpuThJ9iaZ2A',
            date: new Date('2025-08-24'),
            tags: [{namespace: 'Organizer', tag: 'GT86 Club'}]
        }, {
            segments: [{file: '../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 1.gpx'}, {file: '../resources/2025-10-17 Z-ZX Club Jubileum vrijdag 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-17'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2025-10-19 Z-ZX Club Jubileum zondag 1.gpx'}, {file: '../resources/2025-10-19 Z-ZX Club Jubileum zondag 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/ELhtDxuBMDEeNP5y5',
            date: new Date('2025-10-19'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2026-06-07 Z-ZX Club - Kastelenroute Noord-Brabant.gpx'}],
            // albumUrl: 'https://photos.app.goo.gl/gJpqzsbXrj5qoSEt7',
            date: new Date('2026-06-07'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }, {
            segments: [{file: '../resources/2026-05-12 ESAV Gravel Rallye 1.gpx'}, {file: '../resources/2026-05-12 ESAV Gravel Rallye 2.gpx'}],
            albumUrl: 'https://photos.app.goo.gl/gJpqzsbXrj5qoSEt7',
            date: new Date('2026-05-12'),
            tags: [{namespace: 'Organizer', tag: 'Z-ZX Club'}]
        }].map(async (route) => {
        let {segments, ...routeRest} = route;
        const defaultRouteTags = [
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
