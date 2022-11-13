"use strict";

class DBService {
    constructor() {
        const indexedDB = window.indexedDB
            || window.mozIndexedDB
            || window.webkitIndexedDB
            || window.msIndexedDB
            || window.shimIndexedDB;

        this.request = indexedDB.open("NotesDatabase", 1);

        this.request.onerror = (event) => {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };

        this.request.onupgradeneeded = (event) => {
            this.db = event.target.result;

            const objectStore = this.db.createObjectStore("notes", { keyPath: "id" });
        
            objectStore.createIndex("title", "title", { unique: false });
            objectStore.createIndex("description", "description", { unique: false });
            objectStore.createIndex("time", "time", { unique: false });
        };

        this.request.onsuccess = (event) => {
            this.db = event.target.result;
        };
    }

    addNoteToDB(note) {
        return new Promise((resolve, reject) => {
            this.request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction("notes", "readwrite");
                const store = transaction.objectStore("notes");
                const request = store.add(note);;
                request.onsuccess = () => {
                    resolve("New Note has been added successfully.");
                }
                request.onerror = (e) => {
                    reject(`GET error: ${e.target.errorCode}`);
                }
            };
        });
    }
    
    updateNoteInDB(note) {
        return new Promise((resolve, reject) => {
            this.request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction("notes", "readwrite");
                const store = transaction.objectStore("notes");
                const request = store.put(note);;
                request.onsuccess = () => {
                    resolve("Note has been updated successfully.");
                }
                request.onerror = (e) => {
                    reject(`GET error: ${e.target.errorCode}`);
                }
            };
        });
    }
    
    deleteNoteInDB(id) {
        return new Promise((resolve, reject) => {
            this.request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction("notes", "readwrite");
                const store = transaction.objectStore("notes");
                const request = store.delete(id);;
                request.onsuccess = () => {
                    resolve("Note has been deleted successfully.");
                }
                request.onerror = (e) => {
                    reject(`GET error: ${e.target.errorCode}`);
                }
            };
        });
    }
    
    getNoteDataList() {
        return new Promise((resolve, reject) => {
            this.request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction("notes", "readwrite");
                const store = transaction.objectStore("notes");
                const request = store.getAll();
                request.onsuccess = (e) => {
                    resolve(e.target.result || []);
                }
                request.onerror = (e) => {
                    reject(`GET error: ${e.target.errorCode}`);
                }
            };
        });
    }
}

export default DBService;