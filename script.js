// Form state management
let currentPage = 1;
const totalPages = 3;
let formData = {};

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadSavedProgress();
    setupConditionalFields();
    setupFileUploads();
});

// Initialize form functionality
function initializeForm() {
    updateProgressIndicator();
    showPage(1);
}

// Page navigation
function nextPage() {
    if (validateCurrentPage()) {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updateProgressIndicator();
        }
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        updateProgressIndicator();
    }
}

function showPage(pageNumber) {
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    document.querySelector(`.form-page[data-page="${pageNumber}"]`).classList.add('active');
    currentPage = pageNumber;
}

function updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber <= currentPage) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation
function validateCurrentPage() {
    const currentPageElement = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    const requiredFields = currentPageElement.querySelectorAll('[required]');
    let isValid = true;

    // Clear all previous errors first
    currentPageElement.querySelectorAll('.error').forEach(field => {
        clearError(field);
    });

    requiredFields.forEach(field => {
        // Skip validation for hidden conditional fields
        const conditionalContainer = field.closest('.conditional-field');
        if (conditionalContainer && conditionalContainer.style.display === 'none') {
            return; // Skip validation for hidden conditional fields
        }
        
        // Also skip if field itself is not visible
        if (field.offsetParent === null && field.type !== 'hidden' && field.type !== 'radio') {
            return;
        }
        
        // For radio buttons, check if any in the group is selected
        if (field.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                // Only show error on the first radio in the group
                if (radioGroup[0] === field) {
                    showError(field, 'This field is required');
                    isValid = false;
                }
            } else {
                clearError(field);
            }
            return;
        }
        
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            clearError(field);
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value)) {
                showError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    // Additional validation for role-based fields on page 1
    if (currentPage === 1) {
        const roleSelect = document.getElementById('parent-role');
        if (roleSelect && roleSelect.value) {
            const role = roleSelect.value;
            const departmentField = document.getElementById('department-field');
            const ministryField = document.getElementById('ministry-field');
            const departmentSelect = departmentField.querySelector('select');
            const ministrySelect = ministryField.querySelector('select');
            
            // Validate department for Worker, Assistant HOD, HOD
            if ((role === 'Worker' || role === 'Assistant HOD' || role === 'HOD') && 
                departmentField.style.display !== 'none') {
                if (!departmentSelect.value.trim()) {
                    showError(departmentSelect, 'Department is required for your role');
                    isValid = false;
                }
            }
            
            // Validate ministry for Director, Pastor
            if ((role === 'Director' || role === 'Pastor') && 
                ministryField.style.display !== 'none') {
                if (!ministrySelect.value.trim()) {
                    showError(ministrySelect, 'Ministry is required for your role');
                    isValid = false;
                }
            }
        }
    }

    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Conditional fields
function setupConditionalFields() {
    // Show department/ministry based on role
    const roleSelect = document.getElementById('parent-role');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            const departmentField = document.getElementById('department-field');
            const ministryField = document.getElementById('ministry-field');
            const departmentSelect = departmentField.querySelector('select');
            const ministrySelect = ministryField.querySelector('select');
            
            // Hide both fields by default
            departmentField.style.display = 'none';
            ministryField.style.display = 'none';
            departmentSelect.required = false;
            ministrySelect.required = false;
            
            // Show and require department for Worker, Assistant HOD, and HOD
            if (role === 'Worker' || role === 'Assistant HOD' || role === 'HOD') {
                departmentField.style.display = 'block';
                departmentSelect.required = true;
            }
            
            // Show and require ministry for Director and Pastor
            if (role === 'Director' || role === 'Pastor') {
                ministryField.style.display = 'block';
                ministrySelect.required = true;
            }
            
            // Visitor and Member don't need department or ministry
        });
    }

    // Show identification number based on identification type
    const idTypeSelect = document.getElementById('identification-type');
    if (idTypeSelect) {
        idTypeSelect.addEventListener('change', function() {
            const idType = this.value;
            const idNumberField = document.getElementById('identification-number-field');
            const votersCardField = document.getElementById('voters-card-field');
            
            if (idType) {
                idNumberField.style.display = 'block';
                idNumberField.querySelector('input').required = true;
            } else {
                idNumberField.style.display = 'none';
                idNumberField.querySelector('input').required = false;
            }

            if (idType === "Voter's Card") {
                votersCardField.style.display = 'block';
            } else {
                votersCardField.style.display = 'none';
            }
        });
    }
}

// Children fields
function toggleChildrenFields() {
    const count = parseInt(document.getElementById('children-count').value) || 0;
    const container = document.getElementById('children-container');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const childSection = createChildSection(i);
        container.appendChild(childSection);
    }
    
    // Set up file uploads for newly created child sections
    setupFileUploads();
}

function createChildSection(childNumber) {
    const section = document.createElement('div');
    section.className = 'child-section';
    section.innerHTML = `
        <h3>Child ${childNumber}</h3>
        <div class="form-group">
            <label>Full Name of Child ${childNumber} <span class="required">*</span></label>
            <div class="name-row">
                <input type="text" name="child${childNumber}FirstName" placeholder="First" required>
                <input type="text" name="child${childNumber}LastName" placeholder="Last" required>
            </div>
        </div>
        <div class="form-group">
            <label>Age of Child ${childNumber} <span class="required">*</span></label>
            <div class="date-selects">
                <select name="child${childNumber}Month" required>
                    <option value="">MM</option>
                    ${generateMonthOptions()}
                </select>
                <select name="child${childNumber}Day" required>
                    <option value="">DD</option>
                    ${generateDayOptions()}
                </select>
                <select name="child${childNumber}Year" required>
                    <option value="">YYYY</option>
                    ${generateYearOptions()}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Age Group Child ${childNumber} <span class="required">*</span></label>
            <select name="child${childNumber}AgeGroup" required>
                <option value="">Select Age Group</option>
                <option value="Creche (6 Months - 1 year)">Creche (6 Months - 1 year)</option>
                <option value="Ages 1-3">Ages 1-3</option>
                <option value="Ages 4-5">Ages 4-5</option>
                <option value="Ages 6-8">Ages 6-8</option>
                <option value="Ages 9-12">Ages 9-12</option>
            </select>
        </div>
        <div class="form-group">
            <label>Gender of Child ${childNumber} <span class="required">*</span></label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="child${childNumber}Gender" value="Male" required>
                    <span>Male</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="child${childNumber}Gender" value="Female" required>
                    <span>Female</span>
                </label>
            </div>
        </div>
        <div class="form-group">
            <label>Upload Picture of Child ${childNumber}</label>
            <div class="file-upload">
                <input type="file" id="child${childNumber}Picture" name="child${childNumber}Picture" accept="image/*">
                <label for="child${childNumber}Picture" class="file-upload-label">
                    <span class="upload-icon">📁</span>
                    <span>Drag & Drop Files, <span>Choose Files to Upload</span></span>
                </label>
                <p class="file-hint">A clear headshot Picture of Child ${childNumber}</p>
            </div>
        </div>
        <div class="form-group">
            <label>Relationship With Child ${childNumber} <span class="required">*</span></label>
            <select name="child${childNumber}Relationship" required onchange="toggleRelationshipFields(${childNumber}, this.value)">
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
            </select>
        </div>
        <div class="form-group conditional-field" id="parent-relationship-${childNumber}" style="display: none;">
            <label>Specify Relationship (Parent) For Child ${childNumber} <span class="required">*</span></label>
            <select name="child${childNumber}ParentRelationship">
                <option value="">Select</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
            </select>
        </div>
        <div class="form-group conditional-field" id="guardian-relationship-${childNumber}" style="display: none;">
            <label>Specify Relationship (Guardian) For Child ${childNumber} <span class="required">*</span></label>
            <select name="child${childNumber}GuardianRelationship">
                <option value="">Select</option>
                <option value="Grand Dad">Grand Dad</option>
                <option value="Grand Mum">Grand Mum</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div class="form-group">
            <label>Special Needs of Child ${childNumber} (any special type of care for the child)</label>
            <textarea name="child${childNumber}SpecialNeeds" rows="3" placeholder="Enter any special needs"></textarea>
        </div>
    `;
    return section;
}

function toggleRelationshipFields(childNumber, relationship) {
    const parentField = document.getElementById(`parent-relationship-${childNumber}`);
    const guardianField = document.getElementById(`guardian-relationship-${childNumber}`);
    
    if (relationship === 'Parent') {
        parentField.style.display = 'block';
        guardianField.style.display = 'none';
        parentField.querySelector('select').required = true;
        guardianField.querySelector('select').required = false;
    } else if (relationship === 'Guardian') {
        parentField.style.display = 'none';
        guardianField.style.display = 'block';
        parentField.querySelector('select').required = false;
        guardianField.querySelector('select').required = true;
    } else {
        parentField.style.display = 'none';
        guardianField.style.display = 'none';
        parentField.querySelector('select').required = false;
        guardianField.querySelector('select').required = false;
    }
}

// Caregiver fields
function toggleCaregiverFields() {
    const count = parseInt(document.getElementById('caregivers-count').value) || 0;
    const container = document.getElementById('caregivers-container');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const caregiverSection = createCaregiverSection(i);
        container.appendChild(caregiverSection);
    }
    
    // Set up file uploads for newly created caregiver sections
    setupFileUploads();
}

function createCaregiverSection(cgNumber) {
    const section = document.createElement('div');
    section.className = 'caregiver-section';
    const isFirst = cgNumber === 1;
    section.innerHTML = `
        <h3>${isFirst ? 'First' : 'Second'} Care Giver</h3>
        <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <div class="name-row">
                <input type="text" name="cg${cgNumber}FirstName" placeholder="First" ${isFirst ? 'required' : ''}>
                <input type="text" name="cg${cgNumber}LastName" placeholder="Last" ${isFirst ? 'required' : ''}>
            </div>
        </div>
        ${isFirst ? `
        <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" name="cg${cgNumber}Email" placeholder="Email" required>
        </div>
        <div class="form-group">
            <label>Gender <span class="required">*</span></label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="cg${cgNumber}Gender" value="Male" required>
                    <span>Male</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="cg${cgNumber}Gender" value="Female" required>
                    <span>Female</span>
                </label>
            </div>
        </div>
        <div class="form-group">
            <label>Role In Church</label>
            <select name="cg${cgNumber}Role">
                <option value="">Select Role</option>
                <option value="Visitor">Visitor</option>
                <option value="Member">Member</option>
                <option value="Worker">Worker</option>
                <option value="Assistant HOD">Assistant HOD</option>
                <option value="HOD">HOD</option>
                <option value="Director">Director</option>
                <option value="Pastor">Pastor</option>
            </select>
        </div>
        <div class="form-group">
            <label>Department In Church</label>
            <select name="cg${cgNumber}Department">
                <option value="">Select Department</option>
                <option value="Audio">Audio</option>
                <option value="Junior Church">Junior Church</option>
                <option value="Media">Media</option>
                <!-- Add other departments as needed -->
            </select>
        </div>
        <div class="form-group">
            <label>Ministry In Church</label>
            <select name="cg${cgNumber}Ministry">
                <option value="">Select Ministry</option>
                <option value="HOM">HOM</option>
                <option value="Evangelism & Missions">Evangelism & Missions</option>
                <!-- Add other ministries as needed -->
            </select>
        </div>
        <div class="form-group">
            <label>Relationship With Child(ren) <span class="required">*</span></label>
            <select name="cg${cgNumber}Relationship" required onchange="toggleCGRelationshipFields(${cgNumber}, this.value)">
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
            </select>
        </div>
        <div class="form-group conditional-field" id="cg-parent-relationship-${cgNumber}" style="display: none;">
            <label>Specify Relationship (Parent) For Children <span class="required">*</span></label>
            <select name="cg${cgNumber}ParentRelationship">
                <option value="">Select</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
            </select>
        </div>
        <div class="form-group conditional-field" id="cg-guardian-relationship-${cgNumber}" style="display: none;">
            <label>Relationship (Guardian) For Children <span class="required">*</span></label>
            <select name="cg${cgNumber}GuardianRelationship">
                <option value="">Select</option>
                <option value="Grand Dad">Grand Dad</option>
                <option value="Grand Mum">Grand Mum</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Other">Other</option>
            </select>
        </div>
        ` : ''}
        <div class="form-group">
            <label>Primary Phone Number ${isFirst ? '<span class="required">*</span>' : ''}</label>
            <input type="tel" name="cg${cgNumber}PhonePrimary" ${isFirst ? 'required' : ''}>
        </div>
        ${isFirst ? `
        <div class="form-group">
            <label>Secondary Phone Number</label>
            <input type="tel" name="cg${cgNumber}PhoneSecondary">
        </div>
        ` : ''}
        <div class="form-group">
            <label>Upload ${isFirst ? 'First' : 'Second'} CG Picture (A clear headshot Picture of CG)</label>
            <div class="file-upload">
                <input type="file" id="cg${cgNumber}Picture" name="cg${cgNumber}Picture" accept="image/*">
                <label for="cg${cgNumber}Picture" class="file-upload-label">
                    <span class="upload-icon">📁</span>
                    <span>Drag & Drop Files, <span>Choose Files to Upload</span></span>
                </label>
                <p class="file-hint">A clear headshot Picture of ${isFirst ? 'First' : 'Second'} CG</p>
            </div>
        </div>
    `;
    return section;
}

function toggleCGRelationshipFields(cgNumber, relationship) {
    const parentField = document.getElementById(`cg-parent-relationship-${cgNumber}`);
    const guardianField = document.getElementById(`cg-guardian-relationship-${cgNumber}`);
    
    if (relationship === 'Parent') {
        parentField.style.display = 'block';
        guardianField.style.display = 'none';
        parentField.querySelector('select').required = true;
        guardianField.querySelector('select').required = false;
    } else if (relationship === 'Guardian') {
        parentField.style.display = 'none';
        guardianField.style.display = 'block';
        parentField.querySelector('select').required = false;
        guardianField.querySelector('select').required = true;
    } else {
        parentField.style.display = 'none';
        guardianField.style.display = 'none';
        parentField.querySelector('select').required = false;
        guardianField.querySelector('select').required = false;
    }
}

// Helper functions for date options
function generateMonthOptions() {
    let options = '';
    for (let i = 1; i <= 12; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

function generateDayOptions() {
    let options = '';
    for (let i = 1; i <= 31; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

function generateYearOptions() {
    let options = '';
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1920; i--) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

// File upload handling - using event delegation for dynamically created inputs
let fileUploadHandlerSetup = false;

function setupFileUploads() {
    // Set up event delegation once at document level to handle all file inputs
    if (!fileUploadHandlerSetup) {
        document.addEventListener('change', function(e) {
            if (e.target && e.target.type === 'file') {
                const file = e.target.files[0];
                if (file) {
                    // Find the label associated with this input
                    const label = e.target.nextElementSibling;
                    if (label && label.classList.contains('file-upload-label')) {
                        const textSpan = label.querySelector('span:not(.upload-icon)');
                        if (textSpan) {
                            textSpan.innerHTML = `Drag & Drop Files, <span>${file.name}</span>`;
                        }
                    }
                }
            }
        });
        fileUploadHandlerSetup = true;
    }
}

// Save progress
function saveProgress() {
    const form = document.getElementById('jcm-form');
    const formDataObj = new FormData(form);
    const data = {};
    
    for (let [key, value] of formDataObj.entries()) {
        data[key] = value;
    }
    
    data.currentPage = currentPage;
    localStorage.setItem('jcm-form-progress', JSON.stringify(data));
    
    alert('Progress saved! You can continue later.');
}

function loadSavedProgress() {
    const saved = localStorage.getItem('jcm-form-progress');
    if (saved) {
        const data = JSON.parse(saved);
        if (confirm('You have saved progress. Would you like to continue?')) {
            // Restore form data
            Object.keys(data).forEach(key => {
                if (key !== 'currentPage') {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                    }
                }
            });
            
            if (data.currentPage) {
                currentPage = data.currentPage;
                showPage(currentPage);
                updateProgressIndicator();
            }
        }
    }
}

// Form submission
document.getElementById('jcm-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateCurrentPage()) {
        const formDataObj = new FormData(this);
        const data = {};
        
        for (let [key, value] of formDataObj.entries()) {
            data[key] = value;
        }
        
        // Here you would typically send data to a server
        console.log('Form submitted:', data);
        alert('Form submitted successfully! (This is a demo - data would be sent to server)');
        
        // Clear saved progress
        localStorage.removeItem('jcm-form-progress');
        this.reset();
        currentPage = 1;
        showPage(1);
        updateProgressIndicator();
    }
});