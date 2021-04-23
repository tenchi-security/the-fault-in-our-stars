const sign = require('jwt-encode');
const secret = 'secret';
const data = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022,
  role:'GUEST_USER',
  username:'Leonardo'
};
const jwt = sign(data, secret);
console.log(jwt);