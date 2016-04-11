var app = angular.module('ChatTV', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'pages/home/home.html',
        controller  : 'mainController'
    })
});

