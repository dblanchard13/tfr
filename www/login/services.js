angular.module('login.services', [])

.factory('LoginFact', function($resource, $http){

  var UserProfile = $resource('https://graph.facebook.com/me')
  var fbToken = window.sessionStorage['fbtoken'];

  var getFbInfo = function(){
    // Returns a promise with the logged in user's basic FB info, this is resolved in the app.js stateprovider
    return UserProfile.get({access_token: fbToken}).$promise
  }
  
  var saveUser = function(user) {
    // console.log("in save user")
    var baseUrl = 'http://localhost:8888'
    return $http({
      method: 'POST',
      url: baseUrl + '/user/' + user.id,
      data: {
        name: user.name
      }
    })
    .then(function(data) {
      return data;
    })
  }


  return {
    saveUser: saveUser,
    getFbInfo: getFbInfo
  }
})

.value('FIREBASE_REF','https://tinderforroomies.firebaseio.com')
.value('userSession',{});
