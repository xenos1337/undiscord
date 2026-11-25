import trustedHtml from './trustedHtml';

export default function createElm(html) {
  const temp = document.createElement('div');
  temp.innerHTML = trustedHtml(html);
  return temp.removeChild(temp.firstElementChild);
}
