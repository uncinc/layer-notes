'use strict';

import storage from './utils/storage';

var colorSelectors = document.querySelectorAll('.js-radio');

var setColor = (color) => {
  document.body.style.backgroundColor = color;
};

storage.get('color', function (resp) {
  var color = resp.color;
  var option;
  if (color) {
    option = document.querySelector(`.js-radio.${color}`);
    setColor(color);
  } else {
    option = colorSelectors[0];
  }

  option.setAttribute('checked', 'checked');
});

colorSelectors.forEach(function (el) {
  el.addEventListener('click', function () {
    var value = this.value;
    storage.set({
      color: value
    }, function () {
      setColor(value);
    });
  });
});


//
// var optionsLink = document.querySelector('.js-options');
// optionsLink.addEventListener('click', function(e) {
//   e.preventDefault();
//   ext.tabs.create({'url': ext.extension.getURL('options.html')});
// })
