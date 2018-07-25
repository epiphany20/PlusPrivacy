/*
 * Copyright (c) 2016 ROMSOFT.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the The MIT License (MIT).
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *    RAFAEL MASTALERU (ROMSOFT)
 * Initially developed in the context of OPERANDO EU project www.operando.eu
 */


angular.module("op-popup").controller("loginCtrl", ['$scope', 'messengerService','i18nService', function($scope, messengerService, i18nService){

    var defaultUser = {remember_me:true};
    $scope.user = angular.copy(defaultUser);
    $scope.isAuthenticated = false;
    $scope.requestIsProcessed = false;
    $scope.networkError = false;
    $scope.connectedToNetwork = true;

    $scope.info = {
        message: "",
        status: ""
    };

    //show login form
    $scope.show_login = function () {
        $scope.loginAreaState = "login_form";
    };

    $scope.cancel = function () {
        $scope.loginAreaState = "loggedout";
    };

    clearInfoPanel = function(){
        setTimeout(function(){
            //reset to default
            //TODO this in UI
            //add fade effect
            $scope.info={
                status:"",

                message:""
            };
            delete $scope.requestStatus;
            $scope.$apply();
        },3000);
    }

    var securityErrorFunction = function (error) {

        $scope.info.message = i18nService._(error);

        if (error === "accountNotActivated") {
            $scope.info.message = i18nService._(error);
            $scope.showResendActivationCode = true;
        }

        $scope.info.status = "error";
        $scope.$apply();
    }

    var errorFunction = function () {
        $scope.networkError = true;
        $scope.info = {
            message:"Network connection unavailable!",
            status:"error"
        };

        if ($scope.loginAreaState !== "networkError") {
            $scope.lastAreaState = $scope.loginAreaState;
            $scope.loginAreaState = "networkError";
        }
        $scope.$apply();
    }

    successFunction = function () {
        messengerService.send("getCurrentUser", function(response){
            $scope.loginAreaState = "loggedin";
            $scope.user.email = response.data.email;
            $scope.isAuthenticated = true;
            $scope.$apply();
        });
    }

    reconnectFunction = function(){
        $scope.info.status = "success";
        $scope.info.message = 'Connected...';
        delete $scope.networkError;
        if($scope.lastAreaState){
            $scope.loginAreaState = $scope.lastAreaState;
        }
        $scope.$apply();
        clearInfoPanel();
    }

    $scope.resendActivationCode = function () {
        $scope.showResendActivationCode = false;
        $scope.requestIsProcessed = true;
        $scope.requestStatus = "pending";
        $scope.info.status = "success";
        $scope.info.message = 'Sending activation email...';

        messengerService.send("resendActivationCode", $scope.user.email, function (response) {

            $scope.requestIsProcessed = false;

            if(response.status === "success"){
                $scope.info.status = "success";
                $scope.info.message = 'Check your email!';
                $scope.requestStatus = "completed";
                $scope.$apply();
            }
            else {
                $scope.info.status = "error";
                $scope.info.message = response.message;
                $scope.requestStatus = "completed";
                $scope.$apply();
            }
        });
    }

    $scope.login = function () {
        $scope.requestIsProcessed = true;
        $scope.requestStatus = "pending";
        $scope.info.status = "success";
        $scope.info.message = 'Logging in...';
        messengerService.send("authenticateUser", {
                email: $scope.user.email,
                password: $scope.user.password,
                remember_me: $scope.user.remember_me
        }, function (response) {
            console.log(response);
            $scope.requestIsProcessed = false;
            if (response.status === "success") {
                messengerService.send("goToDashboard");
                window.close();
            }
            else{
                securityErrorFunction(response.error);
            }

        });
    }

    $scope.reset_password = function () {
        $scope.requestIsProcessed = true;
        $scope.requestStatus = "pending";
        $scope.info.status = "success";
        $scope.info.message = 'Resetting your password...';

        messengerService.send("resetPassword", $scope.user.email, function (data) {

            $scope.requestIsProcessed = false;
            if (data.status === "success") {
                $scope.info.status = "success";
                $scope.info.message = 'Check your email';
                $scope.requestStatus = "completed";
                $scope.show_login();
                $scope.$apply();
            }
            else {
                delete $scope.requestStatus;
                $scope.info.status = "error";
                $scope.info.message = "An error occurred. Try again later!";
                $scope.$apply();
            }
        });
    }

    $scope.show_forgot_password = function(){
        $scope.loginAreaState = "forgot_password";
    }

    $scope.show_register = function(){
        $scope.loginAreaState = "register_form";
        $scope.user = angular.copy(defaultUser);
    }

    $scope.showRegisterTooltip = function($event){
        $($event.target)
            .tooltipster({
                contentAsHTML: true,
                theme: ['tooltipster-plus-privacy'],
                content: "<div class='register_tooltip'><p>You need to be logged in only if you wish to use the email identity management feature. Otherwise you can still use all the other features of PlusPrivacy, anonymously.</p></div>",
                trigger: "custom",
                interactive: true,
                animationDuration: 200,
                zIndex: 2147483647
            })
            .tooltipster('open');
    };
    $scope.hideRegisterTooltip = function($event){
        $($event.target).tooltipster('close');
    }

    $scope.register = function(){

        $scope.info.status = "success";
        $scope.info.message = 'Processing...';
        $scope.requestStatus = "pending";

        $scope.requestIsProcessed = true;

        var successFunction = function(){
            $scope.loginAreaState = "login_form";
            $scope.info.status = "success";
            $scope.info.message = 'Check your email for activation!';
            $scope.requestStatus = "completed";
            $scope.$apply();
            clearInfoPanel();

        };

        var errorFunction = function(errorMessage){
            $scope.info.message = i18nService._(errorMessage);
            $scope.info.status = "error";
            $scope.$apply();
        };

        messengerService.send("registerUser",$scope.user, function(response){
            console.log(response);

            $scope.requestIsProcessed = false;
            if(response.status == "success"){
                successFunction();
            }
            else {
                errorFunction(response.error);
            }
        });
    };


    $scope.logout = function(){
        $scope.requestStatus = "pending";
        $scope.requestIsProcessed = true;
        messengerService.send("logoutCurrentUser",function(){
            $scope.requestIsProcessed = false;
            $scope.requestStatus = "completed";
            $scope.loginAreaState = "loggedout";
            $scope.isAuthenticated = false;
            $scope.user = angular.copy(defaultUser);
            $scope.$apply();
        });
    }

    messengerService.send("userIsAuthenticated", function(data){
        if(data.status === "success"){
            successFunction();
        }
        else if(data.error === "error"){
            messengerService.send("getPopupStateData", function(response){

                if(response.data.state && response.data.state !=="loggedin"){
                    $scope.loginAreaState = response.data.state;
                }
                else{
                    $scope.loginAreaState = "loggedout";
                }

                if(response.data.user){
                    $scope.user = response.data.user;
                }
                $scope.$apply();
            });
        }
        else if(status.error){
            errorFunction();
        }
        else if(status.reconnect){
            reconnectFunction();
        }
    });

    var updatePopupState = function (key) {
        var dataToSave = {};
        if (key === "user") {
            dataToSave["user"] = angular.copy($scope.user);
        }
        else {
            dataToSave["state"] = angular.copy($scope.loginAreaState);
        }

        messengerService.send("updatePopupStateData", dataToSave);
    };

    $scope.$watch('user', function (newValue, oldValue) {
        if(newValue !== oldValue){
            updatePopupState("user")
        }
    }, true);

    $scope.$watch('loginAreaState', function (value) {

        if(value !== "networkError"){
            updatePopupState("state");
        }
        if (value != "networkError" && $scope.info.status == "error") {
            $scope.info = {
                message: "",
                status: ""
            };
        }
    });


    //messengerService.on("onReconnect",reconnectFunction);
    messengerService.on("onConnectionError",errorFunction);
    messengerService.on("onConnect",reconnectFunction);

}]);
