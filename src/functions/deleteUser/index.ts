export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'dashboard/user/{username}',
        cors: true,
        authorizer: 'auth',
      }
    }
  ]
}