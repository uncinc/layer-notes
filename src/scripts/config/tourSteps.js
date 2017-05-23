import routerHelper from '../components/router/routerHelper';

//the steps of the app
const tourSteps = [{
  step: 1,
  selector: '.ln-root', // the roout elemet, so it will be on top of the page
  title: 'Welcome!',
  body: 'This tutorial will explain how this tool works.',
  onStart: () => {}
}, {
  step: 2,
  selector: '.ln-toolbar',
  title: 'Sidebar',
  body: "This is the sidebar of the app. With the 'New Item' button you can create a new note. Press on 'Next', to create a new note.",
  onStart: () => {}
}, {
  step: 3,
  selector: '.ln-root', // the roout elemet, so it will be on top of the page
  title: 'Create new note',
  body: 'Select the area of your note, and add a comment. When you submit a note, there is a screenshot automaticaly added.',
  onStart: () => {
    routerHelper.setStateApp('startIssue');
  },
}, {
  step: 4,
  selector: '.ln-tickets-on-page--ticket', // a ticket
  title: 'Nice!',
  body: ' You have created your first note! Click on the icon to view your note. You now know how to create a note. Happy testing!',
  onStart: () => {
    //go to the home screen
    routerHelper.setStateApp('home');
  }
}];

/* Export  ==================================================================== */

export default tourSteps;
