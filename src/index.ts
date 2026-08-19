/// <reference types="@types/google.maps" />
/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />

let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
let PinElement: typeof google.maps.marker.PinElement;

const TagFilters: { element: HTMLInputElement, tag: string, namespace: string }[] = [];
const yearRangeParagraph = createElement('p', {id: 'year-range-amount'});
let yearRangeSlider: JQuery;
let routes: Route[] = [];
let minYearValue = config.filters.minYear;
let maxYearValue = config.filters.maxYear;

type Tag = { namespace: string, tag: string };

type Route = {
    date: Date,
    title: string,
    tags?: Tag[],
    segments: RouteSegment[],
    albumUrl?: string;
    color?: string
};

type RouteSegment = {
    path: Point[],
    tags?: Tag[],
}

type Point = { lat: number, lng: number };

type TravelEvent = {
    date: Date;
    tags?: Tag[],
    title: string;
    albumUrl: string;
    position: { lat: number; lng: number }
}

type Marker = {
    element: google.maps.marker.AdvancedMarkerElement,
    date: Date,
    type?: string,
    tags?: Tag[]
};

type Line = {
    element: google.maps.Polyline,
    date: Date,
    tags?: Tag[]
}

const elements: {
    markers: Marker[],
    lines: Line[]
} = {markers: [], lines: []};

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, options: Partial<HTMLElementTagNameMap[K]> & {
    styles?: Partial<CSSStyleDeclaration>,
    classlist?: string[]
} = {}) {
    const element = document.createElement(tag);
    Object.assign(element, options, {style: options.styles});
    if (options.classlist) element.classList.add(...options.classlist);
    return element;
}

async function parseGPXFromUrl(url: string): Promise<{ lng: number, lat: number }[]> {
    const routeXml = await (await fetch(url)).text();
    const parser = new DOMParser();
    const route = parser.parseFromString(routeXml, 'text/xml');
    return Array.from(route.querySelectorAll('trk > trkseg > trkpt')).map(point => ({
        lng: +point.getAttribute('lon')!,
        lat: +point.getAttribute('lat')!
    }));
}

function setSlider(lower: number, upper: number) {
    $(yearRangeParagraph).text(`${lower} - ${upper}`);
    minYearValue = lower;
    maxYearValue = upper;
    updateVisibility();
}

function updateVisibility(): void {
    for (const marker of elements.markers) {
        let visible = true;
        if (marker.date.getFullYear() < minYearValue || marker.date.getFullYear() > maxYearValue) visible = false;
        else if (marker.tags?.some(t => TagFilters.some(f => f.tag === t.tag && !f.element.checked))) visible = false;
        // if one of the marker's tags is not checked, hide the marker
        marker.element.style.visibility = visible ? 'visible' : 'hidden';
    }
    for (const line of elements.lines) {
        let visible = true;
        if (line.date.getFullYear() < minYearValue || line.date.getFullYear() > maxYearValue) visible = false;
        else if (line.tags?.some(t => TagFilters.some(f => f.tag === t.tag && !f.element.checked))) visible = false;

        line.element.setVisible(visible);
    }
}

function resetFilters() {
    for (const f of TagFilters) f.element.checked = true;
    yearRangeSlider.slider("values", [config.filters.minYear, config.filters.maxYear]);
    setSlider(config.filters.minYear, config.filters.maxYear);
}

function generateCheckboxesForFilters(): HTMLElement[] {
    let elements = [];
    let namespaces = [
        ...events.flatMap(e => e.tags ?? []),
        ...routes.flatMap(r => r.segments.flatMap(s => s.tags ?? [])),
        ...routes.flatMap(r => r.tags ?? [])
    ].reduce((prev, cur) => {
        prev[cur.namespace] ??= prev[cur.namespace] ?? {tags: new Set()};
        prev[cur.namespace].tags.add(cur.tag);
        return prev;
    }, {} as { [namespace: string]: { tags: Set<string> } });
    for (let namespace in namespaces) {
        let filter = {namespace, tags: namespaces[namespace].tags};
        const container = createElement('div');
        container.append(createElement('h1', {textContent: filter.namespace}));
        for (let tag of filter.tags) {
            const row = createElement('div', {classlist: ['checkbox-row']});
            const checkbox = createElement('input', {
                id: `${tag}-checkbox`,
                type: 'checkbox',
                checked: true,
                name: tag,
                value: tag
            });
            TagFilters.push({element: checkbox, tag, namespace: filter.namespace});
            checkbox.addEventListener('change', () => updateVisibility());
            row.append(checkbox, createElement('label', {textContent: tag, htmlFor: checkbox.id}));
            container.append(row);
        }
        elements.push(container);
    }
    elements.push(createElement('button', {textContent: 'Reset', onclick: resetFilters}))
    return elements;
}

function addEventToMap(map: google.maps.Map, {title, date, albumUrl, position, type, tags}: {
    title: string,
    date: Date,
    albumUrl?: string,
    position: { lat: number, lng: number },
    type?: string,
    tags?: { namespace: string, tag: string }[]
}) {
    const element = new AdvancedMarkerElement({
        map,
        position,
        title,
        content: createEventPin(`'${date.getFullYear() - 2000}`)
    });

    if (albumUrl) {
        element.addListener('gmp-click', () => window.open(albumUrl, '_blank'));
    }
    return {element, date, type, tags};
}

function createRoutePin(text: string, pitstop = false): google.maps.marker.PinElement {
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

function loadGpxToGmaps(map: google.maps.Map, route: Route & {color?: string}): {markers: Marker[], lines: Line[]} {
    const {segments, albumUrl, date, title, color = '#FF0000'} = route;
    const elements: {
        markers: Marker[],
        lines: Line[]
    } = {markers: [], lines: []};
    for (let i = 0; i < segments.length; i++) {
        const {path, tags} = segments[i];
        const polyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: .6,
            strokeWeight: 3,
        });
        elements.lines.push({
            element: polyline,
            date,
            tags: [...(tags ?? [{namespace: 'Markers', tag: MARKER_TYPE.ROUTE}]),]
        });
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
            title,
            content: markerContent,
            gmpClickable: !!albumUrl,
            zIndex: 1 - i
        });
        if (albumUrl) {
            marker.addListener('gmp-click', () => window.open(albumUrl, '_blank'));
        }
        elements.markers.push({
            element: marker,
            date,
            type: MARKER_TYPE.ROUTE_START,
            tags: [...(tags ?? []), {
                namespace: 'Markers',
                tag: i === 0 ? MARKER_TYPE.ROUTE_START : MARKER_TYPE.PITSTOP
            }]
        });
    }
    return elements;
}

async function initMap(): Promise<void> {
    ({AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker'));

    const map = new google.maps.Map(document.getElementById('map')!, config.map);
    window.dispatchEvent(new CustomEvent<{ map: google.maps.Map }>('map-loaded', {detail: {map}}));

    for (const event of events) {
        elements.markers.push(addEventToMap(map, event));
    }
    routes = await getRoutes();
    for (const route of routes) {
        const {markers, lines} = loadGpxToGmaps(map, route);
        elements.markers.push(...markers);
        elements.lines.push(...lines);
    }
    const filterDiv = createElement('div', {id: 'filters'});
    const yearHeader = createElement('h1', {textContent: 'Year'});
    const sliderDiv = createElement('div', {id: 'slider-range'});

    filterDiv.append(yearHeader, yearRangeParagraph, sliderDiv, ...generateCheckboxesForFilters());

    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(filterDiv);

    yearRangeSlider = $(sliderDiv).slider({
        range: true,
        min: config.filters.minYear,
        max: config.filters.maxYear,
        values: [config.filters.minYear, config.filters.maxYear],
        slide: function (_event, ui) {
            setSlider(ui.values?.[0] ?? 0, ui.values?.[1] ?? 0);
        }
    });
    setSlider(config.filters.minYear, config.filters.maxYear);
}
