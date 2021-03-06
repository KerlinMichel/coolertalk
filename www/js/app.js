// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').previousTitleText(false);
  $stateProvider
  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/home.html',
    controller: 'AppCtrl'
  })
  .state('app.front', {
    url: '/',
    views: {
      'menuContent' : {
        templateUrl : 'templates/frontpage.html',
        controller: 'front'
      }
    }
  })
  .state('app.comments', {
    url: '/comments/:postId',
    views: {
      'menuContent' : {
        templateUrl : 'templates/comments.html',
        controller: 'comments'
      }
    },
  })
  .state('app.account', {
    url: '/account',
    views: {
      'menuContent' : {
        templateUrl : "templates/account.html",
        controller : "account"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
