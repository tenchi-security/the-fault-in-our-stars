export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'admin/dashboard/createAdminUser/',
        cors: true,
        authorizer: 'auth',
      }
    }
  ]
}