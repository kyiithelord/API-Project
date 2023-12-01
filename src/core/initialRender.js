import { url } from "./functions";
import { renderRecord } from "./record";

export const renders = () => {
  fetch(url("/courses")).then(res => res.json()).then(json => renderRecord(json));
};