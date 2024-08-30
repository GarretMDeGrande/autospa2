document.addEventListener('DOMContentLoaded', loadTestimonials);

document.getElementById('testimonyForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission

    // Get form values
    const testimonyText = document.getElementById('userTestimony').value;
    const displayName = document.getElementById('userDisplayName').value;
    const imageFile = document.getElementById('testimonyImage').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result; // Base64-encoded image URL
            const testimonial = { text: testimonyText, name: displayName, imageUrl };
            saveTestimonial(testimonial);
            addTestimonialToCarousel(testimonial);
        };
        reader.readAsDataURL(imageFile); // Convert image to Base64
    } else {
        const testimonial = { text: testimonyText, name: displayName, imageUrl: null };
        saveTestimonial(testimonial);
        addTestimonialToCarousel(testimonial);
    }

    // Clear form
    document.getElementById('testimonyForm').reset();
});

function saveTestimonial(testimonial) {
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonials.push(testimonial);
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
}

function loadTestimonials() {
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonials.forEach((testimonial, index) => addTestimonialToCarousel(testimonial, index));
}

function addTestimonialToCarousel(testimonial, index) {
    const testimonialSlides = document.getElementById('testimonialSlides');
    const testimonialIndicators = document.getElementById('testimonialIndicators');

    // Create new slide
    const slide = document.createElement('div');
    slide.className = 'carousel-item';
    if (index === 0 && !testimonialSlides.querySelector('.carousel-item.active')) {
        slide.classList.add('active'); // Make the first slide active if none are active
    }
    slide.innerHTML = `
        <p>${testimonial.text}</p>
        <p><b>- ${testimonial.name} -</b></p>
        ${testimonial.imageUrl ? `<img src="${testimonial.imageUrl}" alt="Testimonial Image">` : ''}
        <button onclick="deleteTestimonial(${index}, this)" class="btn btn-danger btn-sm">Delete</button>
    `;
    testimonialSlides.appendChild(slide);

    // Create new indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#testimonialCarousel');
    indicator.setAttribute('data-slide-to', index);
    if (index === 0 && !testimonialIndicators.querySelector('.active')) {
        indicator.classList.add('active'); // Make the first indicator active if none are active
    }
    testimonialIndicators.appendChild(indicator);
}

function deleteTestimonial(index, button) {
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonials.splice(index, 1); // Remove the testimonial at the given index
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    loadTestimonials(); // Reload testimonials to update the carousel

    // Remove the current slide and update the active state
    button.closest('.carousel-item').remove();
    document.querySelector(`#testimonialCarousel .carousel-item`).classList.add('active');
}
