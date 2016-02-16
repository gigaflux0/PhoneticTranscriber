/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            $('#get-data-from-selection').click(getDataFromSelection);
        });
    };

    // Reads data from current document selection and displays a notification
    function getDataFromSelection() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    app.showNotification('The selected text is:', '"' + result.value + '"');
                    getIpa(result.value);
                } else {
                    app.showNotification('Error:', result.error.message);
                }
            }
        );
    }

    //http://www.dictionaryapi.com/api/v1/references/learners/xml/apple?key=44baf800-b6a8-4b75-99d0-ba5bcde54313
    function getIpa(theWord) {
        //legacy line, my lega-sheeee!!
        //var theWord = document.getElementById('TehQuery').value;
        //alert("bleh");
        //var text = document.createTextNode('IPA translation: ' + theWord);
        //var ipaD = document.getElementById('ipaDiv');
        //ipaD.parentNode.insertBefore(text, ipaD.nextSibling);

        var theApi = "44baf800-b6a8-4b75-99d0-ba5bcde54313";
        var theAdrs = "http://www.dictionaryapi.com/api/v1/references/learners/xml/" + theWord + "?key=" + theApi;
        
        //comment out this block for testing purposes to prevent api calls
        /*
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType('text/xml');
        xmlhttp.open("GET", theAdrs, false);
        xmlhttp.send(null);
        var xmlDoc = xmlhttp.responseXML;
        var ipa = xmlDoc.getElementsByTagName("pr")[0].childNodes[0].nodeValue;
        */

        //use aepel for testing purposes to stop calling api's
        var text = document.createTextNode('IPA translation: ' + 'ˈæpəl');//('ˈæpəl');//(ipa);ipa for reals
        var ipaD = document.getElementById('ipaDiv');
        ipaD.parentNode.insertBefore(text, ipaD.nextSibling);

        //use aepel for testing purposes to stop calling api's
        var tempy = getPhonetic("ˈæpəl");//("ˈæpəl");//(ipa);

        var textTwo = document.createTextNode('Phonetic translation: ' + tempy);
        var phoD = document.getElementById('phoDiv');
        phoD.parentNode.insertBefore(textTwo, phoD.nextSibling);
        
        return;
    }

    function getPhonetic(ipaIn) {
        var temp = "";
        var lastSym = false;
        for (var i = 0; i < ipaIn.length - 1; i++) {
            if (dubLookyTable(ipaIn.charAt(i) + ipaIn.charAt(i + 1)) != "") {
                temp = temp.concat(dubLookyTable(ipaIn.charAt(i) + ipaIn.charAt(i + 1)));
                i++;
                lastSym = true;
            }
            else {
                temp = temp.concat(lookyTable(ipaIn.charAt(i)));
                lastSym = false;
            }
        }
        if (!lastSym) {
            temp = temp.concat(lookyTable(ipaIn.charAt(i)));
        }
        return temp;
    }

    function dubLookyTable(charIn) {
        var charOut;
        switch (charIn) {
            case "i:":
                charOut = "ee";
                break;
            case "u:":
                charOut = "oo";
                break;
                //the 3 should be backwards    
            case "Ɛ:":
                charOut = "ir";
                break;
            case "ɔ:":
                charOut = "oh";
                break;
            case "a:":
                charOut = "ar";
                break;
            case "Iə":
                charOut = "ere";
                break;
            case "eI":
                charOut = "ai";
                break;
            case "ʊə":
                charOut = "ou";
                break;
            case "ɔI":
                charOut = "oy";
                break;
            case "əʊ":
                charOut = "ow";
                break;
            case "eə":
                charOut = "air";
                break;
            case "aI":
                charOut = "y";
                break;
            case "aʊ":
                charOut = "ow";
                break;
            case "tʃ":
                charOut = "ch";
                break;
            case "dʒ":
                charOut = "j";
                break;
            default:
                charOut = "";
        }
        return charOut;
    }

    function lookyTable(charIn) {
        //alert(charIn);
        var charOut;
        switch (charIn) {
            //tweeking
            case "ɛ":
                charOut = "e";
                break;
                //end tweeking
            case "I":
                charOut = "i";
                break;
            case "ʊ":
                charOut = "oo";
                break;
            case "e":
                charOut = "e";
                break;
            case "ə":
                charOut = "e";//er
                break;
            case "æ":
                charOut = "a";
                break;
            case "ʌ":
                charOut = "u";
                break;
            case "ɒ":
                charOut = "o";
                break;
                //consonants    
            case "p":
                charOut = "p";
                break;
            case "b":
                charOut = "b";
                break;
            case "t":
                charOut = "t";
                break;
            case "d":
                charOut = "d";
                break;
            case "k":
                charOut = "c";
                break;
            case "g":
                charOut = "g";
                break;
            case "f":
                charOut = "f";
                break;
            case "v":
                charOut = "v";
                break;
            case "θ":
                charOut = "th";
                break;
            case "ð":
                charOut = "th";
                break;
            case "s":
                charOut = "s";
                break;
            case "z":
                charOut = "z";
                break;
            case "ʃ":
                charOut = "sh";
                break;
            case "ʒ":
                charOut = "s";
                break;
            case "m":
                charOut = "m";
                break;
            case "n":
                charOut = "n";
                break;
            case "ɳ":
                charOut = "ing";
                break;
            case "h":
                charOut = "h";
                break;
            case "l":
                charOut = "l";
                break;
            case "r":
                charOut = "r";
                break;
            case "w":
                charOut = "w";
                break;
            case "j":
                charOut = "y";
                break;
            default:
                charOut = "";
        }
        return charOut;
    }

})();