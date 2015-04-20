angular.module('login.controllers', ['firebase', 'ui.router'])

.controller('LoginCtrl', function($scope, $state, $firebaseAuth, FIREBASE_REF, userSession){
  
  var ref = new Firebase(FIREBASE_REF);

  ref.onAuth(function(authData){
    if(authData){
      console.log('onAuth auth data',authData);
      userSession.user = authData.facebook;
      // $state.go('tab.account');
      $state.go('tab.matches');
    } else {
      $state.go('login');
    }
  });

  userSession.auth = $firebaseAuth(ref);

  $scope.login = function(provider){
    userSession.auth.$authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }
});
