export default {
  meEndpoint: '/user/single-record',
  loginEndpoint: '/user/login',
  storageTokenKeyName: 'accessToken',
  storageDataKeyName: 'userData',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
