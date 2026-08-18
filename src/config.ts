type Route = {
    tags?: { namespace: string, tag: string }[],
    segments: { file: string, tags?: { namespace: string, tag: string }[] }[],
    albumUrl?: string;
    date: Date,
    color?: string
};

enum MARKER_TYPE {
    HOTEL = 'Hotel',
    POI = 'Point of interest',
    EVENT = 'Event',
    ROUTE_START = 'Route start',
    ROUTE = 'Route',
    PITSTOP = 'Pitstop'
}

enum TRANSPORT_TYPE {
    CAR = 'Car',
    TRAIN = 'Train',
    BUS = 'Bus',
    FERRY = 'Ferry'
}

const config = {
    map: {
        zoom: 8,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0'
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

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
});
