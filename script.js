const form = document.getElementById('studentForm');
const successMessage = document.getElementById('successMessage');

// Validation rules
const validations = {
    name: {
        validate: (value) => value.trim().length >= 3,
        error: 'Name must be at least 3 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        error: 'Please enter a valid email address'
    },
    phone: {
        validate: (value) => /^\d{10}$/.test(value.replace(/\D/g, '')),
        error: 'Phone number must be 10 digits'
    },
    studentId: {
        validate: (value) => value.trim().length >= 4,
        error: 'Student ID must be at least 4 characters'
    },
    course: {
        validate: (value) => value !== '',
        error: 'Please select a course'
    },
    dob: {
        validate: (value) => {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            return age >= 16 && age <= 100;
        },
        error: 'Age must be between 16 and 100 years'
    },
    terms: {
        validate: (value) => value,
        error: 'You must agree to the terms and conditions'
    }
};

// Real-time validation on input
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
});

// Validate a single field
function validateField(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (!errorElement) return true;
    
    const validation = validations[fieldName];
    if (!validation) return true;
    
    let isValid = false;
    
    if (field.type === 'checkbox') {
        isValid = validation.validate(field.checked);
    } else {
        isValid = validation.validate(field.value);
    }
    
    if (!isValid) {
        errorElement.textContent = validation.error;
        field.style.borderColor = '#ff6b6b';
        return false;
    } else {
        errorElement.textContent = '';
        field.style.borderColor = '#e0e0e0';
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isFormValid = true;
    document.querySelectorAll('input, select').forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    return isFormValid;
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        console.log('Form has errors');
        return;
    }
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        studentId: document.getElementById('studentId').value,
        course: document.getElementById('course').value,
        dob: document.getElementById('dob').value,
        submittedAt: new Date().toLocaleString()
    };
    
    // Log form data (in real app, you would send this to a server)
    console.log('Form submitted:', formData);
    
    // Show success message
    successMessage.textContent = `Thank you ${formData.name}! Your registration has been submitted.`;
    successMessage.classList.add('show');
    
    // Store data in localStorage
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(formData);
    localStorage.setItem('students', JSON.stringify(students));
    
    // Reset form
    form.reset();
    document.querySelectorAll('input, select').forEach(field => {
        field.style.borderColor = '#e0e0e0';
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
});

// Clear error messages when user starts typing
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('focus', () => {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) errorElement.textContent = '';
    });
});
