var config = {
    map: {
        zoom: 8,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0'
    }
};

window.addEventListener('map-loaded', (event: CustomEventInit<{map: google.maps.Map}>) => {
    const map = event.detail?.map;
    if (!map) return;
    // Draw legend
    const legend = document.getElementById('legend')!;
    const note = createElement('div');
    note.classList.add('legend-subtext');
    note.textContent = '(Click marker to view photos)';
    legend.append(
        createRoutePin("'XX"),
        Object.assign(createElement('span', {marginLeft: '12px'}), {textContent: 'Pitstop in route'}),
        createElement('div'),
        createRoutePin('', true),
        Object.assign(createElement('span', {marginLeft: '12px'}), {textContent: 'Planned stop in route'}),
        createElement('div'),
        createEventPin("'XX"),
        Object.assign(createElement('span', {marginLeft: '12px'}), {textContent: 'Event in the year \'XX\''}),
        note
    );

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
});
