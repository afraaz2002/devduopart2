let index = 0;
const slides = document.querySelectorAll(".slide");

function moveSlide(step) {
    slides[index].classList.remove("active");
    index = (index + step + slides.length) % slides.length;
    slides[index].classList.add("active");
}

setInterval(() => moveSlide(1), 3000); 
