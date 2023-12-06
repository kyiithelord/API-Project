import { debounce } from "lodash";
import { createCourseFormHandler, editCourseFormHandler,recordGroupEditableHandler, recordGroupHandler, searchInputHandler } from "./handler";
import { createCourseForm, editCourseForm, recordGroup, searchInput } from "./selector";

const listeners = () => {
    createCourseForm.addEventListener("submit",createCourseFormHandler);
    recordGroup.addEventListener("click",recordGroupHandler);
    editCourseForm.addEventListener("submit",editCourseFormHandler);
    recordGroup.addEventListener("dblclick",recordGroupEditableHandler);
    searchInput.addEventListener("keyup",debounce(searchInputHandler,500));
};
export default listeners;



