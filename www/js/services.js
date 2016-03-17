angular.module('starter.controllers').factory('UserService', function(){
  var profile;
  var icons = ['ion-bookmark', 'ion-paper-airplane', 'ion-compass', 'ion-soup-can',
'ion-beer', 'ion-wineglass', 'ion-coffee', 'ion-icecream', 'ion-pizza', 'ion-mouse',
'ion-calculator', 'ion-eye', 'ion-easel', 'ion-paintbrush', 'ion-monitor', 'ion-laptop',
'ion-iphone', 'ion-bug', 'ion-mic-c', 'ion-bag', 'ion-bowtie', 'ion-tshirt', 'ion-trophy',
'ion-ribbon-b', 'ion-university', 'ion-magnet', 'ion-beaker', 'ion-erlenmeyer-flask',
'ion-earth', 'ion-planet', 'ion-lightbulb', 'ion-leaf', 'ion-waterdrop', 'ion-fireball',
'ion-bonfire', 'ion-umbrella', 'ion-nuclear', 'ion-model-s', 'ion-plane', 'ion-jet',
'ion-ios-paw'];

var userIcon;

  return {
    setProfile : function(username) {
      profile = {username : username};
    },
    getProfile : function() {
      return profile;
    },
    getIconNames: function() {
      return icons;
    },
    setIcon : function(icon) {
      userIcon = icon;
      if(profile !== undefined)
        new Firebase("https://coolertalk.firebaseio.com/Users/" + profile.username + "/icon").set(icon);
    },
    getIcon : function() {
      return userIcon;
    },
    getNumIcons : function() {
      return icons.length;
    }
  }
})
.factory('TopicGen', function() {
  return {
    getTopic : function() {
      var Httpreq = new XMLHttpRequest(); // a new request
      Httpreq.open("GET","http://api.nytimes.com/svc/mostpopular/v2/mostviewed/opinion/1.json?api-key=61da4c69044cdab731bc5bded8109314:19:74696756",false);
      Httpreq.send(null);
      console.log(JSON.parse(Httpreq.responseText));
      return JSON.parse(Httpreq.responseText).results[0];
    }
  }
})
