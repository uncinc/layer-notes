'use-strict';

// import generalConfig from '../config/general.js';

const validate = (() => {
  const email = (emailAdress) => {
    // validate string for a email
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailAdress);
  };

  const color = (colorString) => {
    // validate string for a color
    const re = /^#[0-9a-f]{3}([0-9a-f]{3})?$/;
    return re.test(colorString);
  };

  const text = () => {
    // validate string for a text
    return true;
  };

  const password = (passwordString) => {
    // validate string for a password
    return passwordString.length > 2;
  };

  const number = (number) => {
    // validate a number
    return isNaN(number);
  };

  // validate string for a date
  const date = (date) => {
    const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return re.test(date);
  };

  const url = (url) => {
    const re = new RegExp(
      '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})'
    ); // fragment locator
    return re.test(url);
  };

  return {
    email,
    color,
    text,
    password,
    number,
    date,
    url,
  };
})();

/* Export ==================================================================== */
module.exports = validate;
module.exports.details = {
  title: 'validate',
};