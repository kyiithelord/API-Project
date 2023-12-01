import { renders } from "./core/initialRender";
import listeners from "./core/listener";

export default class School {
    init(){
        console.log("School");
        renders();
        listeners();
    };
};