document.addEventListener('DOMContentLoaded', () => {
  const imageCount = 18; // adjust if you have more or fewer images
  const folderPath = '/assets/images/header/';
  const extension = '.jpg';

  const randomIndex = Math.floor(Math.random() * imageCount) + 1;
  const imageUrl = `${folderPath}${randomIndex}${extension}`;

  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    topBar.style.backgroundImage = `url(${imageUrl})`;
    topBar.style.backgroundSize = 'cover';
    topBar.style.backgroundPosition = 'centre';
  }
});
