/// <reference types="@types/google.maps" />
/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />

enum MARKER_TYPE {
    HOTEL = 'Hotel',
    POI = 'Point of interest',
    EVENT = 'Event',
    ROUTE_START = 'Route start'
}

enum LINE_TYPE {
    CAR = 'Car',
    TRAIN = 'Train',
    BUS = 'Bus',
    FERRY = 'Ferry'
}

type MarkerType = 'hotel' | 'POI' | 'event' | 'RouteStart';
type LineType = 'car' | 'train' | 'bus' | 'ferry';

let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
let PinElement: typeof google.maps.marker.PinElement;

const MarkerFilters: HTMLInputElement[] = [];
const LineFilters: HTMLInputElement[] = [];
let minYear = 2016;
let maxYear = 2026;

const elements: {
    markers: { element: HTMLElement, date: Date, type: MARKER_TYPE }[],
    lines: { element: google.maps.Polyline, date: Date, type: LINE_TYPE }[]
} = {markers: [], lines: []};

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, style: Partial<CSSStyleDeclaration> = {}) {
    const element = document.createElement(tag);
    Object.assign(element.style, style);
    return element;
}

async function parseTour(url: string) {
    const routeXml = await (await fetch(url)).text();
    const parser = new DOMParser();
    const route = parser.parseFromString(routeXml, 'text/xml');
    return Array.from(route.querySelectorAll('trk > trkseg > trkpt')).map(point => {
        return {lng: +point.getAttribute('lon')!, lat: +point.getAttribute('lat')!};
    });
}

function updateVisibility() {
    for (const marker of elements.markers) {
        let visible = true;
        if (marker.date.getFullYear() < minYear || marker.date.getFullYear() > maxYear) visible = false;
        else if (MarkerFilters.some(f => f.name === marker.type && !f.checked)) visible = false;
        marker.element.style.visibility = visible ? 'visible' : 'hidden';
    }
    for (const line of elements.lines) {
        let visible = true;
        if (line.date.getFullYear() < minYear || line.date.getFullYear() > maxYear) visible = false;
        else if (LineFilters.some(f => f.name === line.type && !f.checked)) visible = false;
        line.element.setVisible(visible);
    }
}

function generateCheckboxesForMarkers(target: HTMLElement) {
    const container = createElement('div');
    const header = createElement('h1');
    header.textContent = 'Markers';
    container.append(header);

    for (let markertypeKey of elements.markers.reduce((acc, marker) => acc.add(marker.type), new Set<string>())) {
        const row = Object.assign(createElement('div'), {classList: 'checkbox-row',});
        const checkbox = Object.assign(createElement('input'), {
            id: `${markertypeKey}-checkbox`,
            type: 'checkbox',
            checked: true,
            name: markertypeKey,
            value: markertypeKey
        });
        MarkerFilters.push(checkbox);
        checkbox.addEventListener('change', () => updateVisibility());
        row.append(checkbox, Object.assign(createElement('label'), {textContent: markertypeKey, htmlFor: checkbox.id}));
        container.append(row);
    }
    target.append(container);
}

function generateCheckboxesForLines(target: HTMLElement) {
    const container = createElement('div');
    const header = createElement('h1');
    header.textContent = 'Routes';
    container.append(header);
    for (let lineTypeKey of elements.lines.reduce((acc, marker) => acc.add(marker.type), new Set<string>())) {
        const row = Object.assign(createElement('div'), {
            classList: 'checkbox-row',
        });
        const checkbox = Object.assign(createElement('input'), {
            id: `${lineTypeKey}-checkbox`,
            type: 'checkbox',
            checked: true,
            name: lineTypeKey,
            value: lineTypeKey
        });
        LineFilters.push(checkbox);
        checkbox.addEventListener('change', () => updateVisibility());
        row.append(checkbox, Object.assign(createElement('label'), {textContent: lineTypeKey, htmlFor: checkbox.id}));
        container.append(row);
    }
    target.append(container);
}

function createButton() {
    const controlButton = Object.assign(
        createElement('button'),
        {
            textContent: 'Center Map',
            title: 'Click to recenter the map',
        });
    controlButton.addEventListener('click', () => {
    });
    return controlButton;
}

async function addEventToMap(map: google.maps.Map, {title, date, albumUrl, position, type}: {
    title: string,
    date: Date,
    albumUrl?: string,
    position: { lat: number, lng: number },
    type: MARKER_TYPE
}) {
    const marker = new AdvancedMarkerElement({
        map,
        position,
        title,
        content: createEventPin(`'${date.getFullYear() - 2000}`)
    });

    if (albumUrl) {
        marker.addListener('gmp-click', () => window.open(albumUrl, '_blank'));
    }
    return {element: marker, date, type};
}

function createRoutePin(text: string, pitstop = false) {
    return new PinElement({
        glyphText: pitstop ? undefined : text,
        glyphColor: pitstop ? undefined : 'white',
    });
}

function createEventPin(text: string) {
    return new PinElement({
        glyphText: text,
        background: '#1965C4',
        glyphColor: 'white',
        borderColor: '#1965C4'
    });
}

async function loadGpxToGmaps(map: google.maps.Map, {files, albumUrl, date, type = LINE_TYPE.CAR, color = '#FF0000'}: {
    files: string[],
    albumUrl?: string,
    date: Date,
    type: LINE_TYPE,
    color?: string
}) {
    const elements: {
        markers: { element: HTMLElement, date: Date, type: MARKER_TYPE }[],
        lines: { element: google.maps.Polyline, date: Date, type: LINE_TYPE }[]
    } = {markers: [], lines: []};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = await parseTour(file);
        const polyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: .6,
            strokeWeight: 3,
        });
        elements.lines.push({element: polyline, date, type});
        polyline.setMap(map);
        polyline.set('originalColor', color);
        google.maps.event.addListener(polyline, 'mouseover', () => {
            polyline.setOptions({strokeColor: '#1493FF', zIndex: 1, strokeOpacity: 1});
        });
        google.maps.event.addListener(polyline, 'mouseout', () => {
            polyline.setOptions({strokeColor: polyline.get('originalColor'), zIndex: 0, strokeOpacity: .6});
        });
        const markerContent = createRoutePin(`'${date.getFullYear() - 2000}`, i > 0);
        markerContent.onmouseenter = function (event) {
            polyline.setOptions({strokeColor: '#1493FF', zIndex: 1, strokeOpacity: 1});
            event.stopPropagation();
            event.preventDefault();
        };
        markerContent.onmouseleave = function (event) {
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
            marker.addListener('gmp-click', () => window.open(albumUrl, '_blank'));
        }
        elements.markers.push({element: marker, date, type: MARKER_TYPE.ROUTE_START});
    }
    return elements;
}

async function initMap() {
    ({AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker'));

    const map = new google.maps.Map(document.getElementById('map')!, {
        zoom: 8,
        center: {lat: 52.092, lng: 5.104},
        mapTypeId: 'terrain',
        mapId: '4504f8b37365c3d0'
    });

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
    // noinspection ES6MissingAwait Promise.all became messy
    events.forEach(async event => {
        elements.markers.push(await addEventToMap(map, {...event, type: MARKER_TYPE.EVENT}));
    });
    // noinspection ES6MissingAwait
    routes.forEach(async route => {
        const {markers, lines} = await loadGpxToGmaps(map, {...route, type: LINE_TYPE.CAR});
        elements.markers.push(...markers);
        elements.lines.push(...lines);
    });
    const filterDiv = createElement('div');
    filterDiv.id = 'filters';
    const yearRangeParagraph = createElement('p');
    yearRangeParagraph.id = 'amount';
    const yearHeader = createElement('h1');
    yearHeader.textContent = 'Year';
    const slider = createElement('div');
    slider.id = 'slider-range';

    filterDiv.append(yearHeader, yearRangeParagraph, slider);
    generateCheckboxesForLines(filterDiv);
    generateCheckboxesForMarkers(filterDiv);

    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(filterDiv);

    function updateAmount(lower: number, upper: number) {
        $(yearRangeParagraph).text(`${lower} - ${upper}`);
        minYear = lower;
        maxYear = upper;
        updateVisibility();
    }

    $(slider).slider({
        range: true,
        min: minYear,
        max: maxYear,
        values: [minYear, maxYear],
        slide: function (_event, ui) {
            updateAmount(ui.values?.[0] ?? 0, ui.values?.[1] ?? 0);
        }
    });
    updateAmount(minYear, maxYear);
}
