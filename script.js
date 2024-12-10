// Initialize EmailJS
emailjs.init('3ZzvdNg22T3wgkt24'); // Replace 'YOUR_USER_ID' with your EmailJS User ID

// Handle form submission
document.getElementById('feedbackForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page reload

    // Collect form data
    const formData = {
        from_name: document.getElementById('name').value,  // Matches {{from_name}} in EmailJS template
        from_email: document.getElementById('email').value,  // Matches {{from_email}}
        message: document.getElementById('feedback').value,  // Matches {{message}}
    };

    // Send email using EmailJS
    emailjs.send('service_xkcjz7b', 'template_ftn2bum', formData)
        .then(function (response) {
            alert('Feedback sent successfully!');
            document.getElementById('feedbackForm').reset(); // Reset the form
        })
        .catch(function (error) {
            alert('Failed to send feedback. Please try again later.');
            console.error('EmailJS Error:', error);
        });
});
