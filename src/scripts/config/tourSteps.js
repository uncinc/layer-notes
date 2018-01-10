import routerHelper from '../components/router/routerHelper';
import { translate } from '../utils/helpers';

// the steps of the app
const tourSteps = [
  {
    step: 1,
    selector: '.ln-root', // the roout elemet, so it will be on top of the page
    title: translate('userTourStepOneTitle'),
    body: translate('userTourStepOneBody'),
    onStart: () => {},
  },
  {
    step: 2,
    selector: '.ln-toolbar',
    title: translate('userTourStepTwoTitle'),
    body: translate('userTourStepTwoBody'),
    onStart: () => {},
  },
  {
    step: 3,
    selector: '.ln-root', // the roout elemet, so it will be on top of the page
    title: translate('userTourStepTreeTitle'),
    body: translate('userTourStepTreeBody'),
    onStart: () => {
      routerHelper.setStateApp('startIssue');
    },
  },
  {
    step: 4,
    selector: '.ln-tickets-on-page--ticket', // a ticket
    title: translate('userTourStepFourTitle'),
    body: translate('userTourStepFourBody'),
    onStart: () => {
      // go to the home screen
      routerHelper.setStateApp('home');
    },
  },
];

/* Export  ==================================================================== */

export default tourSteps;