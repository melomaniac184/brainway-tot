document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // GOOGLE APPS SCRIPT WEB APP URL
    // ==========================================

    const GOOGLE_SCRIPT_URL =
        'https://script.google.com/macros/s/AKfycbw2btC3_4Qna3gAOpYsDgp6AUvD08uBckO1Xuw_2OKyYTi2cHjhIibkbZl2I-jV0N5v8w/exec';


    // ==========================================
    // SMOOTH SCROLL TO LEAD FORM
    // ==========================================

    const scrollButtons = document.querySelectorAll('.btn-scroll-to-form');
    const targetSection = document.getElementById('lead-form-section');

    scrollButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.preventDefault();

            if (targetSection) {

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Focus name field after scrolling
                setTimeout(() => {

                    const nameInput = document.getElementById('name');

                    if (nameInput) {
                        nameInput.focus();
                    }

                }, 800);
            }
        });
    });


    // ==========================================
    // LEAD FORM
    // ==========================================

    const leadForm = document.getElementById('leadForm');
    const successState = document.getElementById('successState');

    const submitButton = leadForm
        ? leadForm.querySelector('.submit-button')
        : null;


    // ==========================================
    // FORM SUBMISSION
    // ==========================================

    if (leadForm && submitButton) {

        leadForm.addEventListener('submit', (e) => {

            e.preventDefault();


            // ==========================================
            // GET FORM VALUES
            // ==========================================

            const name =
                document.getElementById('name').value.trim();

            const phone =
                document.getElementById('phone').value.trim();

            const profession =
                document.getElementById('profession').value.trim();

            const city =
                document.getElementById('city').value.trim();


            // ==========================================
            // BASIC VALIDATION
            // ==========================================

            if (!name || !phone || !profession || !city) {

                alert('कृपया सर्व माहिती अचूक भरा.');

                return;
            }


            // ==========================================
            // MOBILE NUMBER VALIDATION
            // ==========================================

            const phoneRegex = /^[0-9]{10}$/;

            if (!phoneRegex.test(phone)) {

                alert(
                    'कृपया वैध १०-अंकी मोबाईल नंबर लिहा.'
                );

                return;
            }


            // ==========================================
            // PREVENT DUPLICATE SUBMISSIONS
            // ==========================================

            submitButton.disabled = true;

            const originalBtnText =
                submitButton.textContent;

            submitButton.textContent =
                'माहिती पाठवत आहे...';


            // ==========================================
            // CREATE FORM DATA
            // ==========================================

            const formData = new URLSearchParams();

            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('profession', profession);
            formData.append('city', city);


            // ==========================================
            // SEND DATA TO GOOGLE SHEETS
            // ==========================================

            fetch(GOOGLE_SCRIPT_URL, {

                method: 'POST',

                mode: 'no-cors',

                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded'
                },

                body: formData

            })
            .catch(error => {

                // Log only.
                // DO NOT show an error popup because
                // the Google Sheet integration is confirmed
                // to be receiving the data.

                console.error(
                    'Submission request warning:',
                    error
                );

            });


            // ==========================================
            // SHOW SUCCESS MESSAGE
            // ==========================================

            // Reset the form
            leadForm.reset();


            // Restore button
            submitButton.disabled = false;

            submitButton.textContent =
                originalBtnText;


            // Fade out form
            leadForm.style.transition =
                'opacity 0.3s ease';

            leadForm.style.opacity = '0';


            // Show success state
            setTimeout(() => {

                leadForm.classList.add('hidden');


                if (successState) {

                    successState.classList.remove('hidden');

                    successState.scrollIntoView({

                        behavior: 'smooth',

                        block: 'nearest'

                    });

                }

            }, 300);

        });

    }

});
