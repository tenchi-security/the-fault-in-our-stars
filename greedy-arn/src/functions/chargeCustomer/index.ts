export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'admin/store/order/creditcard/dashboard/',
        cors: true,
        authorizer: 'auth',
      }
    }
  ]
}