angular.module("app").
controller("socialNetworksController", ["$scope","$stateParams","settings","connectionService","Notification", function($scope, $stateParams, settings, connectionService, Notification) {
    if (!$stateParams.sn) {
        $scope.osp = {
            key: 'facebook',
            title: 'Facebook',
            settings: settings['facebook']
        }
    }
    else {
        $scope.osp = {
            key: $stateParams.sn,
            title: capitalizeFirstLetter($stateParams.sn),
            settings: settings[$stateParams.sn]
        };

        $scope.$watch("osp", function(newValue, oldValue){
            $scope.actualJson = JSON.stringify(newValue);
        }, true);
        $scope.jsonObject = JSON.stringify($scope.osp);

        $scope.$on("deleteSNSetting", function(event,id){
            var settings = $scope.osp.settings;
            for(var p in settings){
                if(settings[p].id === id){
                    delete $scope.osp.settings[p];
                    break;
                }
            }
        });
    }


    $scope.savePrivacySettings = function(){
        connectionService.savePrivacySettings($scope.osp,function(){
            Notification.success({
                message: 'Settings updated',
                positionY: 'bottom',
                positionX: 'center',
                delay: 2000
            });
        },function(error){
            Notification.error({
                message: error,
                positionY: 'bottom',
                positionX: 'center',
                delay: 2000
            });
        })
    };
    $scope.sn = $stateParams.sn;
}]);
