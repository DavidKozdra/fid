(function() {
    const footer = document.getElementsByTagName("footer")[0];
    const currentYear = new Date().getFullYear();
    footer.textContent += "© " + currentYear + " Black Goose Bistro LLC";
    highlightCurrentNav()
})();
const slides = document.getElementsByClassName("slide");
let currentSlide = 0;
function changeCurrentSlide(step) {
    slides[currentSlide].style.display = "none";
    currentSlide += step;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide > slides.length - 1) {
        currentSlide = 0;
    }
    slides[currentSlide].style.display = "inline";
}
setInterval(function(){ changeCurrentSlide(1); }, 2000);


function highlightCurrentNav(){
    // get all lis in the ul in nav
    let lis = document.getElementsByClassName("li");
    
}