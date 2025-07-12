export default class GxGeoJson{
    type:string;
    properties:any;
    geometry:any;
    constructor(type:string,geometry:any,properties:any={}){
        this.type = type;
        this.properties = properties;
        this.geometry = geometry;
    }
}