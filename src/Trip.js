import { v4 as uuidv4 } from 'uuid';

export default class Trip {
    constructor(name, date, route, notes) {
        this.id = uuidv4();;
        this.name = name;
        this.date = date;
        this.route = route;
        this.notes = notes;
    }

}