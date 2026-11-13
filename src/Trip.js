import { v4 as uuidv4 } from 'uuid';

export default class Trip {
    constructor({name, date, route, notes, totalElevationGain, totalDistance}) {
        this.id = uuidv4();
        this.name = name;
        this.date = date;
        this.route = route;
        this.notes = notes;
        this.totalElevationGain = totalElevationGain;
        this.totalDistance = totalDistance;
    }

}