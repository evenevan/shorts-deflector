export {};

const sliders = document.getElementsByName('slider');

console.log(1, sliders);

sliders.forEach((element) => {
    const slider = element as HTMLInputElement;
    const imageComparisonId = slider.getAttribute('data-image-comparison-id')!;
    const afterImage = document.getElementById(imageComparisonId) as HTMLImageElement;

    afterImage.style.width = `${Number(slider.value) / 2.5}%`;
    slider.addEventListener('input', () => {
        afterImage.style.width = `${Number(slider.value) / 2.5}%`;
    });
});

