// Youth For Earth - Contact Form with Google Sheets Integration
// This file handles the contact form submission and validation

// Google Sheets configuration
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1f-o_Koq5mmQiTcv509BIccQ-rEUfxjE4p-6ODWsir9I/edit?usp=sharing';

// Google Apps Script Web App URL - this is where form data gets sent
// This URL connects to a Google Apps Script that saves data to the spreadsheet
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7Ur-x1-LpVgGF1YoXHYokfHlO35PPBGu6eGw69ypBoUtsyjFZvJx1IrgcNqPC_voK/exec';

// Initialize the contact form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();  // Set up form validation and submission
});

// Initialize the contact form - set up event listeners and validation
function initContactForm() {
    // Get references to the form and submit button
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Exit if form elements don't exist
    if (!form || !submitBtn) return;
    
    // Add event listener for form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation to all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);    // Validate when user leaves field
        input.addEventListener('input', clearFieldError); // Clear errors when user types
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    if (window.YouthForEarth && window.YouthForEarth.showLoading) {
        window.YouthForEarth.showLoading(submitBtn, true);
    }
    
    // Prepare data for Google Sheets
    const data = {
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        email: formData.get('email'),
        age: formData.get('age'),
        location: formData.get('location'),
        interest: formData.get('interest'),
        involvement: formData.get('involvement'),
        experience: formData.get('experience') || 'Not specified',
        skills: formData.get('skills') || 'Not specified',
        message: formData.get('message') || 'No additional message',
        newsletter: formData.get('newsletter') === 'on' ? 'Yes' : 'No'
    };
    
    // Submit to Google Sheets
    submitToGoogleSheets(data)
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            showErrorMessage();
        })
        .finally(() => {
            // Hide loading state
            if (window.YouthForEarth && window.YouthForEarth.showLoading) {
                window.YouthForEarth.showLoading(submitBtn, false);
            }
        });
}

function submitToGoogleSheets(data) {
    // Submit to Google Sheets via Google Apps Script
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => {
        // Since we're using no-cors mode, we can't read the response
        // But if we get here without an error, it likely succeeded
        return { ok: true };
    }).catch(error => {
        console.error('Error submitting to Google Sheets:', error);
        throw error;
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(e);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    
    // Create or update error message
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function showSuccessMessage() {
    const message = `
        <div class="message success">
            <h3>🎉 Welcome to Youth For Earth!</h3>
            <p>Thank you for joining our movement! We've received your information and will be in touch soon with ways to get involved.</p>
            <p>In the meantime, check out our <a href="facts.html">Global Facts</a> page to learn more about climate change.</p>
        </div>
    `;
    
    if (window.YouthForEarth && window.YouthForEarth.showMessage) {
        window.YouthForEarth.showMessage(message, 'success');
    }
}

function showErrorMessage() {
    const message = `
        <div class="message error">
            <h3>❌ Submission Failed</h3>
            <p>We're sorry, but there was an error submitting your form. Please try again or contact us directly at hello@youthforearth.org</p>
        </div>
    `;
    
    if (window.YouthForEarth && window.YouthForEarth.showMessage) {
        window.YouthForEarth.showMessage(message, 'error');
    }
}

// Google Sheets integration is configured and ready to use
