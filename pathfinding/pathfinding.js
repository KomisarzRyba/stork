const axios = require('axios'); 
const fs = require('fs');
const GOOGLE_MAPS_API_KEY = 'AIzaSyA31ijlwSO0CLTpURo_3_lbphnuryXm7zw';
const MAX_DETOUR_TIME = 900; // 15 minutes in seconds
const MAX_PASSENGERS = 3;

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

/*
*   This function takes tyhe list of all passengers in the event and sorts them in order of proximity to the PassengerLine,
*   which is either the average latitude or longitude between the driver and the event. It then returns this list of passengers.
*/
function sortPassengersByProximity(passengers, passengerLine) {
    // If PassengerLine is determined by latitude
    if (passengerLine[1] === 0) {
        return passengers.sort((a, b) => {
            return Math.abs(a.PassengerPin[0] - passengerLine[0]) - Math.abs(b.PassengerPin[0] - passengerLine[0]);
        });
    } 
    // If PassengerLine is determined by longitude
    else if (passengerLine[0] === 0) {
        return passengers.sort((a, b) => {
            return Math.abs(a.PassengerPin[1] - passengerLine[1]) - Math.abs(b.PassengerPin[1] - passengerLine[1]);
        });
    }
    return passengers;  // Return original order if no valid PassengerLine is provided
}

async function getTravelTimeWithWaypoints(start, end, waypoints, optimize = false) {
    const startCoords = `${start[0]},${start[1]}`;
    const endCoords = `${end[0]},${end[1]}`;
    const waypointsStr = (optimize ? "optimize:true|" : "") + waypoints.join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords}&destination=${endCoords}&waypoints=${waypointsStr}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status !== 'OK') {
            throw new Error('Error retrieving directions with waypoints from Google Maps API');
        }

        const legs = response.data.routes[0].legs;
        const totalDuration = legs.reduce((sum, leg) => sum + leg.duration.value, 0);

        // If waypoints are optimized, the order might be changed. We extract the order from the API response.
        if (optimize) {
            const optimizedOrder = response.data.routes[0].waypoint_order;
            const optimizedWaypoints = optimizedOrder.map(index => waypoints[index]);
            return {
                duration: totalDuration,
                waypoints: optimizedWaypoints
            };
        }

        return {
            duration: totalDuration
        };
    } catch (error) {
        console.error(error);
        return {
            duration: Infinity
        };
    }
}

async function calculateDetourWithPassengers(driver, eventPin, sortedPassengers) {
    const originalRouteTime = await getTravelTime(driver.DriverPin, eventPin);    
    let waypoints = [];
    let detourTime = 0;

    for (let i = 0; i < sortedPassengers.length; i++) {
        const passenger = sortedPassengers[i];
        const tempWaypoints = [...waypoints, `${passenger.PassengerPin[0]},${passenger.PassengerPin[1]}`];
        
        // Use the optimize waypoints feature when there are multiple waypoints
        const newRouteInfo = await getTravelTimeWithWaypoints(driver.DriverPin, eventPin, tempWaypoints, tempWaypoints.length > 1);
        const tempDetourTime = newRouteInfo.duration - originalRouteTime;

        if (tempDetourTime <= MAX_DETOUR_TIME && tempWaypoints.length < MAX_PASSENGERS) {
            waypoints = tempWaypoints;
            detourTime = tempDetourTime;

            // If waypoints are optimized, update the waypoints list
            if (newRouteInfo.waypoints) {
                waypoints = newRouteInfo.waypoints;
            }
        } else {
            break;
        }
    }

    console.log(`Driver ${driver.DriverID} can pick up ${waypoints.length} passengers with a detour time of ${detourTime / 60} minutes.`);
    return waypoints; // Returning waypoints (passenger locations) that meet the criteria.
}


let driverWaypoints = {}; // { DriverID: { PassengerID: [lat, lon], ... }, ... }
let passengerDriverMap = {}; // { PassengerID: DriverID, ... }

// Load dummy data from JSON file and compute the driver's travel time to the event
async function main() {
    // Get the data. Replace this with database fetch when we're done implementing the database.
    const dummyData = JSON.parse(fs.readFileSync('./dummydata.json', 'utf-8'));
    const eventPin = dummyData.Event.EventPin;

    // Create an in-memory copy of all passengers
    let availablePassengers = [...dummyData.Event.Passengers];

    // Iterate through the drivers to find the calculated minutes required to reach the event.
    for (const driver of dummyData.Event.Drivers) {
        // Get the PassengerLine between the driver and the event
        const passengerLine = await compareLatitudeLongitudeDriverandEvent(driver, eventPin);

        const sortedPassengers = sortPassengersByProximity(availablePassengers, passengerLine);
        console.log(`Sorted passengers for Driver ${driver.DriverID}: `, sortedPassengers);

        const selectedWaypoints = await calculateDetourWithPassengers(driver, eventPin, sortedPassengers);

        // Update driverWaypoints
        driverWaypoints[driver.DriverID] = {};
        for (const waypoint of selectedWaypoints) {
            const matchingPassenger = availablePassengers.find(passenger => {
                return `${passenger.PassengerPin[0]},${passenger.PassengerPin[1]}` === waypoint;
            });
            if (matchingPassenger) {
                driverWaypoints[driver.DriverID][matchingPassenger.PassengerID] = matchingPassenger.PassengerPin;
                passengerDriverMap[matchingPassenger.PassengerID] = driver.DriverID;
            }
        }


        // Remove the selected waypoints from availablePassengers so they are not considered for other drivers.
        const selectedPassengerCoords = new Set(selectedWaypoints);
        availablePassengers = availablePassengers.filter(passenger => {
            const passengerCoords = `${passenger.PassengerPin[0]},${passenger.PassengerPin[1]}`;
            return !selectedPassengerCoords.has(passengerCoords);
        });

        console.log(`Driver ${driver.DriverID} will pick up at these waypoints: `, selectedWaypoints);
    }
    // After all drivers have been assigned, print the passengers who haven't been assigned
    if (availablePassengers.length) {
        console.log("Passengers not assigned to any driver:");
        for (const passenger of availablePassengers) {
            console.log(`Passenger ID: ${passenger.PassengerID}`);
        }
    } else {
        console.log("All passengers have been assigned to drivers.");
    }

    saveToJson(dummyData.Event.EventID, driverWaypoints, passengerDriverMap);
}

function saveToJson(eventID, driverWaypoints, passengerDriverMap) {
    const outputData = {
        Event: eventID,
        Drivers: driverWaypoints,
        Passengers: Object.entries(passengerDriverMap).map(([passengerID, driverID]) => {
            return { [passengerID]: driverID };
        })
    };
    
    fs.writeFileSync('./outputdata.json', JSON.stringify(outputData, null, 2));
}

main();

