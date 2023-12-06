import Swal from "sweetalert2";
import { disabledForm, enableForm, toast, url } from "./functions";
import {
  createCourseForm,
  editCourseForm,
  editDrawer,
  recordEdit,
  recordGroup,
} from "./selector";
import { createRecord, removeRecord, renderRecord } from "./record";
import { Drawer } from "flowbite";

export const createCourseFormHandler = async (event) => {
  event.preventDefault();
  const formData = new FormData(createCourseForm);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    title: formData.get("course_title"),
    short_name: formData.get("short_name"),
    fee: formData.get("fee"),
  });

  const options = {
    method: "POST",
    headers,
    body,
    redirect: "follow",
  };

  // disableform
  disabledForm(createCourseForm);

  const res = await fetch(url("/courses"), options);
  const json = await res.json();
  recordGroup.append(createRecord(json));
  // when server get response enableForm
  enableForm(createCourseForm);

  // sweet alert
  toast("Course created successfully");

  createCourseForm.reset();
};

export const recordGroupHandler = (event) => {
  if (event.target.classList.contains("record-del")) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentRow = event.target.closest("tr");
        const currentId = currentRow.getAttribute("data-id");
        removeRecord(currentId);
        currentRow.remove();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  } else if (event.target.classList.contains("record-edit")) {
    console.log("u edit");
    const currentRow = event.target.closest("tr");
    const currentId = currentRow.getAttribute("data-id");
    // set disable
    event.target.toggleAttribute("disabled");
    fetch(url("/courses/" + currentId))
      .then((res) => res.json())
      .then((json) => {
        // remove desable
        event.target.toggleAttribute("disabled");

        // data set
        recordEdit.querySelector("#editCourseId").value = json.id;
        recordEdit.querySelector("#editCourseTitle").value = json.title;
        recordEdit.querySelector("#editShortName").value = json.short_name;
        recordEdit.querySelector("#editFee").value = json.fee;

        // options with default values

        editDrawer.show();
      });
  }
};

export const editCourseFormHandler = (event) => {
  event.preventDefault();
  const formData = new FormData(editCourseForm);
  const headers = new Headers();
  const currentId = formData.get("id");
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify({
    title: formData.get("course_title"),
    short_name: formData.get("short_name"),
    fee: formData.get("fee"),
  });

  const options = {
    method: "PUT",
    headers,
    body,
    redirect: "follow",
  };
  disabledForm(editCourseForm);

  fetch(url("/courses/" + currentId), options)
    .then((res) => res.json())
    .then((json) => {
      enableForm(editCourseForm);
      const currentRow = document.querySelector(`[data-id='${currentId}']`);
      currentRow.querySelector(".record-title").innerText = json.title;
      currentRow.querySelector(".record-short").innerText = json.short_name;
      currentRow.querySelector(".record-fee").innerText = json.fee;
      toast("Update successfully");
      editDrawer.hide();
      editCourseForm.reset();
    });
};

export const recordGroupEditableHandler = (event) => {
  if (event.target.classList.contains("editable-cell")) {
    const currentId = event.target.closest("tr").getAttribute("data-id");
    const currentColumn = event.target.getAttribute("data-column");
    const currentContent = event.target.innerText;
    const currentWidth =
      parseInt(window.getComputedStyle(event.target).width) - 50;
    const textInput = document.createElement("input");
    textInput.value = currentContent;
    textInput.style.width = currentWidth + "px";
    textInput.className = "border border-gray-500 p-1 text-sm rounded";
    event.target.innerText = "";
    event.target.append(textInput);
    textInput.focus();
    textInput.addEventListener("blur", () => {
      const newContent = textInput.value;
      event.target.innerText = newContent;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const data = {};
      data[currentColumn] = newContent;
      fetch(url("/courses/" + currentId), {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => toast("Data Update Successfully"));
    });
  }
};

export const searchInputHandler = (event) => {
  event.target.previousElementSibling.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
  />
</svg>`;
  fetch(url("/courses?title[like]=" + event.target.value))
    .then((res) => res.json())
    .then((json) => {
      if(json.length){
      renderRecord(json);
      }else{
        recordGroup.innerHTML =`
          <tr>
          <td class="text-center px-6 py-4" colspan='5'>Not Found
          <a class="underline" href="http://${location.host}">See All</a>
          </td>
          </tr>
        `;
        toast("Data can't find","error");
      }
      event.target.previousElementSibling.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-4 h-4 text-gray-500 dark:text-gray-400"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>`;
    });
};
