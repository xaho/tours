/// <reference types="@types/google.maps" />
/// <reference types="@types/jquery" />
/// <reference types="@types/jqueryui" />

let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
let PinElement: typeof google.maps.marker.PinElement;
let Polyline: typeof google.maps.Polyline;
let GoogleMap: typeof google.maps.Map;

type MapConfig = {
    map: google.maps.MapOptions,
    initialBounds?: google.maps.LatLngBoundsLiteral,
    key: string,
    filters: {
        minYear?: number,
        maxYear?: number,
    }
}

type Route<T extends NamespacedTag<Record<PropertyKey, PropertyKey>>> = {
    date: Date,
    title: string,
    tags?: T[],
    segments: RouteSegment<T>[],
    albumUrl?: string;
    color?: string
};

type NamespacedTag<T extends Record<PropertyKey, PropertyKey>> = {
    [K in keyof T]: {
        namespace: K;
        tag: T[K];
    };
}[keyof T];

type RouteSegment<T extends NamespacedTag<Record<PropertyKey, PropertyKey>>> = {
    path: Point[],
    tags?: T[],
}

type Point = { lat: number, lng: number };

type TravelEvent<T extends NamespacedTag<Record<PropertyKey, PropertyKey>>> = {
    date: Date;
    tags?: T[],
    title: string;
    albumUrl?: string;
    position: { lat: number; lng: number }
}

type Marker<T extends NamespacedTag<Record<PropertyKey, PropertyKey>>> = {
    element: google.maps.marker.AdvancedMarkerElement,
    date: Date,
    type?: string,
    tags?: T[]
};

type Line<T extends NamespacedTag<Record<PropertyKey, PropertyKey>>> = {
    element: google.maps.Polyline,
    date: Date,
    tags?: T[]
}

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

function createRoutePin(text: string, pitstop = false): google.maps.marker.PinElement {
    return new PinElement({
        glyphText: pitstop ? undefined : text,
        glyphColor: pitstop ? undefined : 'white',
    });
}

function createEventPin(text: string): google.maps.marker.PinElement {
    return new PinElement({
        glyphText: text,
        background: '#1965C4',
        glyphColor: 'white',
        borderColor: '#1965C4'
    });
}

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, options: Partial<HTMLElementTagNameMap[K]> & {
    styles?: Partial<CSSStyleDeclaration>,
    classlist?: string[]
} = {}) {
    const element = document.createElement(tag);
    Object.assign(element, options, {style: options.styles});
    if (options.classlist) element.classList.add(...options.classlist);
    return element;
}

function createCollapsibleMapControl(contentElement: HTMLElement, label: string, addToBottom: boolean = false): HTMLElement {
    const container = createElement('div', {classlist: ['collapsible-map-control']});
    const toggle = createElement('button', {
        classlist: ['collapsible-map-control__toggle'],
        textContent: `Show ${label}`,
        title: `Toggle ${label}`,
        ariaLabel: `Toggle ${label}`,
        ariaExpanded: 'false'
    });

    contentElement.classList.add('collapsible-map-control__content');

    toggle.addEventListener('click', () => {
        const expanded = container.classList.toggle('collapsible-map-control--expanded');
        toggle.ariaExpanded = String(expanded);
        toggle.textContent = expanded ? `Hide ${label}` : `Show ${label}`;
    });
    if (addToBottom) container.append(contentElement, toggle);
    else container.append(toggle, contentElement);
    return container;
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

class Tours<T extends NamespacedTag<Record<PropertyKey, string>>> {
    private TagFilters: { element: HTMLInputElement, tag: string, namespace: string }[] = [];
    private yearRangeParagraph = createElement('p', {id: 'year-range-amount'});
    private yearRangeSlider: JQuery | undefined;
    private readonly routes: Route<T>[] = [];
    private readonly minYear: number;
    private minYearValue: number;
    private readonly maxYear: number;
    private maxYearValue: number;
    private config: MapConfig;

    private elements: {
        markers: Marker<T>[],
        lines: Line<T>[]
    } = {markers: [], lines: []};
    private readonly events: TravelEvent<T>[] = [];

    constructor(config: MapConfig, routes: Route<T>[], events: TravelEvent<T>[]) {
        this.config = config;
        this.events = events;
        this.routes = routes;
        this.minYearValue = this.minYear = config.filters.minYear ?? 2010;
        this.maxYearValue = this.maxYear = config.filters.maxYear ?? new Date().getFullYear();
    }

    setSlider(lower: number, upper: number): void {
        $(this.yearRangeParagraph).text(`${lower} - ${upper}`);
        this.minYearValue = lower;
        this.maxYearValue = upper;
        this.updateVisibility();
    }

    updateVisibility(): void {
        for (const marker of this.elements.markers) {
            let visible = true;
            if (marker.date.getFullYear() < this.minYearValue || marker.date.getFullYear() > this.maxYearValue) visible = false;
            else if (marker.tags?.some(t => this.TagFilters.some(f => f.tag === t.tag && f.namespace === t.namespace && !f.element.checked))) visible = false;
            // if one of the marker's tags is not checked, hide the marker
            marker.element.style.visibility = visible ? 'visible' : 'hidden';
        }
        for (const line of this.elements.lines) {
            let visible = true;
            if (line.date.getFullYear() < this.minYearValue || line.date.getFullYear() > this.maxYearValue) visible = false;
            else if (line.tags?.some(t => this.TagFilters.some(f => f.tag === t.tag && !f.element.checked))) visible = false;

            line.element.setVisible(visible);
        }
    }

    // jQuery UI's slider widget only listens for mouse events, so it never responds to touch.
    // Drive the same public API ourselves for touch/pen pointers, leaving mouse to jQuery UI.
    private enableTouchDrag(sliderElement: HTMLElement): void {
        const handles = Array.from(sliderElement.querySelectorAll<HTMLElement>('.ui-slider-handle'));
        handles.forEach((handle, index) => {
            handle.style.touchAction = 'none';
            handle.addEventListener('pointerdown', (event: PointerEvent) => {
                if (event.pointerType === 'mouse') return;
                event.preventDefault();
                handle.setPointerCapture(event.pointerId);

                const move = (moveEvent: PointerEvent) => {
                    const rect = sliderElement.getBoundingClientRect();
                    const min = Number($(sliderElement).slider('option', 'min'));
                    const max = Number($(sliderElement).slider('option', 'max'));
                    const fraction = Math.min(1, Math.max(0, (moveEvent.clientX - rect.left) / rect.width));
                    const otherValue = $(sliderElement).slider('values', index === 0 ? 1 : 0);
                    let value = Math.round(min + fraction * (max - min));
                    value = index === 0 ? Math.min(value, otherValue) : Math.max(value, otherValue);

                    $(sliderElement).slider('values', index, value);
                    const values = $(sliderElement).slider('values');
                    this.setSlider(values[0], values[1]);
                };
                const up = () => {
                    handle.removeEventListener('pointermove', move);
                    handle.removeEventListener('pointerup', up);
                    handle.removeEventListener('pointercancel', up);
                };
                handle.addEventListener('pointermove', move);
                handle.addEventListener('pointerup', up);
                handle.addEventListener('pointercancel', up);
            });
        });
    }

    resetFilters(): void {
        for (const f of this.TagFilters) f.element.checked = true;
        this.yearRangeSlider?.slider('values', [this.minYear, this.maxYear]);
        this.setSlider(this.minYear, this.maxYear);
    }

    private generateCheckboxesForFilters(): HTMLElement[] {
        let htmlElements = [];
        let namespaces = [
            ...this.elements.markers.flatMap(m => m.tags ?? []),
            ...this.events.flatMap(e => e.tags ?? []),
            ...this.routes.flatMap(r => r.segments.flatMap(s => s.tags ?? [])),
            ...this.routes.flatMap(r => r.tags ?? [])
        ].reduce((prev, cur) => {
            prev[cur.namespace] ??= prev[cur.namespace] ?? {tags: new Set()};
            prev[cur.namespace].tags.add(cur.tag);
            return prev;
        }, {} as { [namespace: PropertyKey]: { tags: Set<string> } });
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
                this.TagFilters.push({element: checkbox, tag, namespace: filter.namespace});
                checkbox.addEventListener('change', () => this.updateVisibility());
                row.append(checkbox, createElement('label', {textContent: tag, htmlFor: checkbox.id}));
                container.append(row);
            }
            htmlElements.push(container);
        }
        htmlElements.push(createElement('button', {textContent: 'Reset', onclick: this.resetFilters}))
        return htmlElements;
    }

    addEventToMap(map: google.maps.Map, travelEvent: TravelEvent<T>): {
        element: google.maps.marker.AdvancedMarkerElement,
        date: Date,
        tags?: T[]
    } {
        const {date, position, albumUrl, title, tags} = travelEvent;
        const element = new AdvancedMarkerElement({
            map,
            position,
            title,
            content: createEventPin(`'${date.getFullYear() - 2000}`)
        });

        if (albumUrl) {
            element.addListener('gmp-click', () => window.open(albumUrl, '_blank'));
        }
        return {element, date, tags};
    }

    private loadGpxToGmaps(map: google.maps.Map, route: Route<T> & { color?: string }): {
        markers: Marker<T>[],
        lines: Line<T>[]
    } {
        const {segments, albumUrl, date, title, color = '#FF0000'} = route;
        const elements: {
            markers: Marker<T>[],
            lines: Line<T>[]
        } = {markers: [], lines: []};
        for (let i = 0; i < segments.length; i++) {
            const {path, tags} = segments[i];
            const polyline = new Polyline({
                path,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: .6,
                strokeWeight: 3,
            });
            elements.lines.push({
                element: polyline,
                date,
                tags: [...(tags ?? [{namespace: 'Markers', tag: MARKER_TYPE.ROUTE} as T])]
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
                } as T]
            });
        }
        return elements;
    }

    async initMap(): Promise<void> {
        ({AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker'));
        ({Polyline, Map: GoogleMap} = await google.maps.importLibrary('maps'));

        const mapElement = document.getElementById('map');
        if (!mapElement) throw new Error('Map element not found');
        const map = new GoogleMap(mapElement, this.config.map);

        // Emit event that map is loaded, so custom legends can be added
        window.dispatchEvent(new CustomEvent<{ map: google.maps.Map }>('map-loaded', {detail: {map}}));

        for (const event of this.events) {
            this.elements.markers.push(this.addEventToMap(map, event));
        }

        for (const route of this.routes) {
            const {markers, lines} = this.loadGpxToGmaps(map, route);
            this.elements.markers.push(...markers);
            this.elements.lines.push(...lines);
        }
        const filterDiv = createElement('div', {id: 'filters'});
        const yearHeader = createElement('h1', {textContent: 'Year'});
        const sliderDiv = createElement('div', {id: 'slider-range'});
        filterDiv.append(yearHeader, this.yearRangeParagraph, sliderDiv, ...this.generateCheckboxesForFilters());

        map.controls[google.maps.ControlPosition.LEFT_TOP].push(createCollapsibleMapControl(filterDiv, 'Filters'));

        this.yearRangeSlider = $(sliderDiv).slider({
            range: true,
            min: this.config.filters.minYear,
            max: this.config.filters.maxYear,
            values: [this.minYear, this.maxYear],
            slide: (_event, ui) => {
                this.setSlider(ui.values?.[0] ?? 0, ui.values?.[1] ?? 0);
            }
        });
        this.setSlider(this.minYear, this.maxYear);
        this.enableTouchDrag(sliderDiv);
        if (this.config.initialBounds) map.fitBounds(this.config.initialBounds);
    }

    initializeGmaps() {
        window.initMap = this.initMap.bind(this);
        document.head.append(
            createElement('script', {
                src: `https://maps.googleapis.com/maps/api/js?key=${this.config.key}&loading=async&callback=${this.initMap.name}`
            })
        );
    }
}

export {
    Tours,
    MARKER_TYPE,
    TRANSPORT_TYPE,
    parseGPXFromUrl,
    Route,
    NamespacedTag,
    TravelEvent,
    createCollapsibleMapControl,
    Marker,
    Line,
    createRoutePin,
    createEventPin,
    createElement,
    MapConfig
};
