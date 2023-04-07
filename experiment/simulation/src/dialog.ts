export function showDialog(message: string) {
    const dialogBox = document.createElement("p");
    dialogBox.textContent = message;
    const inst = document.getElementById("instruction");
    // inst.innerHTML = "";
    inst.appendChild(dialogBox);
    setTimeout(() => {
      inst.removeChild(dialogBox);
    }, 10000);
}