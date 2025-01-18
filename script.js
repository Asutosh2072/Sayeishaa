document.addEventListener('DOMContentLoaded', function () {
    const carouselElement = document.getElementById('carouselExampleIndicators');
    const carouselElement1 = document.getElementById('eventCarousel');
    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close-btn');
    const submitBtn = document.getElementById('submitBtn');
    const recaptchaCheckbox = document.getElementById('recaptcha_checkbox');
    const form = document.getElementById('contactForm');


    // Initialize the carousel
    if (carouselElement) {
        new bootstrap.Carousel(carouselElement, {
            interval: 3000,
            ride: 'carousel'
        });
    }
    if (carouselElement1) {
        new bootstrap.Carousel(carouselElement1, {
            interval: 3000,
            ride: 'carousel'
        });
    }

    // Handle popup close and restart the carousel
    if (closeButton && popup) {
        closeButton.addEventListener('click', function () {
           if(popup) {
             popup.style.display = 'none'; // Close the popup
            if (carouselElement) {
               new bootstrap.Carousel(carouselElement).cycle() // Restart the carousel cycle
            }
            if(carouselElement1){
               new bootstrap.Carousel(carouselElement1).cycle()
            }
           }
        });
    }

     // Form submission handling
     if (form) {
        //Initially disable the button
         if(submitBtn){
             submitBtn.setAttribute('disabled', true);
         }


         if(recaptchaCheckbox){
            recaptchaCheckbox.addEventListener('change',function(){
                console.log("checkbox changed")
                if (this.checked){
                    if(submitBtn){
                      submitBtn.removeAttribute('disabled')
                     console.log("button enabled")
                    }

                }else{
                    if(submitBtn){
                      submitBtn.setAttribute('disabled', true)
                       console.log("button disabled")
                    }
                }
            })
         }

        form.addEventListener('submit', function(event) {
          event.preventDefault();  // Prevent the default form submission
          console.log("form submission started")
           if (recaptchaCheckbox && !recaptchaCheckbox.checked){
              alert("Please confirm you are not a bot")
               return;
          }

            fetch(form.action, {
              method: 'POST',
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json'
              },
              body: new URLSearchParams(new FormData(form)).toString(), // or JSON.stringify(formData)
             })
             .then(response => {
               if (response.ok) {
                  return response.text();
               } else {
                   throw new Error('Network response was not ok.');
                }
             })
             .then(data => {
                 alert('Form submission successful: ' + data);
                 console.log(data)
                 form.reset();
                 if(submitBtn){
                   submitBtn.setAttribute('disabled', true);
                 }
                 if(recaptchaCheckbox){
                  recaptchaCheckbox.checked = false;
                 }

            })
               .catch(error => {
                   console.error('There was a problem with the fetch operation:', error);
                  alert('Form submission failed');
             });
         });
      }

    document.querySelectorAll(".btn-dark").forEach(button => {
       button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
             targetElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
});

// Show the popup when the page loads
window.onload = function () {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'flex'; // Show the popup
    }
};

// Function to redirect to LinkedIn and close the popup
function redirectToLinkedIn() {
    window.open("https://www.linkedin.com/company/sayeishaa-mep-and-arch-pvt-ltd/", "_blank"); // Open LinkedIn in a new tab
    closePopup(); // Close the popup in the current tab
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup');
   if (popup) {
      popup.style.display = 'none'; // Hide the popup
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const heroImage = document.querySelector('.hero-image img');
      if(heroImage){
         window.addEventListener('scroll', function () {
             const scrollPos = window.scrollY;
             heroImage.style.transform = `translateY(${-scrollPos / 6}px)`;
         });
     }
});





document.addEventListener("DOMContentLoaded", () => {
    // Function to animate the count for each element
   function animateCount(element, targetValue, duration) {
       let startValue = 0;
       let startTime = null;

      function step(timestamp) {
           if (!startTime) startTime = timestamp;
           const elapsed = timestamp - startTime;

            // Calculate progress (0 to 1)
           const progress = Math.min(elapsed / duration, 1);

            // Calculate the current value
           const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);

           // Update the element's text with the current value
          element.textContent = currentValue + "+";

           // Continue animation or finish
           if (progress < 1) {
              requestAnimationFrame(step);
            }
      }

      requestAnimationFrame(step);
    }

    // Select all elements with the 'data-target' attribute
    const counters = document.querySelectorAll(".count h3");

   counters.forEach((counter) => {
      const targetValue = parseInt(counter.getAttribute("data-target"), 10);
      const duration = 2000; // Duration of animation in milliseconds

      animateCount(counter, targetValue, duration);
   });
  });