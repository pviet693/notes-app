"use strict";

const $ = document.querySelector.bind(document);

const noteList = $(".note-list");
const createNewNoteIcon = $(".create-new-note i");
const popupContainer = $(".pop-up-container");
const closePopupIcon = $(".pop-up-container header i");
const popupForm = $(".pop-up-container form");

function onCreateNewNoteClickHandler() {
    popupContainer.classList.add("show");
}

function onClosePopupClickHandler() {
    popupContainer.classList.remove("show");
}

function onPopupContainerClickHandler(event) {
    if (!event.target.closest(".pop-up-content")) {
        onClosePopupClickHandler();
    }
}

function onEditClickHandler(id, title, description) {
    console.log("id", id);
    // TODO
}

function onDeleteClickHandler(id) {
    const itemDeleted = $(`#${id}`);
    itemDeleted.remove();
}

function openMenuClickHandler(nodeEle) {
    nodeEle.parentElement.nextElementSibling.classList.add("show");

    document.addEventListener("click", (event) => {
        if (event.target.className !== "uil uil-ellipsis-h" && !event.target.closest(".note-item--menu")) {
            nodeEle.parentElement.nextElementSibling.classList.remove("show");
        }
    });
}

function generateNewNote(title, description, time) {
    const id = generateUniqueId();

    const noteItemEle = document.createElement("li");
    noteItemEle.classList.add("note-item");
    noteItemEle.setAttribute("id", id);
    noteItemEle.innerHTML = `
        <div class="note-item--title">${title}</div>
        <p class="note-item--description">
            ${description}
        </p>
        <div class="note-item--footer">
            <p class="note-item--created-time">${time}</p>
            <button onclick="openMenuClickHandler(this)">
                <i class="uil uil-ellipsis-h"></i>
            </button>
        </div>
        <div class="note-item--menu">
            <div class="menu-item" onclick="onEditClickHandler('${id}', '${title}', '${description}')">
                <i class="uil uil-pen"></i>
                <p>Edit</p>
            </div>
            <div class="menu-item" onclick="onDeleteClickHandler('${id}')">
                <i class="uil uil-trash-alt"></i>
                <p>Delete</p>
            </div>
        </div>
    `;

    noteList.appendChild(noteItemEle);
}

function onSubmitHandler(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const date = new Date();
    const time = formatCurrentDate();

    if (title) {
        onClosePopupClickHandler();
        generateNewNote(title, description, time);
    }
}

createNewNoteIcon.addEventListener("click", onCreateNewNoteClickHandler);
popupContainer.addEventListener("click", onPopupContainerClickHandler);
closePopupIcon.addEventListener("click", onClosePopupClickHandler);
popupForm.addEventListener("submit", onSubmitHandler);
