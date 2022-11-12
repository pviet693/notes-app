"use strict";

const $ = document.querySelector.bind(document);

const noteList = $(".note-list");
const createNewNoteIcon = $(".create-new-note i");
const popupContainer = $(".pop-up-container");
const popupContent = $(".pop-up-container .pop-up-content");
const popupHeaderTitle = popupContent.querySelector("header p");
const popupButton = popupContent.querySelector("form button");
const closePopupIcon = $(".pop-up-container header i");
const popupForm = $(".pop-up-container form");

function onOpenPopupClickHandler() {
    popupContainer.classList.add("show");
    popupHeaderTitle.textContent = "Add a new Note";
    popupButton.textContent = "Add Note"
}

function onClosePopupClickHandler() {
    popupContainer.classList.remove("show");
    popupForm.reset();
}

function onPopupContainerClickHandler(event) {
    if (!event.target.closest(".pop-up-content")) {
        onClosePopupClickHandler();
    }
}

function onEditClickHandler(id, title, description, nodeEle) {
    nodeEle.parentElement.classList.remove("show");
    popupContainer.classList.add("show");
    popupHeaderTitle.textContent = "Update a Note";
    popupButton.textContent = "Update Note";

    // init form value
    popupForm.elements["id"].value = id;
    popupForm.elements["title"].value = title;
    popupForm.elements["description"].value = description;
}

function onDeleteClickHandler(id) {
    const itemDeleted = $(`#${id}`);
    itemDeleted.remove();
}

function openMenuClickHandler(nodeEle) {
    nodeEle.parentElement.nextElementSibling.classList.add("show");

    document.addEventListener("click", (event) => {
        if (event.target.className !== "uil uil-ellipsis-h" && !event.target.closest(".note-item--menu")) {
            if (nodeEle.parentElement.nextElementSibling) {
                nodeEle.parentElement.nextElementSibling.classList.remove("show");
            }
        }
    });
}

function generateNewNote(id, title, description, time) {
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
            <div class="menu-item" onclick="onEditClickHandler('${id}', '${title}', '${description}', this)">
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

function updateNote(id, title, description, time) {
    const noteItemEle = $(`#${id}`);
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
            <div class="menu-item" onclick="onEditClickHandler('${id}', '${title}', '${description}', this)">
                <i class="uil uil-pen"></i>
                <p>Edit</p>
            </div>
            <div class="menu-item" onclick="onDeleteClickHandler('${id}')">
                <i class="uil uil-trash-alt"></i>
                <p>Delete</p>
            </div>
        </div>
    `;
}

function onSubmitHandler(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const time = formatCurrentDate();

    if (!id && title) {
        onClosePopupClickHandler();
        const itemId = generateUniqueId();
        generateNewNote(itemId, title, description, time);
    }

    if (id && title) {
        onClosePopupClickHandler();
        updateNote(id, title, description, time);
    }
}

createNewNoteIcon.addEventListener("click", onOpenPopupClickHandler);
popupContainer.addEventListener("click", onPopupContainerClickHandler);
closePopupIcon.addEventListener("click", onClosePopupClickHandler);
popupForm.addEventListener("submit", onSubmitHandler);
