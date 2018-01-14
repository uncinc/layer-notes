'use strict';

import storage from './utils/storage';

const colorSelectors = document.querySelectorAll('.js-radio');

const setColor = (color) => {
  document.body.style.backgroundColor = color;
};

storage.get('color', (resp) => {
  const { color } = resp;

  let option;
  if (color) {
    option = document.querySelector(`.js-radio.${color}`);
    setColor(color);
  } else {
    option = colorSelectors[0];
  }

  option.setAttribute('checked', 'checked');
});

colorSelectors.forEach((el) => {
  el.addEventListener('click', () => {
    const { value } = this;

    storage.set(
      {
        color: value,
      },
      () => {
        setColor(value);
      },
    );
  });
});

//
// var optionsLink = document.querySelector('.js-options');
// optionsLink.addEventListener('click', function(e) {
//   e.preventDefault();
//   ext.tabs.create({'url': ext.extension.getURL('options.html')});
// })