const sign = require('jwt-encode');
const secret = 'supersecretkey';
const data = {
  sub: '1234567890',
  name: 'Viveiros, L',
  iat: 1516239022,
  role:'USER',
  username:'lviveiros'
};
const jwt = sign(data, secret);
console.log(jwt);