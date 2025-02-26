angular.module('app').service("swarmService", function () {
    var SwarmService = (function () {

        function SwarmService() {}

        var swarmConnection = null;
        var connectCallbacks = [];
        var reconnectCallbacks = [];
        var connectionErrorCallback = [];

        function runConnectCallbacks() {
            connectCallbacks.forEach(function (callback) {
                callback();
            });
        }

        function runReconnectCallbacks() {
            reconnectCallbacks.forEach(function (callback) {
                callback();
            });
        }

        function runConnectionErrorCallback() {
            connectionErrorCallback.forEach(function (callback) {
                callback();
            });
        }

        initConnection = function (host, port, email, password, tenant, ctor, securityErrorFunction, errorFunction, reconnectCbk, connectCbk) {
            if (errorFunction) {
                onConnectionError(errorFunction);
            }

            if (reconnectCbk) {
                onReconnect(reconnectCbk);
            }

            if (connectCbk) {
                onConnect(connectCbk);
            }

            if (!swarmConnection) {
                swarmConnection = new SwarmClient(host, port, email, password, tenant, ctor, securityErrorFunction, runConnectionErrorCallback, runReconnectCallbacks, runConnectCallbacks);
                swarmHub.resetConnection(swarmConnection);
            }
            else {
                swarmConnection.tryLogin(email, password, tenant, ctor, false, securityErrorFunction, runConnectionErrorCallback, runReconnectCallbacks, runConnectCallbacks);
            }
        };
        restoreConnection = function (host, port, email, sessionId, securityErrorFunction, errorFunction, reconnectCbk, connectCbk) {

            if (errorFunction) {
                onConnectionError(errorFunction)
            }

            if (reconnectCbk) {
                onReconnect(reconnectCbk);
            }

            if (connectCbk) {
                onConnect(connectCbk);
            }

            var username = Cookies.get("userId");
            var sessionId = Cookies.get("sessionId");

            swarmConnection = new SwarmClient(host, port, username, sessionId, "PlusPrivacyWebsite", "restoreSession", securityErrorFunction, runConnectionErrorCallback, runReconnectCallbacks, runConnectCallbacks);
            swarmHub.resetConnection(swarmConnection);
        };
        removeConnection = function () {
            swarmConnection.logout();
            swarmConnection = null;
            connectCallbacks = [];
            reconnectCallbacks = [];
            connectionErrorCallback = [];
        };
        onReconnect = function (callback) {
            reconnectCallbacks.push(callback);
        };
        onConnect = function (callback) {
            connectCallbacks.push(callback);
        };
        onConnectionError = function (callback) {
            connectionErrorCallback.push(callback);
        };

        SwarmService.prototype.initConnection = initConnection;
        SwarmService.prototype.removeConnection = removeConnection;
        SwarmService.prototype.restoreConnection = restoreConnection;

        return SwarmService;

    })();

    if (typeof(window.SwarmService) === 'undefined' || window.SwarmService === null) {
        window.SwarmService = new SwarmService();
    }
    return window.SwarmService;
});
