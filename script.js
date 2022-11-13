"use strict";
import { generateUniqueId, formatCurrentDate } from "./utils.js";
import { showSuccessAlert } from "./alert.js";
import DBService from "./db.js";

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

    const dbService = new DBService();
    dbService.deleteNoteInDB(id).then((message) => {
        // alert(message);
        showSuccessAlert(message);
    }).catch((error) => {
        console.error(error.message || error);    
    });;
}

function openMenuClickHandler(id, nodeEle) {
    nodeEle.parentElement.nextElementSibling.classList.add("show");

    document.addEventListener("click", (event) => {
        if (
            !event.target.closest(`#${id}`) 
            || (!event.target.closest(".note-item--menu") && event.target.tagName !== "I")
        ) {
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
            <button>
                <i class="fa-solid fa-ellipsis"></i>
            </button>
        </div>
        <div class="note-item--menu" id=${id}>
            <div class="menu-item">
                <i class="fa-solid fa-pen"></i>
                <p>Edit</p>
            </div>
            <div class="menu-item">
                <i class="fa-solid fa-trash"></i>
                <p>Delete</p>
            </div>
        </div>
    `;

    const openMenuBtn = noteItemEle.querySelector(".note-item--footer button");
    const updateNoteBtn = noteItemEle.querySelector(".note-item--menu .menu-item:nth-child(1)");
    const deleteNoteBtn = noteItemEle.querySelector(".note-item--menu .menu-item:nth-child(2)");
    openMenuBtn.addEventListener("click", () => openMenuClickHandler(id, openMenuBtn));
    updateNoteBtn.addEventListener("click", () => onEditClickHandler(id, title, description, updateNoteBtn));
    deleteNoteBtn.addEventListener("click", () => onDeleteClickHandler(id));

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
            <button>
                <i class="fa-solid fa-ellipsis"></i>
            </button>
        </div>
        <div class="note-item--menu" id=${id}>
            <div class="menu-item">
                <i class="fa-light fa-pencil"></i>
                <p>Edit</p>
            </div>
            <div class="menu-item">
                <i class="fa-regular fa-trash"></i>
                <p>Delete</p>
            </div>
        </div>
    `;

    const openMenuBtn = noteItemEle.querySelector(".note-item--footer button");
    const updateNoteBtn = noteItemEle.querySelector(".note-item--menu .menu-item:nth-child(1)");
    const deleteNoteBtn = noteItemEle.querySelector(".note-item--menu .menu-item:nth-child(2)");
    openMenuBtn.addEventListener("click", () => openMenuClickHandler(id, openMenuBtn));
    updateNoteBtn.addEventListener("click", () => onEditClickHandler(id, title, description, updateNoteBtn));
    deleteNoteBtn.addEventListener("click", () => onDeleteClickHandler(id));
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

        const dbService = new DBService();
        dbService.addNoteToDB({
            id: itemId,
            title,
            description,
            time
        }).then((message) => {
            showSuccessAlert(message);
            // alert(message);
        }).catch((error) => {
            console.error(error.message || error);    
        });;
    }

    if (id && title) {
        onClosePopupClickHandler();
        updateNote(id, title, description, time);

        const dbService = new DBService();
        dbService.updateNoteInDB({
            id,
            title,
            description,
            time
        }).then((message) => {
            // alert(message);
            showSuccessAlert(message);
        }).catch((error) => {
            console.error(error.message || error);    
        });
    }
}

async function initData() {
    const dbService = new DBService();
    dbService.getNoteDataList().then((result) => {
        result.forEach((item) => {
            generateNewNote(
                item.id,
                item.title,
                item.description,
                item.time
            );
        });
    }).catch((error) => {
        console.error(error.message || error);
    });
}

createNewNoteIcon.addEventListener("click", onOpenPopupClickHandler);
popupContainer.addEventListener("click", onPopupContainerClickHandler);
closePopupIcon.addEventListener("click", onClosePopupClickHandler);
popupForm.addEventListener("submit", onSubmitHandler);
document.addEventListener("DOMContentLoaded", initData.bind(this));
