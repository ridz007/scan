$(document).on('tap','#addButton', function(){
               
               //               alert("i am clicked");
               $.mobile.changePage( "#detailsPage", { transition: "none"} );
               return false;
               });
$(document).on('tap','#backButton', function(){
               $.mobile.changePage( "#homePage", { transition: "none"} );
               
               return false;
               });

$(document).on('tap','#scanButton', function(){
               cordova.plugins.barcodeScanner.scan(
                                                   function (result) {
                                                   alert("We got a barcode\n" +
                                                         "Result: " + result.text + "\n" +
                                                         "Format: " + result.format + "\n" +
                                                         "Cancelled: " + result.cancelled);
                                                   $("#expiryDate").text(result.text);
                                                   $("#alarmFields").show();
                                                   
                                                   console.log("We got a barcode\n" +
                                                               "Result: " + result.text + "\n" +
                                                               "Format: " + result.format + "\n" +
                                                               "Cancelled: " + result.cancelled);
                                                   },
                                                   function (error) {
                                                   alert("Scanning failed: " + error);
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
    
    var array = [id, title, message, schedule_time];
    var info = JSON.parse(localStorage.getItem("rp_data"));
    info.data[info.data.length] = array;
    console.log('rp_data'  + JSON.stringify(info));
    localStorage.setItem("rp_data", JSON.stringify(info));
    
    alert("Reminder added successfully");
}

$(document).on('change', '#date', function(event){
               event.stopPropagation();
               var id = 1;
               var schedule_time = new Date((this.value).replace(/-/g, "/")).getTime();
               schedule_time = new Date(schedule_time);
               console.log(' schedule_time is' + schedule_time);
               var title = "Scan me reminder";
               var message = $('#itemText').val();
               
               // alert('date value is' + dateValue);
               cordova.plugins.notification.local.hasPermission(function(granted){
                                                                if(granted == true)
                                                                {
                                                                schedule(id, title, message, schedule_time);
                                                                }
                                                                else
                                                                {
                                                                cordova.plugins.notification.local.registerPermission(function(granted) {
                                                                                                                      if(granted == true)
                                                                                                                      {
                                                                                                                      schedule(id, title, message, schedule_time);
                                                                                                                      }
                                                                                                                      else
                                                                                                                      {
                                                                                                                      navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                                                                                                                      }
                                                                                                                      });
                                                                }
                                                                });
               });