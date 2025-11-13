// Unit tests for JCM Form
// Run with: npm test (after setting up Jest)

describe('JCM Form Validation', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        // Load form HTML here or use jsdom
    });

    test('should validate required fields', () => {
        const emailField = document.getElementById('parent-email');
        emailField.value = '';
        
        expect(validateField(emailField)).toBe(false);
    });

    test('should validate email format', () => {
        const emailField = document.getElementById('parent-email');
        emailField.value = 'invalid-email';
        
        expect(validateEmail(emailField.value)).toBe(false);
        
        emailField.value = 'valid@email.com';
        expect(validateEmail(emailField.value)).toBe(true);
    });

    test('should validate phone number format', () => {
        const phoneField = document.getElementById('parent-phone-primary');
        phoneField.value = 'abc123';
        
        expect(validatePhone(phoneField.value)).toBe(false);
        
        phoneField.value = '+1234567890';
        expect(validatePhone(phoneField.value)).toBe(true);
    });

    test('should toggle children fields based on count', () => {
        const countSelect = document.getElementById('children-count');
        countSelect.value = '2';
        toggleChildrenFields();
        
        const container = document.getElementById('children-container');
        expect(container.children.length).toBe(2);
    });

    test('should show department field for Worker role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Worker';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentField = document.getElementById('department-field');
        expect(departmentField.style.display).toBe('block');
        expect(departmentField.querySelector('select').required).toBe(true);
    });

    test('should show department field for Assistant HOD role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Assistant HOD';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentField = document.getElementById('department-field');
        expect(departmentField.style.display).toBe('block');
        expect(departmentField.querySelector('select').required).toBe(true);
    });

    test('should show department field for HOD role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'HOD';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentField = document.getElementById('department-field');
        expect(departmentField.style.display).toBe('block');
        expect(departmentField.querySelector('select').required).toBe(true);
    });

    test('should show ministry field for Director role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Director';
        roleSelect.dispatchEvent(new Event('change'));
        
        const ministryField = document.getElementById('ministry-field');
        expect(ministryField.style.display).toBe('block');
        expect(ministryField.querySelector('select').required).toBe(true);
    });

    test('should show ministry field for Pastor role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Pastor';
        roleSelect.dispatchEvent(new Event('change'));
        
        const ministryField = document.getElementById('ministry-field');
        expect(ministryField.style.display).toBe('block');
        expect(ministryField.querySelector('select').required).toBe(true);
    });

    test('should NOT show department or ministry for Member role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Member';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentField = document.getElementById('department-field');
        const ministryField = document.getElementById('ministry-field');
        expect(departmentField.style.display).toBe('none');
        expect(ministryField.style.display).toBe('none');
    });

    test('should NOT show department or ministry for Visitor role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Visitor';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentField = document.getElementById('department-field');
        const ministryField = document.getElementById('ministry-field');
        expect(departmentField.style.display).toBe('none');
        expect(ministryField.style.display).toBe('none');
    });

    test('should validate department is required for Worker role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Worker';
        roleSelect.dispatchEvent(new Event('change'));
        
        const departmentSelect = document.getElementById('parent-department');
        departmentSelect.value = '';
        
        // Simulate validation
        const isValid = validateCurrentPage();
        expect(isValid).toBe(false);
    });

    test('should validate ministry is required for Director role', () => {
        const roleSelect = document.getElementById('parent-role');
        roleSelect.value = 'Director';
        roleSelect.dispatchEvent(new Event('change'));
        
        const ministrySelect = document.getElementById('parent-ministry');
        ministrySelect.value = '';
        
        // Simulate validation
        const isValid = validateCurrentPage();
        expect(isValid).toBe(false);
    });

    test('should navigate between pages', () => {
        currentPage = 1;
        nextPage();
        expect(currentPage).toBe(2);
        
        previousPage();
        expect(currentPage).toBe(1);
    });

    test('should save progress to localStorage', () => {
        const form = document.getElementById('jcm-form');
        document.getElementById('parent-email').value = 'test@example.com';
        
        saveProgress();
        
        const saved = JSON.parse(localStorage.getItem('jcm-form-progress'));
        expect(saved.parentEmail).toBe('test@example.com');
    });
});

// Helper functions for testing
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        return false;
    }
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
}