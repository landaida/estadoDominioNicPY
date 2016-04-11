"use strict";

var page = require('webpage').create();

//para finger que es un movil
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
page.settings.javascriptEnabled = true;

//set browser en ingles
page.customHeaders = {
  "Accept-Language": "en-US"
};

// page.onUrlChanged = function(targetUrl) {
//   console.log('New URL: ' + targetUrl);
// };
page.onLoadFinished = function(status) {
  // console.log('Load Finished: ' + status);
};
// console.log('Load Started');
page.onLoadStarted = function() {
  // console.log('onLoadStarted');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
  // console.log('Trying to navigate to: ' + url);
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};



page.open('http://www.nic.py/consulta-datos.php', function(status) {
  if (status === "success") {
    console.log("Exito al abrir pagina.");
  }
});

var isSecondPage = false,
actualIndex = 0;
var listOfPages = ['datapar', 'pygranos', 'agritrade', 'agrolink', 'landaida', 'pampa'];
page.onLoadFinished = function(status) {
    //console.log('insideFinis', actualIndex < listOfPages.length, !isSecondPage, listOfPages[actualIndex]);
    if(actualIndex < listOfPages.length){
      if(!isSecondPage){
        // console.log('beforeSetPageName');
        isSecondPage = page.evaluate(function() {
          // console.log('insideSetPageName');
          var pageNameToSearch = arguments[0];
          console.log('Dominio: ', pageNameToSearch);
          try {
            $('.input-xlarge').val(pageNameToSearch);
            $('[name="btn_modificar"]').click();
            return true;
          } catch (e) {
            console.log('Error', e.message);
          }
        }, listOfPages[actualIndex]);
      }else {
        if (phantom.injectJs('util.js')) {
          // console.log('beforeGetResponse');
          page.evaluate(function() {
            // console.log('insideGetResponse');
            var waitFor = arguments[0],
            isSecondPage = arguments[1],
            actualIndex = arguments[2];

            (function search(){
              waitFor(function(){
                var buscando = $('.table-hover');
                // console.log('wait');
                return buscando.length > 0;
              },
              function(){
                console.log($('#mostrar_datos > h4:contains("Estado")').text());
                window.callPhantom({
                  goBack: true
                });
              })
            })()

          }, waitFor, isSecondPage, actualIndex);
        }else {
          console.log('error to load util.js');
        }
      }
    }else{
      phantom.exit();
    }
};


page.onConsoleMessage = function(msg) {
  console.log(msg);
}


page.onCallback = function(data) {
  if (data && data.render) {
    page.render(data.title + '.png');
  }
  if (data && data.exit) {
    console.log('Estado: no encontrado');
    //phantom.exit();
    page.goBack();
    isSecondPage = false;
    actualIndex += 1;
  }
  if (data && data.goBack) {
    page.goBack();
    isSecondPage = false;
    actualIndex += 1;
  }
};
