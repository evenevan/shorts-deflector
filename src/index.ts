const navButton = document.getElementById('navButton') as HTMLButtonElement;
const nav = document.getElementById('nav') as HTMLDivElement;

navButton.addEventListener('click', () => {
    nav.classList.toggle('hidden');
});