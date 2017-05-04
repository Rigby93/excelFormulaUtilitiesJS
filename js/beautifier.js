//Beautifier.js
//
//Copywrite 2011 Josh Benentt
//License - https://raw.github.com/joshatjben/excelFormulaUtilitiesJS/master/LICENSE.txt
//[on github](https://github.com/joshatjben/excelFormulaUtilitiesJS/tree/master/examples/basic_example1 "github")
//
(function(window, undefiend) {
  "use strict";
  //Check and setup name spaces.
  window.excelFormulaBeautifier = window.excelFormulaBeautifier || {};
  window.excelFormulaBeautifier.examples = window.excelFormulaBeautifier.examples || {};

  function htmlReplace(text){
    return text.replace(/</gi,"&lt;").replace(/>/gi,"&gt;")
  }

  //Configuration
  //-------------------------------
  var config = {
      //The ID for the formula Input input/textarea
      INPUT_ID: 'formula_input',
      //The ID for the formula title area. in this example it spits out the function call;
      FORMULA_TITLE_ID: 'fomatFormula_2',
      //THE ID for the area to contain the beautified excel formula.
      FORMULA_BODY_ID: 'fomatFormula_2_out',
      //Use this to set the inital textare/input text area.
      DEFAULT_FORMULA: ''
    },
    timer = null,
    lastMode = "beautify",
    //Beautifier Page functionality
    //-------------------------------
    beautifier = window.excelFormulaBeautifier.examples.beautifier =
    (function() {
      var oldFormula;
      return {
        formula: '=IF(SUM( IF(FOO = BAR, 10, 0), 10 ) = 20 , "FOO", "BAR")',
        input: null,
        formulaTitle: null,
        formulaBody: null,
        mode: "beautify",
        changeMode: function(mode) {
          lastMode = mode;
          window.excelFormulaBeautifier.examples.beautifier.mode = mode;
          window.excelFormulaBeautifier.examples.beautifier.update.call(window.excelFormulaBeautifier.examples.beautifier);
          if (typeof _gaq !== 'undefined' && _gaq !== null)
            _gaq.push(['_trackEvent', 'Change Mode', 'Select', mode]);
        },
        formulaAreaClicked: function() {
          if (typeof _gaq !== 'undefined' && _gaq !== null)
            _gaq.push(['_trackEvent', 'Formula Input', 'Clicked', lastMode]);
        },
        update: function() {

          this.formula = this.input.value;
          //Test to see if the formula has changed, if it hasn't don't do anything
          if (oldFormula === this.formula) {
            return;
          }
          var numberOfSpaces = document.getElementById("numberOfSpaces").value || 4;
          numberOfSpaces = Number.isNaN(Number.parseInt(numberOfSpaces)) ? 4 : Math.min(numberOfSpaces, 10)
          document.getElementById("numberOfSpaces").value = numberOfSpaces
          // Check to see which mode we're in, render appropriately
          try {
            switch (this.mode) {
              case "beautify":
                var spaces = "";
                for (var i = 0; i < numberOfSpaces; i += 1) {
                  spaces += "&nbsp;"
                }
                var options = {
                  tmplIndentTab: '<span class="tabbed">' + spaces + '</span>'
                }
                this.formulaBody.innerHTML = window.excelFormulaUtilities.formatFormulaHTML(this.formula, options);
                break;
              case "minify":
                this.formulaBody.innerHTML = htmlReplace(this.formula.replace(/\s+/gi, ' '));
                break;
              case "js":
                this.formulaBody.innerHTML = htmlReplace(window.excelFormulaUtilities.formula2JavaScript(this.formula));
                break;
              case "csharp":
                this.formulaBody.innerHTML = htmlReplace(window.excelFormulaUtilities.formula2CSharp(this.formula));
                break;
              case "python":
                this.formulaBody.innerHTML = htmlReplace(window.excelFormulaUtilities.formula2Python(this.formula));
                break;
            }
          } catch (exception) {
            //Do nothing, This should throw an error when the formula is improperly formed, which shouldn't blow things up.
          }
          clearTimeout(timer)
          timer = setTimeout(function() {
              if (typeof _gaq !== 'undefined' && _gaq !== null)
                _gaq.push(['_trackEvent', 'Formula Input', 'Updated', lastMode]);
            },
            1000);
        }
      };
    }());
  //On Page Load
  //-------------------
  window.onload = function() {
    beautifier.input = document.getElementById(config.INPUT_ID);
    //beautifier.formulaTitle = document.getElementById(config.FORMULA_TITLE_ID);
    beautifier.formulaBody = document.getElementById(config.FORMULA_BODY_ID);
    beautifier.input.value = beautifier.formula;
    beautifier.update();
    //add beautifier.update(); here if if you have set an inital DEFAULT_FORMULA and would like it to render on page load.
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var versionText = document.getElementById("version");
        versionText.innerHTML = JSON.parse(xhttp.responseText).version
      }
    };
    xhttp.open("GET", "package.json", true);
    xhttp.send();
  };
}(window));
