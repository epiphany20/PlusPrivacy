angular.module('socialApps',['cfp.loadingBar'])
    .directive("socialApps", function (messengerService, ModalService, Notification,$rootScope) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                sn: "="
            },
            controller: function ($scope) {
                $scope.requestIsMade = false;
                $scope.apps = [];


                var readCookieConf = {
                    facebook:{
                        url:"https://facebook.com",
                        cookie_name:"c_user"
                    },
                    linkedin:{
                        url:"https://www.linkedin.com",
                        cookie_name:"li_at"
                    },
                    twitter:{
                        url:"https://www.twitter.com",
                        cookie_name:"auth_token"
                    },
                    google:{
                        url:"https://myaccount.google.com",
                        cookie_name:"OSID"
                    },
                    dropbox:{
                        url:"https://www.dropbox.com",
                        cookie_name:"bjar"
                    }
                };


                $scope.$on("appRemoved", function(event,appId){
                    $scope.apps = $scope.apps.filter(function(app){
                        return app.appId !== appId;
                    });
                    $scope.$apply();
                });

                $scope.$on("removingApp", function(event,appId){
                    var currentApp = $scope.apps.find(function(app){
                        return app.appId === appId;
                    });
                    currentApp["removing"] = true;
                });

                $scope.removeSocialApp = function(appId){

                    var app = $scope.apps.find(function(app){
                       return app.appId == appId;
                    });

                    app['socialNetwork'] = $scope.sn;

                    ModalService.showModal({
                        templateUrl: '/operando/tpl/modals/removeSocialApp.html',
                        controller:function($scope,$rootScope,cfpLoadingBar,close){
                            $scope.app = app;

                            $scope.removeApp = function(){
                                $rootScope.$broadcast("removingApp",$scope.app.appId);
                                cfpLoadingBar.start();
                                cfpLoadingBar.inc();
                                $scope.deleteInProgress = true;
                                messengerService.send("removeSocialApp",{sn:$scope.app.socialNetwork,appId: app.appId},function(response){
                                    $scope.deleteInProgress = false;
                                    close("app-deleted",500);
                                    messengerService.send("sendAnalytics","changedAppsOrExtensions");
                                    cfpLoadingBar.complete();
                                    if(response.status === "success"){
                                        Notification.success({message: "App removed from "+app['socialNetwork'], positionY: 'bottom', positionX: 'center', delay: 5000});
                                        $rootScope.$broadcast("appRemoved",$scope.app.appId);
                                    }
                                });
                            }
                        },
                        preClose : function(modal){
                            modal.element.modal('hide');
                        }

                    }).then(function (modal) {
                        modal.element.modal();
                    });

                };


                var conf = readCookieConf[$scope.sn];


                function checkIfLoggedIn() {

                    chrome.cookies.get({url: conf.url, name: conf.cookie_name}, function (cookie) {
                        if (cookie) {
                            $rootScope.$broadcast("socialNetworkReady",$scope.sn);
                            clearInterval(checkInterval);
                            $scope.isLoggedInSocialNetwork = true;
                            var action = null;
                            switch ($scope.sn) {
                                case "facebook":
                                    action = "getFacebookApps";
                                    break;
                                case "twitter":
                                    action = "getTwitterApps";
                                    break;
                                case "linkedin":
                                    action = "getLinkedInApps";
                                    break;
                                case "google":
                                    action = "getGoogleApps";
                                    break;
                                case "dropbox":
                                    action = "getDropBoxApps";
                                    break;

                            }

                            messengerService.send(action, function (response) {
                                if (response.status == "success") {
                                    $scope.apps = response.data;
                                    $scope.requestIsMade = true;
                                    $scope.$apply();
                                }
                            });

                        }
                        else {
                            $scope.isLoggedInSocialNetwork = false;
                            $scope.sn_url = conf.url;

                        }
                    });
                }


                var checkInterval = setInterval(checkIfLoggedIn, 3000);

                checkIfLoggedIn();

            },
            templateUrl:"/operando/tpl/apps/sn_apps.html"
        }
    });
