document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body");

    for (let i = 0; i < 50; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";
        body.appendChild(star);
    }
});
