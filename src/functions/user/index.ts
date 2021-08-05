export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'dashboard/user',
        cors: true,
        authorizer: 'auth',
      }
    }
  ]
}