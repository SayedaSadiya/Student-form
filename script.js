const form = document.getElementById('studentForm');
const successMessage = document.getElementById('successMessage');
const nameField = document.getElementById('name');

// Validation rules with updated requirements
const validations = {
    name: {
        validate: (value) => value.trim().length >= 5,
        error: 'Name must be at least 5 characters long'
    },
    email: {
        validate: (value) => {
            const hasAtSymbol = value.includes('@');
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            return hasAtSymbol && isValidEmail;
        },
        error: 'Enter correct email (must contain @ symbol)'
    },
    phone: {
        validate: (value) => {
            const digitsOnly = value.replace(/\D/g, '');
            const is10Digits = digitsOnly.length === 10;
            const isNotSequential = digitsOnly !== '1234567890' && digitsOnly !== '0123456789';
            const isNotRepeating = !/(\d)\1{9}/.test(digitsOnly); // Not all same digits
            const isNotSpecialPattern = digitsOnly !== '1234567890' && digitsOnly !== '9876543210' && digitsOnly !== '1111111111' && digitsOnly !== '0000000000';
            
            return is10Digits && isNotSequential && isNotRepeating && isNotSpecialPattern;
        },
        error: 'Phone number must be a valid 10-digit number (not 123456789 or sequential numbers)'
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
    password: {
        validate: (value) => {
            const userName = nameField.value.trim().toLowerCase();
            const isLongEnough = value.length >= 8;
            const isNotPassword = value.toLowerCase() !== 'password';
            const isNotUserName = !value.toLowerCase().includes(userName);
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
            
            return isLongEnough && isNotPassword && isNotUserName && hasLetter && hasNumber && hasSpecialChar;
        },
        error: 'Password is not strong. Must be at least 8 characters, not "password" or your name, and include letters, numbers, and special characters'
    },
    confirmPassword: {
        validate: (value) => {
            const password = document.getElementById('password').value;
            return value === password && value.length > 0;
        },
        error: 'Password and confirm password must match'
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

// Password strength indicator
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    
    strengthIndicator.classList.remove('weak', 'fair', 'good', 'strong');
    if (password.length === 0) {
        strengthIndicator.classList.remove('weak', 'fair', 'good', 'strong');
    } else if (strength <= 1) {
        strengthIndicator.classList.add('weak');
    } else if (strength === 2) {
        strengthIndicator.classList.add('fair');
    } else if (strength === 3) {
        strengthIndicator.classList.add('good');
    } else if (strength >= 4) {
        strengthIndicator.classList.add('strong');
    }
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
        console.log('Form has validation errors');
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
    
    // Log form data (password not stored in localStorage for security)
    console.log('Form submitted:', formData);
    
    // Show success message
    successMessage.textContent = `Thank you ${formData.name}! Your registration has been submitted successfully.`;
    successMessage.classList.add('show');
    
    // Store data in localStorage (excluding password for security)
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(formData);
    localStorage.setItem('students', JSON.stringify(students));
    
    // Reset form
    form.reset();
    document.querySelectorAll('input, select').forEach(field => {
        field.style.borderColor = '#e0e0e0';
    });
    document.getElementById('passwordStrength').classList.remove('weak', 'fair', 'good', 'strong');
    
    // Hide success message after 4 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);
});

// Clear error messages when user starts typing
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('focus', () => {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) errorElement.textContent = '';
    });
});

// Real-time validation for confirm password
document.getElementById('confirmPassword').addEventListener('input', () => {
    const confirmPasswordField = document.getElementById('confirmPassword');
    validateField(confirmPasswordField);
});
