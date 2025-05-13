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
