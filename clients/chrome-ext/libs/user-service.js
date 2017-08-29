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


var bus = require("bus-service").bus;

var userUpdatedObservable = swarmHub.createObservable();
var authenticationService = require("authentication-service").authenticationService;

var userService = exports.userService = {
    updateUserInfo: function (user_details, success_callback, error_callback) {
        var updateUserInfoHandler = swarmHub.startSwarm('UserInfo.js', 'updateUserInfo', user_details);
        updateUserInfoHandler.onResponse("updatedUserInfo", function(){
            success_callback();
            authenticationService.setUser(function(){
                userUpdatedObservable.notify();
            });
        });
        updateUserInfoHandler.onResponse("userUpdateFailed", function(response){
            error_callback(response.error);
        })
    },

    changePassword:function(changePasswordData, success_callback, error_callback){
        var changePasswordHandler = swarmHub.startSwarm('UserInfo.js', 'changePassword', changePasswordData.currentPassword, changePasswordData.newPassword);
        changePasswordHandler.onResponse("passwordSuccessfullyChanged", function(response){
            success_callback();
        });

        changePasswordHandler.onResponse("passwordChangeFailure", function(response){
            error_callback(response.error);
        });
    },

    userUpdated : function(callback){
        userUpdatedObservable.observe(function(){
            callback();
        }, true);
    },
    getUserPreferences:function(preference_key,success_callback, error_callback){
        var getUserPreferencesHandler =  swarmHub.startSwarm("UserPreferences.js","getPreferences",preference_key);
        getUserPreferencesHandler.onResponse("success", function(response){
            success_callback(response.preferences);
        });

        getUserPreferencesHandler.onResponse("failed", function(response){
            error_callback(response.error);
        })
    },

    saveUserPreferences:function(data, success_callback, error_callback){
        var saveUserPreferencesHandler =  swarmHub.startSwarm("UserPreferences.js","saveOrUpdatePreferences",data.preferenceKey, data.preferences);
        saveUserPreferencesHandler.onResponse("success", function(response){
            if(success_callback){
                success_callback(response.preferences);
            }
        });

        saveUserPreferencesHandler.onResponse("failed", function(response){
            if(error_callback){
                error_callback(response.error);
            }
        })
    },
    removePreferences:function(preferenceKey, success_callback, error_callback){
        var removePreferencesHandler = swarmHub.startSwarm("UserPreferences.js","removePreferences",preferenceKey);
        removePreferencesHandler.onResponse("success", function(response){
            success_callback(response);
        });
        removePreferencesHandler.onResponse("failed", function(response){
            error_callback(response.error);
        })
    },

    removeAccount:function(success_callback, error_callback){
        var removeAccountHandler = swarmHub.startSwarm("UserInfo.js", "deleteAccount");

        removeAccountHandler.onResponse("success", function(response){
            success_callback(response);
        });

        removeAccountHandler.onResponse("failed", function(response){
            error_callback(response.error);
        })
    },

    contactMessage:function(data,success_callback, error_callback){
        var contactMessageHandler = swarmHub.startSwarm("contact.js", "sendMessage",data);
        contactMessageHandler.onResponse("success", function(response){
            success_callback();
        });
        contactMessageHandler.onResponse("error", function(response){
            error_callback();
        });

    },

    resetExtension:function(){
            chrome.storage.sync.clear(function(){
                chrome.storage.local.clear(function(){
                    chrome.runtime.reload();
                });
            });
    },

    sendAnalytics:function(analyticsLabel){
       swarmHub.startSwarm("analytics.js","actionPerformed",analyticsLabel);
    },

    provideFeedbackUrl:function(callback){
        callback(CONSTANTS.FEEDBACK_FORM_URL);
    }

};

bus.registerService(userService);
