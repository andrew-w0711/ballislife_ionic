var app = angular.module( 'bil_app.config', [] )
	.constant('WORDPRESS_API_URL', 'http://ballislife.com/api/')
	.constant('WORDPRESS_PUSH_URL', 'http://wordpress.startapplabs.com/blog/push/')
	.constant('GCM_SENDER_ID', 'api-project-845637736371')
	.config( ['$compileProvider',function( $compileProvider ){
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	}
]);
