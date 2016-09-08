var Event = new function () {
    this.taskTitle= null;
    this.uniqueID = null;
    this.expiryDate =  null;
    this.resultText = null;
    
    this.fetchAddedItemFromDB = function () {
        Database.getTaskList(function(addedItems){
                             alert("in fetchAddedItemFromDB");

                             if ($.isEmptyObject(addedItems) != true) {
                             console.log("found sme data" + JSON.stringify(addedItems));
                             alert("found sme data" + JSON.stringify(addedItems));
                             var template = $('#savedItems').html();
                             alert('template is ' + template);
                             var html  = Mustache.to_html(template, JSON.stringify(addedItems));
                             } else {
                             alert("no data found");
                             }
                             
                             })
       // alert("***********");
    }
    
    $(document).on('tap','#addButton', function(){
                   Event.fetchAddedItemFromDB();
                   //    Database.openDatabase();
                   //               alert("i am clicked");
//                   $.mobile.changePage( "#detailsPage", { transition: "none"} );
//                   return false;
//                   });
//    $(document).on('tap','#backButton', function(){
//                   $.mobile.changePage( "#homePage", { transition: "none"} );
                   return false;
                   });
    
    $(document).on('tap', '#doneButton', function(){
                   this.taskTitle = $("#itemText").val();
                   
                   if (Utility.isEmpty(this.taskTitle)) {
                   alert(' Title field is mandatory !!!');
                   }else {
                   Database.addItem(Event.uniqueID, this.taskTitle, Event.expiryDate);
                   $.mobile.changePage( "#homePage", { transition: "none"} );
                   }
                   
                   return false;
                   });
    
    $(document).on('tap','#scanButton', function(){
                   cordova.plugins.barcodeScanner.scan(
                                                       function (result) {
                                                       //                                                   alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
                                                       Event.resultText =  result.text.split('@');
                                                       Event.uniqueID = Event.resultText[0] ; //product id is unique id for the product
                                                       
                                                       $("#expiryDate").text(Event.resultText [1]); //todo undo this
                                                       Event.expiryDate = Event.resultText [1];
                                                       //  Event.uniqueID = $.now(); //since date of  creation is the best uniue id TODO REMOVE THIS TO GET TIME NOW
                                                       $("#alarmFields").show();
                                                       
                                                       console.log("We got a barcode\n" +
                                                                   "Result: " + result.text + "\n" +
                                                                   "Format: " + result.format + "\n" +
                                                                   "Cancelled: " + result.cancelled);
                                                       },
                                                       function (error) {
                                                       alert("Scanning failed, please scan again: " + error);
                                                       },
                                                       {
                                                       "preferFrontCamera" : false, // iOS and Android
                                                       "showFlipCameraButton" : false, // iOS and Android
                                                       "prompt" : "Place a barcode inside the scan area", // supported on Android only
                                                       // "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                                                       "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                                                       }
                                                       );
                   return false;
                   });
    
    $(document).on('change','#toggleSwitch', function(e){
                   //alert($("#toggleSwitch").val());
                   var switchValue = $("#toggleSwitch").val();
                   if (switchValue == "on") {
                   // $("#dateInput").show();
                   // alert ('am on');
                   } else {
                   //  $("#dateInput").hide();
                   //   alert ('am off');
                   }
                   });
    
    function schedule(id, title, message, schedule_time)
    {
        cordova.plugins.notification.local.schedule({
                                                    id: id,
                                                    title: title,
                                                    message: message,
                                                    at: schedule_time
                                                    });
        //    var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
        //    cordova.plugins.notification.local.schedule({
        //                                                id: id,
        //                                                title: title,
        //                                                message: message,
        //                                                firstAt: schedule_time,
        //                                                every: 2,
        //                                                sound: sound,
        //                                                icon: "http://domain.com/icon.png"
        //                                                });
        
        alert('added local notification');
        var array = [id, title, message, schedule_time];
        var info = JSON.parse(localStorage.getItem("rp_data"));
        info.data[info.data.length] = array;
        console.log('rp_data'  + JSON.stringify(info));
        localStorage.setItem("rp_data", JSON.stringify(info));
        
        //   alert("Reminder added successfully");
    }
    
    $(document).on('change', '#date', function(event){
                   event.stopPropagation();
                   
                   var schedule_time = new Date((this.value).replace(/-/g, "/")).getTime();
                   //   alert("schedule_time" + schedule_time);
                   schedule_time = new Date(schedule_time);
                   //  alert("new schedule_time" + schedule_time);
                   
                   console.log(' schedule_time is ' + schedule_time);
                   var title = "Scan me reminder";
                   var message = $('#itemText').val();
                   
                   // alert('date value is' + dateValue);
                   cordova.plugins.notification.local.hasPermission(function(granted){
                                                                    if(granted == true)
                                                                    {
                                                                    schedule(Event.uniqueID, title, message, schedule_time);
                                                                    }
                                                                    else
                                                                    {
                                                                    cordova.plugins.notification.local.registerPermission(function(granted) {
                                                                                                                          if(granted == true)
                                                                                                                          {
                                                                                                                          schedule(Event.uniqueID, title, message, schedule_time);
                                                                                                                          }
                                                                                                                          else
                                                                                                                          {
                                                                                                                          navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                                                                                                                          }
                                                                                                                          });
                                                                    }
                                                                    });
                   });
};
