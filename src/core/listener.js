import { createCourseFormHandler, editCourseFormHandler, recordGroupHandler } from "./handler";
import { createCourseForm, editCourseForm, recordGroup } from "./selector";

const listeners = () => {
    createCourseForm.addEventListener("submit",createCourseFormHandler);
    recordGroup.addEventListener("click",recordGroupHandler);
    editCourseForm.addEventListener("submit",editCourseFormHandler);
};
export default listeners;

