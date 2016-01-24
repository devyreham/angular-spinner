/**
 * Created by yreham.com on 3/6/15.
 * replace previous progress.js
 * Remove unused code
 */

angular.module('MainApp', ['ngRoute','modProgress']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
    //$locationProvider.hashPrefix('!');
}]);

var mprogress = angular.module('modProgress');

mprogress.factory('progressService', ['$interval', function ($interval) {
    "use strict";

    var newProgressService;

    newProgressService =  {
        promise: {},
        start: function (scope, delay, maxcount, increment, altmessage) {

            scope.pvalue = 0;
            this.promise = $interval(function () {

                if (scope.pvalue  + increment > 100) {
                    scope.pvalue  = 0;
                    scope.firstMessage = altmessage;
                } else {
                    scope.pvalue = scope.pvalue + increment;
                }
            }, delay, maxcount);
        },
        stop: function (scope) {
            $interval.cancel(this.promise);
            scope.pvalue = 100;
        }
    };

    return newProgressService;
}]);

mprogress.controller('CoProgressController', ['$scope', 'progressService', function ($scope, progressService) {
    "use strict";

    var initFunction;

    initFunction = function (scope, initalvalue, delay, maxnbloop, increment) {
        scope.pvalue = initalvalue;

        scope.$on(scope.startEvent, function (event, data) {
            progressService.start(scope, delay, maxnbloop, increment, scope.secondMessage);
        });
        scope.$on(scope.endEvent, function (event, data) {
            progressService.stop(scope);
        });
    };

    initFunction($scope,5, 100, 50, 5);
}]);

mprogress.directive('coProgress', [function () {
    "use strict";
    return {
        priority: 0,
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div ui-toggle="isSaving"><div class="progresslayer"></div><div class="barlayer">'+
        '<span>{{firstMessage}} {{pvalue}}%</span><div><div progressbar value="pvalue" type="type">'+
        '<span class="meter">{{pvalue}}%</span></div></div></div></div>',
        controller: 'CoProgressController',
        scope: {
            pvalue: "@pvalue",
            type: "@type",
            firstMessage: "@",
            secondMessage: "@",
            startEvent: "@startEvent",
            endEvent: "@endEvent",
            isSaving: "="
        }
    };
}]);


mprogress.controller('MainController', ['$scope',
    function ($scope) {
        $scope.isLoading = true;
        var init;

        init = function(){
            $scope.isLoading = false;
        };

        init();
    }]);