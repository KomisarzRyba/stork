const axios = require('axios'); 
const fs = require('fs');
const GOOGLE_MAPS_API_KEY = '';

async function getTravelTime(start, end) {
    const startCoords = `${start[0]},${start[1]}`;
    const endCoords = `${end[0]},${end[1]}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords}&destination=${endCoords}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status !== 'OK') {
            throw new Error('Error retrieving directions from Google Maps API');
        }

        const legs = response.data.routes[0].legs;
        return legs[0].duration.value; // Duration in seconds
    } catch (error) {
        console.error(error);
        return Infinity;
    }
}

async function getDriverTravelTimeToEvent(driver, eventPin) {
    const driverTimeToEvent = await getTravelTime(driver.DriverPin, eventPin);
    console.log(`Driver ${driver.DriverID} has an estimated travel time of ${driverTimeToEvent / 60} minutes to the event.`);
    return driverTimeToEvent;
}

/* 
*  Function for comparing the latitude and longitude between the driver and the event.
*  Returns the coordinates for the 'passengerLine', 
*  which will have the average of the closest of either the Latitude or the Longitude between
*  the driver and the event.
*  If the latitude is closer in value, then the return will be [<average latitude>, 0]
*  If the longitude is closer in value, then the return will be [0, <average latitude>]
*/
async function compareLatitudeLongitudeDriverandEvent(driver, eventPin) {
    const latDiff = Math.abs(driver.DriverPin[0] - eventPin[0]);
    const lonDiff = Math.abs(driver.DriverPin[1] - eventPin[1]);

    if (latDiff < lonDiff) {
        console.log(`${[parseFloat((driver.DriverPin[0] + eventPin[0]) / 2).toFixed(4), 0]}`)
        return [parseFloat((driver.DriverPin[0] + eventPin[0]) / 2).toFixed(4), 0];
    } else {
        console.log(`${[0, parseFloat((driver.DriverPin[1] + eventPin[1]) / 2).toFixed(4)]}`)
        return [0, parseFloat((driver.DriverPin[1] + eventPin[1]) / 2).toFixed(4)];
    }

}

// Load dummy data from JSON file and compute the driver's travel time to the event
async function main() {

    // Get the data. Replace this with database fetch when we're done implementing the database.
    const dummyData = JSON.parse(fs.readFileSync('./dummydata.json', 'utf-8'));
    const eventPin = dummyData.Event.EventPin;

    // Iterate through the drivers to find the calculated minutes required to reach the event.
    for (const driver of dummyData.Event.Drivers) {
        // Get the PassengerLine between the driver and the event
        await compareLatitudeLongitudeDriverandEvent(driver, eventPin);

        // Get the time it takes for the driver to reach the event
        await getDriverTravelTimeToEvent(driver, eventPin);
    }
}

main();