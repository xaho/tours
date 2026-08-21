const events: TravelEvent[] = [
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
].map(e => {
    e.tags = [...(e.tags ?? []),
        {namespace: 'Transport', tag: TRANSPORT_TYPE.CAR},
        {namespace: 'Markers', tag: MARKER_TYPE.EVENT},
    ];
    return e;
});
