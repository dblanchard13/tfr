angular.module('data', [])

.factory('MatchesFactory', function($http, baseUrl){

  // var baseUrl = 'http://localhost:8888';
  var liked = [];
  var matches = [];
  
  return {
    initialize: function(req){
      console.log("MatchFactory: user obj sent to initialize ", req.matched)
      if(req.matched) {
        return $http({
          method: 'GET',
          url: baseUrl + '/user/' + req.fbid + '/matches'
        })
        .then(function(matchedUsers){
          console.log("MatchFactory: initialize: matches returned from db ", matchedUsers.data);
          matches = matchedUsers.data;
        })
      }
    },
    all: function() {
     return matches;
    },
    remove: function(match) {
      matches.splice(matches.indexOf(match), 1);
    },
    get: function(matchId) {
      console.log("matches in matchfact.get ", matches)
      console.log("matchId in matches fact ", matchId)
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].fbid === matchId) {
          console.log("matches[i] ", matches[i])
          return matches[i];
        }
      }
      return null;
    },
    updateChatURL: function(matchId,property,newValue, cb){
      console.log("in update: matchId, property, newValue ", matchId, property, newValue)
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].fbid === matchId) {
          matches[i].matched[property] = newValue;
          console.log("Match with new chat url: ", matches[i]);
          cb(matches[i]);
        }
      }
    },

    saveAllMatches: function(User) {
      console.log("saveAllMatches: User", User)
      return $http ({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/matches',
        data: {
          matchesIds: User.matched,
          likedIds: User.liked
        }
      })
      .then(function(res) {
        console.log("matches factory: response for saveAllMatches ", res)
        return res.data;
      })
    },

    updateMatchedUsers: function(newMatch) {
      var thisMatchedUser = matches[matches.length-1]
      console.log("update matched user: this matched user ", thisMatchedUser)
      return $http({
        method: 'Put',
        url: baseUrl + '/user/' + newMatch.fbid + '/matches',
        data: {
          matchesIds: newMatch.matched,
          likedIds: newMatch.liked
        }
      })
      .then(function(res) {
        console.log("match factory: updated matched users' profiles ", res)
        return res.data;
      })
    },


    add: function(match, User, cb){
      var length = match.liked.length;
      var count = 0;
      var userIdString = User._id;
      var matchIdString = match._id;
      var result = [];
      console.log("matchFact: add: stringed user id ", userIdString);
      console.log("matchFact: add: stringed match id ", matchIdString);
      console.log("match name ", match.name);
      console.log("match.liked ", match.liked);
      if (match.liked.indexOf(User._id) >= 0 ) {
        if (!match.matched) {
          match.matched = {};
        }
        if (!User.matched) {
          User.matched = {};
        }
        match.matched[userIdString] = false;
        match.liked.splice(match.liked.indexOf(User._id), 1);
        matches.push(match);
        User.matched[matchIdString] = false;
        count ++;
        result.push(User, match);
        console.log("matchFact: add: result ", result)
        cb(result);
      } 
      else {
        User.liked.push(match._id);
        result.push(User, match);
        return result;
      }
    }
  };

})

.factory('SkippedFactory', function(){

  var skipped = [];

  return {
    initialize: function(usersSkipped){
      skipped = usersSkipped;
    },
    all: function() {
      return skipped;
    },
    add: function(skip){
      skipped.push(skip);
    },
    getFirst: function() {
      return skipped[0];
    } 
  };

})

.factory('ProfileFactory', function($http, baseUrl){

  var profile = {
    gender: null,
    age: null,
    keywords: ['','','','','']
  };

  // var baseUrl = 'http://localhost:8888';

  return {
    initialize: function(usersProfile, User){
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/profile',
        data: {
          profile: usersProfile
        }
      })
      .then(function(res) {
        console.log('Profile Factory Data - ', res);
        profile = res.data.profile;
        return res.data.profile;
      })    
    },
    all: function() {
      return profile;
    },
    update: function(property,newValue) {
      profile[property] = newValue;
    },
    getProperty: function(property) {
      return profile[property];
    },
  };

})

.factory('PlaceFactory', function($http, baseUrl){
  
  var location = { 
    host: null,
    myPlace: {
      rent: null,
      zipCode: null,
      genders: null,
      openRooms: null,
      roomType: null,
      occupants: null,
      city: null,
      state: null,
      latitude: null,
      longitude: null
    },
    desiredPlace:{
      rent: null,
      zipCode: null,
      radius: null,
      roomType: null,
      latitude: null,
      longitude: null,
      city: null,
      state: null
    }
  };

  // var baseUrl = 'http://localhost:8888'

  return {
    initialize: function(userLocation, User){
      console.log('How the hell can this not get to the server - ', userLocation);
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/location',
        data: {
          location: userLocation
        }
      })
      .then(function(res){
        console.log("place factory res from db ", res)
        location = res.data.location;
        return res.data.location;
      })
    },
    all: function() {
      return location;
    },
    update: function(property,newValue) {
      location[property] = newValue;
    },
    getProperty: function(property) {
      return location[property];
    },
  };

})

.factory('RoommateFactory', function($http, baseUrl){

  // var baseUrl = 'http://localhost:8888'

  var roommatePreferences = {
    gender: null,
    ageMin: null,
    ageMax: null
  };

  return {
    initialize: function(preference, User){
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/roommatePreferences',
        data: {
          roommatePreferences: preference
        }
      })
      .then(function(res) {
        console.log('Roommate Factory Data - ', res);
        roommatePreferences = res.data.roommatePreferences;
        return res.data.roommatePreferences;
      })    
    },
    all: function() {
      return roommatePreferences;
    },
    update: function(property,newValue) {
      roommatePreferences[property] = newValue;
    },
    getProperty: function(property) {
      return roommatePreferences[property];
    },
  };

})


.factory('CandidatesFactory', function($http, $rootScope, baseUrl){

  // var baseUrl = 'http://localhost:8888'

  var candidates = [];
 
  return {
    initialize: function(req){
      if (!req.location) {
        console.log("not grabbing candidates yet! need to set search prefs")
      } 
      else if (req.location.host) {
        return $http({
          method: 'GET',
          url: baseUrl + '/user/' + req.fbid + '/' + req.location.myPlace.city
        })
        .then(function(res) {
          console.log("candidates that match location ", res)
          candidates = res.data;
        })
      } 
      else {
        var lat = req.location.desiredPlace.latitude;
        var longt = req.location.desiredPlace.longitude;
        var radi = req.location.desiredPlace.radius
        return $http({
          method: 'GET',
          url: baseUrl + '/user/' + req.fbid + 
              '/location?lat=' + lat + '&longt=' + longt + '&radi=' + radi
        })
        .then(function(res) {
          console.log("candidates that match location ", res.data)
          candidates = res.data;
        })
      }
    },

    all: function() {
      console.log("Candidates: getting all candidates")
      return candidates;
    },
    removeFirst: function() {
      candidates.splice(0, 1);
    },
    getFirst: function() {
      return candidates[0];
    },
    add: function(candidate){
      candidates.push(candidate);
    },
    mock: function(){
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + candidates[1].id,
        data: {
          candidate: candidates[1],
        }
      })
      .then(function(res){
        console.log("place factory res from db ", res)
        return res.data.location;
      })
    },
    candidates: candidates
  };
})
