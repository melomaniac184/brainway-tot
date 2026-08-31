document.addEventListener('DOMContentLoaded', () => {
    // Deployed Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2btC3_4Qna3gAOpYsDgp6AUvD08uBckO1Xuw_2OKyYTi2cHjhIibkbZl2I-jV0N5v8w/exec';

    // 1. Smooth scroll to Lead Form when CTA buttons are clicked
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

                // Focus the first input field after scrolling completes
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 800);
            }
        });
    });

    // 2. Lead Form Submission to Google Sheet
    const leadForm = document.getElementById('leadForm');
    const successState = document.getElementById('successState');
    const submitButton = leadForm ? leadForm.querySelector('.submit-button') : null;

    if (leadForm && submitButton) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract input values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const profession = document.getElementById('profession').value.trim();
            const city = document.getElementById('city').value.trim();

            // Basic validation
            if (!name || !phone || !profession || !city) {
                alert('कृपया सर्व माहिती अचूक भरा.');
                return;
            }

            // Verify 10-digit mobile number pattern
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                alert('कृपया वैध १०-अंकी मोबाईल नंबर लिहा.');
                return;
            }

            // Disable button and change text to prevent duplicate submissions
            submitButton.disabled = true;
            const originalBtnText = submitButton.textContent;
            submitButton.textContent = 'माहिती पाठवत आहे...';

            // Construct url-encoded form body
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('profession', profession);
            formData.append('city', city);

            // POST form details to Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.result === 'success') {
                    // Reset the form inputs
                    leadForm.reset();

                    // Success transition
                    leadForm.style.transition = 'opacity 0.3s ease';
                    leadForm.style.opacity = '0';

                    setTimeout(() => {
                        leadForm.classList.add('hidden');
                        if (successState) {
                            successState.classList.remove('hidden');
                            successState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 300);
                } else {
                    throw new Error(data.error || 'Unknown server error');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('माहिती पाठवताना तांत्रिक बिघाड झाला. कृपया पुन्हा प्रयत्न करा.');
                
                // Re-enable button on failure
                submitButton.disabled = false;
                submitButton.textContent = originalBtnText;
            });
        });
    }
});
