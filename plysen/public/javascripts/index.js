document.addEventListener('DOMContentLoaded', (event) => {
    const kalkulatorKnapp = document.getElementById('kalkulator');
    const ullLagerKnapp = document.getElementById('ullLager');

    kalkulatorKnapp.addEventListener('click', () => {
        window.location.href = '/kalkulator';
    });

    ullLagerKnapp.addEventListener('click', () => {
        window.location.href = '/ullLager';
    });
});