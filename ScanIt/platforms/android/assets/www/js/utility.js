var Utility = new function () {
    /*!
     @function	 dLog
     @abstract	 Shows a console logs depending on Constants.ENABLE_CONSOLE_LOGS
     @param msg	 Message to be displayed in the console log
     */
    this.dLog = function(msg) {
//        if(Constants.ENABLE_CONSOLE_LOGS){
            console.log('message is' + msg);
//        }		
    };
    
    /*!
     @function	isEmpty
     @abstract	Checks whether the string is empty or not
     @return     Returns true if the string is empty.
					Returns false if the string is not empty.
     */
    this.isEmpty = function(text) {
        return (text === null || text === '' || text === undefined);
    };
}