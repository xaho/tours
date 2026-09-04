# How to use

- Add this as a dependency to your project via `npm install --save github:xaho/tours`
- Create an index.html file in your project root or use the one in this repo
- Make sure the `tsconfig.json`'s `module` is set to `esnext`
- Create a file `src/config.ts` which calls initializeGmaps on a Tours object, for example:

```ts
new Tours(config, routes, events)
    .initializeGmaps();
```

## How to update to a later version

`npm install --save github:xaho/tours@latest`

# How to create GPX files

Convert kml to gpx: https://www.gpsvisualizer.com/convert_input

Create new gpx tracks: https://gpx.studio/app#6.69/52.17/5.831
- Pencil in the left menu
- Turn routing on
- Put activity to `motorcycle` 
- Put activity to `bike` for sections which are officially not roads
- Rename `new file` to match tour ridden
- File -> Export all -> Uncheck OpenStreetMap data
  
Regex to remove excess data from GPX file:
- Find: `(<trkpt lat="[\d\.]+" lon="[\d\.]+">)[\w\W]*?</trkpt>`
- Replace: `$1</trkpt>`
