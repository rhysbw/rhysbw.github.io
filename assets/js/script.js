// JavaScript to toggle sections when tabs are clicked
function showSection(sectionId, buttonElement) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        section.classList.remove('active');
    });

    // Show the clicked section
    const sectionToShow = document.querySelector(`.${sectionId}`);
    sectionToShow.classList.add('active');

    // Reset the color of all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((button) => {
        button.style.backgroundColor = '#333'; // Reset to the default color
    });

    // Change the color of the clicked button
    buttonElement.style.backgroundColor = 'rgb(117, 111, 111)';
}
showSection('aboutme', document.querySelector('.tab-button'));