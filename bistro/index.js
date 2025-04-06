
const currentYear = new Date().getFullYear();


const slides = document.getElementsByClassName("slide");
let currentSlide = 0;

const copyrightSpan = document.createElement("span");

function changeCurrentSlide(step) {
    if (!slides || !slides[currentSlide]) return

    console.log("STEP", step)
    slides[currentSlide].style.display = "none";
    currentSlide += step;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slides[currentSlide].style.display = "inline";
}

document.addEventListener("DOMContentLoaded", function () {

    const footer = document.getElementById("cpy")
    // Footer update
    copyrightSpan.textContent = ` © ${currentYear} Black Goose Bistro LLC`;

    footer.appendChild(document.createElement("br"));
    footer.appendChild(copyrightSpan);

    // Image slider


    // Start slideshow
    setInterval(() => changeCurrentSlide(1), 2000);

    // Highlight current nav item based on URL
    function highlightCurrentNav() {
        const navLinks = document.querySelectorAll(".nav-links a");
        console.log("LINKS !", navLinks)
        const currentPath = window.location.pathname.replace("/bistro/", "")
        navLinks.forEach((link) => {

        console.log(currentPath,link.getAttribute("href") )
            if (link.getAttribute("href") === currentPath) {
                console.log("FOUND")
                link.classList.add("active");
            }
        });
    }

    highlightCurrentNav();
});
