![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Flight information
- Template to display a flight information.

## Supported Screen Formats/Resolutions

- Landscape

  ![Landscape](docs/screenshots/landscape.png)
- Portrait

  ![Portrait](docs/screenshots/portrait.png)
- Square

  ![Square](docs/screenshots/square.png)

### Configuration

This template has some configuration variables as the following table shows:

| Variable              | Type    | Default    | Description                                        |
|-----------------------|---------|------------| ---------------------------------------------------|
| `theme`            | object   | { primaryColor, secondaryColor, lineColor }       | template colors                                  |
| `logoPicture` | text   | "https://www.urlExample.com" | logo picture |
| `aiirlineInformation`          | object   | { airportName, lastUpdate, departureOrArrivals, planePicture, logoPicure, flights }    | arline information and flight list    |

Theme {...}
| Variable              | Type    | Default    | Description                                        |
|-----------------------|---------|------------| ---------------------------------------------------|
| `primaryColor`        | text   | ""    | primary color    |
| `secondaryColor`        | text   | ""    | secondary color    |
| `lineColor`        | text   | ""    | line color    |


Airline information [...]
|Attributes             | Type    | Example    | Description                                        |
|-----------------------|---------|------------| ---------------------------------------------------|
| `airportName`         | text   | "F.Noronha"    | flight list    |
| `lastUpdate`          | text   | "2024-01-01T02:30"    | datetime, iso format    |
| `departuresOrArrivals`| text   | "Departures"    | Departure or Arrival information    |
| `planePicture`        | text   | "up" or "down"    | plane picture    |
| `flights`  | list   | [{ destination, flight, airline, departureTime, gate, status }]    | flight list and their informations    |



Flights [...]
|Attributes             | Type    | Example    | Description                                        |
|-----------------------|---------|------------| ---------------------------------------------------|
| `destination`          | text   | "Nashville"    | destinations.                                |
| `flight`          | text   | "0000"    | flight number    |
| `airline`          | text   | "https://www.urlExample.com"    | image link    |
| `departureTime`          | text   | "2023-06-05T10:16"    | datetime, iso format    |
| `gate`          | text   | "Term B - 52"    | gate description    |
| `status`          | text   | "on time"    | flight status    |


## Getting started
```
  git clone https://github.com/dsplay/template-flight-information.git my-awesome-template
  cd my-awesome-template
  rm -rf .git
  npm install
  npm start
```

## Packing (release build)
  To create a release build of the template, ready to be uploaded to DSPLAY, just run:
  ```
    npm run zip
  ```
  It will generate a template.zip file ready to be deployed to [DSPLAY Web Manager](https://manager.dsplay.tv/template/create)

## More

The see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
