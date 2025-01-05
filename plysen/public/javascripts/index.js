document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.nav-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.id;
            window.location.href = `/${targetId}`;
        });
    });
});