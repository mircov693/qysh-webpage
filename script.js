function showHideMenu() {
    const menu = document.getElementById("menu");
    if (menu.className === "menu") {
        menu.className += "Mobile"
    } else {
        menu.className = "menu"
    }
}