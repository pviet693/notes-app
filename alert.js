function showSuccessAlert(message, time = 3000) {
    const alertEle = document.querySelector(".alert");
    const btnCloseAlert = alertEle.querySelector("button");
    alertEle.classList.remove("hide");
    alertEle.classList.add("showAlert");
    alertEle.classList.add("show");
    setTimeout(() => {
        alertEle.classList.remove("showAlert");
        alertEle.classList.remove("show");
        alertEle.classList.add("hide");
    }, time);
    
    btnCloseAlert.addEventListener("click", () => {
        alertEle.classList.remove("showAlert");
        alertEle.classList.remove("show");
        alertEle.classList.add("hide");
    });
}

export { showSuccessAlert };