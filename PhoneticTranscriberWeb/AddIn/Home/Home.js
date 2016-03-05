/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
        });
    };

    angular.module('PhoneticTranscriber', [])
    .controller('PhoneticTranscriberController', function ($scope, $http) {
        var ptCont = this;
        $scope.theWord = "apple";
        $scope.ipaDiv = "default blank";
        $scope.phoDiv = "default even blankers";

        var dubLookyTable = {};
        dubLookyTable['i:'] = "eed";
        dubLookyTable['u:'] = "oo";
        dubLookyTable['Ɛ:'] = "ir";
        dubLookyTable['ɔ:'] = "oh";
        dubLookyTable['a:'] = "ar";
        dubLookyTable['Iə'] = "ere";
        dubLookyTable['eI'] = "ai";
        dubLookyTable['ʊə'] = "ou";
        dubLookyTable['ɔI'] = "oy";
        dubLookyTable['əʊ'] = "ow";
        dubLookyTable['eə'] = "air";
        dubLookyTable['aI'] = "y";
        dubLookyTable['aʊ'] = "ow";
        dubLookyTable['tʃ'] = "ch";
        dubLookyTable['dʒ'] = "j";

        var lookyTable = {};
        lookyTable['d'] = "d";
        lookyTable['ɛ'] = "e";
        lookyTable['I'] = "i";
        lookyTable['ʊ'] = "oo";
        lookyTable['e'] = "e";
        lookyTable['ə'] = "e";
        lookyTable['æ'] = "a";
        lookyTable['ʌ'] = "u";
        lookyTable['ɒ'] = "o";
        lookyTable['p'] = "p";
        lookyTable['b'] = "b";
        lookyTable['t'] = "t";
        lookyTable['d'] = "d";
        lookyTable['k'] = "c";
        lookyTable['g'] = "g";
        lookyTable['f'] = "f";
        lookyTable['v'] = "v";
        lookyTable['θ'] = "th";
        lookyTable['ð'] = "th";
        lookyTable['s'] = "s";
        lookyTable['z'] = "z";
        lookyTable['ʃ'] = "sh";
        lookyTable['ʒ'] = "s";
        lookyTable['m'] = "m";
        lookyTable['n'] = "n";
        lookyTable['ɳ'] = "ing";
        lookyTable['h'] = "h";
        lookyTable['l'] = "l";
        lookyTable['r'] = "r";
        lookyTable['w'] = "w";
        lookyTable['j'] = "y";

        ptCont.getIpa = function () {
            $scope.theWord = $scope.theWord.replace(/[?_@//]/g, '');
            if (/\s/g.test($scope.theWord)) { app.showNotification('One word at a time please!'); return; }
            //var theAdrs = "http://phonetic.azurewebsites.net/"+$scope.theWord+"?callback=JSON_CALLBACK";
            var theAdrs = "http://localhost:8080/" + $scope.theWord + "?callback=JSON_CALLBACK";
            $http.jsonp(theAdrs).success(function (response) {
                if (!response.entry_list.hasOwnProperty('entry')) { app.showNotification('Word not found, likely misspelled.'); return; }
                $scope.ipaDiv = response.entry_list.entry[0].pr[0];
                var phoBuilder = "";
                var temp = "";
                var lastWasDub = false;
                for (var i = 0; i < $scope.ipaDiv.length - 1; i++) {
                    lastWasDub = false;
                    if ((temp = dubLookyTable[$scope.ipaDiv.charAt(i) + $scope.ipaDiv.charAt(i + 1)]) !== undefined) { phoBuilder += temp; lastWasDub = true; }
                    else if ((temp = lookyTable[$scope.ipaDiv.charAt(i)]) !== undefined) { phoBuilder += temp; }
                    else { phoBuilder += ""; }
                }
                if (!lastWasDub) {
                    if ((temp = lookyTable[$scope.ipaDiv.charAt(i)]) !== undefined) { phoBuilder += temp; }
                    else { phoBuilder += ""; }
                }
                $scope.phoDiv = phoBuilder;
            }).error(function (data, status) {
                console.log("Http call throwing error status : " + status);
            });//.then(function completed(request) { return $scope.phoDiv; });
            //return true;
        };

        ptCont.insertPho = function () {
            Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    app.showNotification('The selected text is:', '"' + result.value + '"');
                    $scope.theWord = result.value;
                    ptCont.getIpa;
                //    if(ptCont.getIpa()) {
                    Office.context.document.setSelectedDataAsync(result.value + ' - < ' + $scope.phoDiv + ' >',
                        function (asyncResult) {
                            if (asyncResult.status == "failed") {
                                app.showNotification("Error: " + asyncResult.error.message);
                            } else {
                                app.showNotification("Phonetic transcription inserted!");
                            }
                        });
                 //   }   
                } else {
                    app.showNotification('Error:', result.error.message);
                }
            }
        )};

    });
})();
