function SwarmHubClient(){}
(function(){
    var callBacks = {};
    var connection = CommunicationService.prototype.getHubConnection(window.parent);
    var filters = {};


    function dispatchingResponses(swarm){

        if(swarm.meta.requestId){
            var callback = filters[swarm.meta.currentPhase+swarm.meta.requestId];
            if(callback){
                callback(swarm);
            }
        }
    }

    function dispatchingCallback(swarm){

        var o = callBacks[swarm.meta.swarmingName];
        if(o){
            var myCall = o[swarm.meta.currentPhase];
            if(!myCall){
                cprint("Warning: Nobody listens for swarm " + swarm.meta.swarmingName + " and phase " + swarm.meta.currentPhase);
            } else {
                try{
                    if(myCall instanceof Array){
                        myCall.map(function(c){
                            c(swarm);
                        });
                    } else {
                        myCall(swarm);
                    }
                } catch(err){
                    cprint("Error in swarm callback " + err.stack, err);
                }

            }
        } else {
            cprint("Warning: Nobody listens for swarm " + swarm.meta.swarmingName + " and phase " + swarm.meta.currentPhase);
        }
    }


    SwarmHubClient.prototype.on = function(swarmName, phase, callBack){
        var swarmPlace = callBacks[swarmName];
        if(!swarmPlace){
            swarmPlace = {};
            callBacks[swarmName] = swarmPlace;
            if(connection){
                connection.subscribeToChannel(swarmName, dispatchingCallback);
            }
        }

        var phasePlace = swarmPlace[phase];
        if(!phasePlace){
            swarmPlace[phase] = callBack;
        }
        else{
            if(phasePlace instanceof Array){
                phasePlace.push(callBack);
            } else {
                swarmPlace[phase] = [phasePlace, callBack];
            }
        }
    }


    SwarmHubClient.prototype.off = function(swarm, phase, callBack){
        var c = callBacks[swarm][phase];
        if(c instanceof Array){
            var idx = c.indexOf(callBack)
            if(idx != -1){
                c.splice(idx, 1);
            }
        } else {
            delete callBacks[swarm][phase];
        }
    }

    SwarmHubClient.prototype.startSwarm = function(swarmName){
        //TODO: implement this!
        var args = [swarmName];
        for(var i = 1,len = arguments.length; i<len;i++){
            args.push(arguments[i]);
        }

        var newCmd = {
            meta: {
                swarmingName: arguments[0]
            }
        };

        if(connection){
            var requestId = connection.publishToChannel(swarmName, args);
            newCmd.onResponse = function (phaseName, callback) {
                filters[phaseName+requestId] = callback;
                if (connection) {
                    connection.subscribeToChannel(phaseName+requestId, dispatchingResponses);
                }
            };
        }

        return newCmd;

    }

    /*
     generic observer implementation for Java Script. Created especially for integration swarms with angular.js projects. Usually angular services should be observable by controllers
     */
    SwarmHubClient.prototype.createObservable = function(template){
        function Observer(){
            var observers = [];
            var notifiedAtLeastOnce = false;

            for(var v in template){
                this[v] = template[v];
            }

            this.observe = function(c, preventAtLeastOnce){
                observers.push(c);
                if(!preventAtLeastOnce && notifiedAtLeastOnce){
                    c();
                }
            }

            this.notify = function(){
                observers.forEach(function(c){
                    c();
                })
                notifiedAtLeastOnce = true;
            }
        }
        return new Observer(template);
    }
})();
