angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicPopup, $firebaseArray, UserService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.close = function() {
    $scope.modal.hide();
  };
  //Login:
  $scope.loginData = {};

  var usersRef = new Firebase("https://coolertalk.firebaseio.com/Users/");

  $scope.showLogin = function() {
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    if(!$scope.loginData.username || !$scope.loginData.password) {
      $ionicPopup.alert({
        title: 'Username or password not entered',
        template: 'Please provide both username and password'
      });
      return;
    }
    usersRef.once('value', function(snapshot) {
      if(snapshot.hasChild($scope.loginData.username)) {
        if(snapshot.child($scope.loginData.username).val()['password'] === $scope.loginData.password) {
            UserService.setProfile($scope.loginData.username);
            $scope.loginData = {};
            $scope.modal.hide();
        } else {
          $ionicPopup.alert({
            title: 'Incorrect password',
            template: 'Make sure you typed the password correctly.'
          });
        }
      } else {
        $ionicPopup.alert({
          title: 'Account does not exist',
          template: 'Make sure you typed the right username. Or you can create an account with this username'
        });
      }
    });
  };

  $scope.signup = function() {
    if(!$scope.loginData.username || !$scope.loginData.password) {
      $ionicPopup.alert({
        title: 'Username or password not entered',
        template: 'Please provide both username and password'
      });
      return;
    };
    usersRef.once('value', function(snapshot) {
      if(snapshot.hasChild($scope.loginData.username)) {
        $ionicPopup.alert({
          title: $scope.loginData.username + ' is already taken',
          template: 'Please choose another username'
        });
      } else {
        usersRef.child($scope.loginData.username).set({password : $scope.loginData.password, createAt: new Date(),
        posts : "", comments : "", likedPosts: "", likedComments: "",
        icon: UserService.getIconsNames()[Math.floor(Math.random()*(UserService.getNumIcons()+1))]});
        $scope.doLogin();
        $scope.loginData = {};
        $scope.modal.hide();
      }
    });
  };

  //Compose:
  var postsRef = new Firebase("https://coolertalk.firebaseio.com/post/");

  $scope.showCompose = function() {
    $ionicModal.fromTemplateUrl('templates/compose.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  };

  $scope.submitPost = function(text) {
    if(!text) {
      $ionicPopup.alert({
        title: 'No text was entered',
        template: 'You need to enter text to submit a post'
      });
    }
    if(UserService.getIcon() !== undefined) {
      var createAt = Date.now();
      if(UserService.getProfile() !== undefined) {
        postsRef.child(createAt).set({text: text, points: 0,
        poster: UserService.getProfile().username, comments: ""});
        usersRef.child(UserService.getProfile().username + "/posts/" + createAt).set("");
      } else {
        postsRef.child(createAt).set({text: text, points: 0,
        icon: UserService.getIcon(), comments: ""});
      }
      $scope.close();
    } else {
      $ionicPopup.alert({
        title: 'You must choose a icon to post to Coolertalk',
        template: 'Choose a icon at the account tab or create a account'
      });
    }
  }

})
.controller('front', function($scope, $firebaseArray, $state, UserService, TopicGen) {
  $scope.todaysTopic = TopicGen.getTopic();
  var ref = new Firebase("https://coolertalk.firebaseio.com/post/");
  $scope.posts = $firebaseArray(ref);
  $scope.gotoPost = function(post) {
    $state.go('app.comments', {postId: post.$id});
  }
  $scope.like = function(post) {
    var likedRef = new Firebase("https://coolertalk.firebaseio.com/Users/" +
    UserService.getProfile().username + '/liked/');
    likedRef.once('value', function(snapshot) {
      if(!snapshot.hasChild(post.$id)) {
        new Firebase("https://coolertalk.firebaseio.com/post/" + post.$id + "/points").set(++post.points);
        likedRef.child(post.$id).set("");
      }
    })
  }
})
.controller('comments', function($scope, $stateParams, $firebaseArray, UserService, $ionicPopup) {
  var commentRef = new Firebase("https://coolertalk.firebaseio.com/post/" + $stateParams.postId + "/");

  commentRef.once('value', function(snapshot) {
    $scope.text = snapshot.val().text;
    if(snapshot.val().poster === undefined) {
    $scope.icon = snapshot.val().poster;
    } else {
    $scope.poster = snapshot.val().poster;
    }
  });

  commentRef.child('comments').once('value', function(snapshot){
    console.log(snapshot.val());
    $scope.comments = snapshot.val();
  });

  $scope.addComment = function(commentText) {
    if(!commentText) {
      $ionicPopup.alert({
        title: 'No text was entered',
        template: 'You need to enter text to submit a post'
      });
    }
    if(UserService.getIcon() !== undefined) {
      var createAt = Date.now();
      if(UserService.getProfile() !== undefined) {
        commentRef.child('comments/' + createAt).set({text: commentText, points: 0,
        poster: UserService.getProfile().username, comments: ""});
        new Firebase("https://coolertalk.firebaseio.com/Users/"+UserService.getProfile().username +
        "/comments/" + createAt).set($stateParams.postId);
    } else {
        commentRef.child('comments/' + createAt).set({text: commentText, points: 0,
        icon: UserService.getIcon(), comments: ""});
      }
    } else {
      $ionicPopup.alert({
        title: 'You must have an icon to post on Coolertalk',
        template: 'Go to the account tab to choose an icon or create an account'
      });
    }
  };
  if($scope.poster === undefined) {
    new Firebase("https://coolertalk.firebaseio.com/post/" + $stateParams.postId + "/icon").on('value', function(snapshot){
      $scope.posterIcon = snapshot.val();
    });
  } else {
    new Firebase("https://coolertalk.firebaseio.com/Users/" + $scope.poster + "/icon").on('value', function(snapshot){
      $scope.posterIcon = snapshot.val();
    });
  }

  $scope.getCommentIcon = function(comment) {
    if(comment.poster !== undefined) {
    var p = new Promise(function(res, rej){
      new Firebase("https://coolertalk.firebaseio.com/Users/" + comment.poster+ "/icon").once('value',
      function(snapshot) {
        res(snapshot.val());
        })
      }).then(function(val){comment.icon = val});
    }
  }
})
.controller('account', function($scope, $firebaseArray, UserService) {
  $scope.posts = [];
  $scope.comments= [];
  $scope.hasAcc = false;
  var postIds;
  var commentIds;

  if(UserService.getProfile() !== undefined) {
    $scope.hasAcc = true;
    new Firebase("https://coolertalk.firebaseio.com/Users/"+UserService.getProfile().username+
    "/posts/").once('value', function(snapshot) {
      var idx = 0;
      for(var key in snapshot.val()) {
        new Firebase("https://coolertalk.firebaseio.com/post/").child(key).once('value', function(snapshot){
          $scope.posts[idx++] = snapshot.val();
        });
      }
    });

    new Firebase("https://coolertalk.firebaseio.com/Users/"+UserService.getProfile().username+
    "/comments/").once('value', function(snapshot) {
      var idx = 0;
      for(var key in snapshot.val()) {
        new Firebase("https://coolertalk.firebaseio.com/post/"+snapshot.val()[key]+"/comments/" + key + "/").once('value', function(snapshot){
          $scope.comments[idx++] = snapshot.val();
        });
      }
    });
  }

  $scope.icons = UserService.getIconNames();

  $scope.setAccIcon = function(icon) {
    UserService.setIcon(icon);
  }

});
