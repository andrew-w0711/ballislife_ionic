// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bil_app', [
  'ionic',
  'bil_app.directives',
  'bil_app.controllers',
  'bil_app.views',
  'bil_app.services',
  'bil_app.config',
  'bil_app.factories',
  'bil_app.filters',
  'ngMap',
  'angularMoment',
  'underscore',
  'ngCordova',
  'youtube-embed'
])

.run(function($ionicPlatform, AuthService, $rootScope, $state, PushNotificationsService) {

  $ionicPlatform.on("deviceready", function(){

    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        //update user avatar and go on
        AuthService.updateUserAvatar();

        $state.go('app.home');
      }
      else
      {
        $state.go('walkthrough');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    function onLoad() {
        if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
            document.addEventListener('deviceready', initApp, false);
        } else {
            initApp();
        }
    }
	var admobid = {};
	if( /(android)/i.test(navigator.userAgent) ) {
		admobid = { // for Android
			banner: 'ca-app-pub-8513003844797890/6657832699',
			interstitial: 'ca-app-pub-8513003844797890/8134565897'
		};
	} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
		admobid = { // for iOS
			banner: 'ca-app-pub-8513003844797890/2506834690',
			interstitial: 'ca-app-pub-8513003844797890/9890500699'
		};
	} else {
		admobid = { // for Windows Phone
			banner: 'ca-app-pub-6869992474017983/8878394753',
			interstitial: 'ca-app-pub-6869992474017983/1355127956'
		};
	}

    function initApp() {
		if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
		initAd();
        // display the banner at startup
        createSelectedBanner();
    }
    function initAd(){
        var defaultOptions = {
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,		// valid when set position to 0 / POS_XY
            // y: integer,		// valid when set position to 0 / POS_XY
            isTesting: false, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        AdMob.setOptions( defaultOptions );
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function(data){
        	alert('error: ' + data.error +
        			', reason: ' + data.reason +
        			', adNetwork:' + data.adNetwork +
        			', adType:' + data.adType +
        			', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
        });
        document.addEventListener('onAdLoaded', function(data){});
        document.addEventListener('onAdPresent', function(data){});
        document.addEventListener('onAdLeaveApp', function(data){});
        document.addEventListener('onAdDismiss', function(data){});
    }

    if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );

    if(AdMob) AdMob.createBanner( {
      adId:admobid.banner,
      position:AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow:true} );



    PushNotificationsService.register();

  });

  $ionicPlatform.on("resume", function(){
    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === false)
      {
        $state.go('walkthrough');
      }else{
        //update user avatar and go on
        AuthService.updateUserAvatar();
      }
    });

    PushNotificationsService.register();
  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate)
    {
      AuthService.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
          event.preventDefault();
          $state.go('walkthrough');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
/*
  .state('walkthrough', {
    url: "/",
    templateUrl: "views/auth/walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
    }
  })

  .state('register', {
    url: "/register",
    templateUrl: "views/auth/register.html",
    controller: 'RegisterCtrl',
    data: {
      authenticate: false
    }
  })

  .state('login', {
    url: "/login",
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl',
    data: {
      authenticate: false
    }
  })
*/
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "views/app/home.html",
        controller: 'HomeCtrl'
      }
    }
  })


    .state('app.exclusive', {
      url: "/exclusive",
      views: {
        'menuContent': {
          templateUrl: "views/app/exclusive.html",
          controller: 'ExclusiveCtrl'
        }
      }
    })

    .state('app.hs', {
      url: "/hs",
      views: {
        'menuContent': {
          templateUrl: "views/app/hs.html",
          controller: 'HSCtrl'
        }
      }
    })

    .state('app.nba', {
      url: "/nba",
      views: {
        'menuContent': {
          templateUrl: "views/app/nba.html",
          controller: 'NBACtrl'
        }
      }
    })

    .state('app.college', {
      url: "/college",
      views: {
        'menuContent': {
          templateUrl: "views/app/college.html",
          controller: 'CollegeCtrl'
        }
      }
    })

    .state('app.videos', {
      url: "/videos",
      views: {
        'menuContent': {
          templateUrl: "views/app/videos.html",
          controller: 'VideosCtrl'
        }
      }
    })

    .state('app.lifestyle', {
      url: "/lifestyle",
      views: {
        'menuContent': {
          templateUrl: "views/app/lifestyle.html",
          controller: 'LifestyleCtrl'
        }
      }
    })

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.contact', {
    url: "/contact",
    views: {
      'menuContent': {
        templateUrl: "views/app/contact.html",
        controller: 'ContactCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.post', {
    url: "/post/:postId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/post.html",
        controller: 'PostCtrl'
      }
    },
    data: {
      authenticate: true
    },
    resolve: {
      post_data: function(PostService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
      		template: 'Loading post ...'
      	});

        var postId = $stateParams.postId;
        return PostService.getPost(postId);
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.category', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/category.html",
        controller: 'PostCategoryCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.page', {
    url: "/wordpress_page",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress-page.html",
        controller: 'PageCtrl'
      }
    },
    data: {
      authenticate: true
    },
    resolve: {
      page_data: function(PostService) {
        //You should replace this with your page slug
        var page_slug = 'wordpress-page';
        return PostService.getWordpressPage(page_slug);
      }
    }
  })

;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

;
