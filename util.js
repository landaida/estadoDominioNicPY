waitFor = function(testFx, onReady, timeOutMillis, showConsole) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      try {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
          // If not time-out yet and condition not yet fulfilled
          condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
          if(showConsole){
            var d = new Date()
            ,title = 'insideWaitFor' + d.toLocaleTimeString().split(' ')[0].replace(/\:/g, ' ');
            console.log('insideWaitFor', condition, timeOutMillis);
            // window.callPhantom({
            //   render: true,
            //   title: title
            // });
          }
        } else {
          if (!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            // console.log("'waitFor()' timeout");
            // if(phantom){
            //   console.log('exit phantom');
            //   phantom.exit();
            // }else{
              // console.log('exit callPhantom');
              window.callPhantom({
                exit: true
              });
            // }
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
            clearInterval(interval); //< Stop this interval
            typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
          }
        }
      } catch (e) {
        console.log('Error', e.message);
      }
    }, 250); //< repeat check every 250ms
};
