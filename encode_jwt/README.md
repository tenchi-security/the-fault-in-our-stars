# JWT Composer - IAM Policy Injection

Simple JWT composer to easily create malicious tokens

## Getting Started

#### Install dependencies
```
npm i
```

#### Craft Token

Edit main.js to and under `username` add your malicious input
```
const data = {
     sub: '1234567890',
     name: 'John Doe',
     iat: 1516239022,
     role:'GUEST_USER',
     username:'", \"*'
};
```

#### Running

```
sls offline start
```

