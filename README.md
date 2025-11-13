# Junior Church Monitor (JCM) Form

A multi-step registration form for the Household of David church's Junior Church Monitor system.

## Features

- **Multi-page Form**: Three-step form process (Parent Info → Child Info → Caregiver Info)
- **Dynamic Fields**: Conditional fields that show/hide based on user selections
- **Progress Tracking**: Visual progress indicator and save/resume functionality
- **Form Validation**: Client-side validation for required fields, emails, and phone numbers
- **File Uploads**: Support for image uploads (parent picture, child pictures, identification documents)
- **Responsive Design**: Mobile-friendly layout that works on all devices

## File Structure

```
jcm/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── script.js           # Form logic and validation
├── tests/
│   └── form.test.js   # Unit tests
├── README.md          # This file
└── logo.png           # Church logo
```

## Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in a web browser
3. No build process required - works directly in the browser

## Usage

### For Users

1. Fill out the **Parent Information** page
2. Click "Next" to proceed to **Child's Information**
3. Select the number of children and fill in their details
4. Click "Next" to proceed to **Care Giver** information
5. Optionally add caregiver information
6. Click "Submit" to complete registration

### Save and Resume

- Click "Save and Complete Later" at any point to save your progress
- Progress is saved to browser's localStorage
- When you return, you'll be prompted to continue from where you left off

## Form Fields

### Page 1: Parent Information

- Full Name (First & Last)
- Email
- Gender
- Role in Church
  - **Visitor/Member**: No additional fields required
  - **Worker/Assistant HOD/HOD**: Department field required
  - **Director/Pastor**: Ministry field required
- Primary & Secondary Phone Numbers
- Means of Identification
- Identification Number (conditional)
- Voter's Card Upload (conditional)
- Parent Picture Upload
- Address

### Page 2: Child's Information

- Number of Children (1-4)
- For each child:
  - Full Name
  - Date of Birth
  - Age Group
  - Gender
  - Picture Upload
  - Relationship with Parent/Guardian
  - Special Needs (optional)

### Page 3: Care Giver

- Number of Caregivers (0-2)
- For each caregiver:
  - Full Name
  - Email (First CG only)
  - Gender (First CG only)
  - Role, Department, Ministry (First CG only)
  - Phone Numbers
  - Relationship with Children
  - Picture Upload

## Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No dependencies required

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Local Storage

Form progress is saved to `localStorage` with the key `jcm-form-progress`. Data expires after 30 days (handled by browser).

## Running the project

With python installed, at the root of the project, run:
`   python -m http.server
  `

## Testing

### Running Tests

To run unit tests, you'll need to set up a testing environment:

```bash
npm install --save-dev jest @testing-library/dom jsdom
```

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Run tests:

```bash
npm test
```

### Test Coverage

Tests cover:

- Form validation (required fields, email, phone)
- Conditional field display logic
- Page navigation
- Progress saving/loading
- Dynamic field generation (children, caregivers)
- Role-based field requirements (department/ministry)

## Customization

### Styling

Modify `styles.css` to change colors, fonts, or layout. Key CSS variables:

- `--primary-color`: Main brand color (default: #ab0505)
- `--secondary-color`: Secondary text color
- `--border-color`: Form border color

### Form Fields

To add/remove fields, modify the HTML in `index.html` and update validation in `script.js`.

## Form Submission

Currently, the form logs data to console on submission. To integrate with a backend:

1. Update the form submission handler in `script.js`
2. Replace the `console.log` with an API call:

```javascript
fetch("/api/submit-form", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    // Handle success
  })
  .catch((error) => {
    // Handle error
  });
```

## Role-Based Field Requirements

The form implements role-based conditional fields:

- **Visitor/Member**: No department or ministry fields shown
- **Worker/Assistant HOD/HOD**: Department field is required
- **Director/Pastor**: Ministry field is required

Validation automatically enforces these requirements when users attempt to proceed to the next page.

## Security Considerations

- Client-side validation should be supplemented with server-side validation
- File uploads should be validated on the server
- Sensitive data (addresses, identification numbers) should be encrypted in transit
- Implement CSRF protection for form submissions

## License

This project is created for Household of David church.

## Support

For updates or issues, contact the Tech Team:
[WhatsApp Link](https://chat.whatsapp.com/BMuwF2ACLkdBTMxCLBB1pO)

## Version History

- **v1.0.0** (Current): Initial release with all three form pages and basic functionality
