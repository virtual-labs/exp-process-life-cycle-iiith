import { Kernel } from "./Kernel";

let kernel = new Kernel();

// document.getElementById("head").textContent = "Good to have you here";


const procedurePopupButton = document.getElementById("procedure") as HTMLButtonElement;
const procedurepopupWindow = document.getElementById("popup-window") as HTMLDivElement;
const closeButton = document.getElementById("close-button") as HTMLButtonElement;

procedurePopupButton.addEventListener("click", () => {
  popupWindow.style.display = "block";
});

closeButton.addEventListener("click", () => {
  popupWindow.style.display = "none";
});
