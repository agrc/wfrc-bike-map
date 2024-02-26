import { mediaQuery } from './utils';

const modal = document.getElementById('about-modal');
const button = document.getElementById('about-button');

button.onclick = () => {
  modal.open = true;
};

mediaQuery('(min-width: 600px)', (media) => {
  button.textEnabled = media.matches;
});
