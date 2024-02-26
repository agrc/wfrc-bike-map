import { mediaMinWidth } from './utils';

const modal = document.getElementById('about-modal');
const button = document.getElementById('about-button');

button.onclick = () => {
  modal.open = true;
};

mediaMinWidth('m', (result) => {
  button.textEnabled = result.matches;
});
