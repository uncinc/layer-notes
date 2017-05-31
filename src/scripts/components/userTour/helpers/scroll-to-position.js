import helpers from '../../../utils/helpers';

export default function scrollToPosition(el, position) {
  helpers.scrollTo(0, position);
  return el.getBoundingClientRect();
}
