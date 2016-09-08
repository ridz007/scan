/*!
	@author		164126
	@page		database.js
	@abstract	Contains database related functions
	@discussion This file contains all the functions which are required for DB operations
 */

var Database = new function(){
    this.db = null;
    this.uniqueID = null;
    this.taskTitle = null;
    this.expiryDate = null;
    this.taskListCallBack = null;
    this.taskListObjects = null;
    
    this.openDatabase = function(){
        this.db = window.sqlitePlugin.openDatabase({name: "DB", location: 'default'});
        //alert('database openDatabase');
        this.createTables();
    };
    
    this.createTables = function(){
        //alert('database created');
        this.db.transaction(this.creatItemTable, this.creatItemTableError, this.creatItemTableSuccess);
    };
    
    this.creatItemTable = function(tx) {
      //  alert(' creatItemTable called');

        tx.executeSql('CREATE TABLE IF NOT EXISTS TaskBank(Item_Id VARCHAR(45) PRIMARY KEY, Task_Name VARCHAR(100), Expiry_Date VARCHAR(45))');
    };
    this.creatItemTableError =  function(err) {
        console.log('creatItemTableError is' + err.message);
    };
    
    this.creatItemTableSuccess = function () {
        alert(' creatItemTableSuccess called');

        console.log('table created');
    };
    
    this.isProductPresent = function (tx) {
        tx.executeSql('SELECT * FROM TaskBank WHERE Item_Id ="'+ Database.uniqueID +'"' , [], Database.isProductPresentSucceess, Database.isProductPresentError);
    }
    
    this.isProductPresentSucceess = function (tx, results) {
        alert('isProductPresentSucceess results are ' + JSON.stringify(results));
        var res = results.rows.length;
        if (res == 0) {
           Database.db.transaction(Database.insertItem, Database.insertItemError, Database.insertItemSuccess);
        } else {
            alert("This product is already scanned !!!");
        }
    }
    
    this.isProductPresentError = function(err) {
        alert('err is' + err.message);
    }

    
    this.addItem = function(uniqueID, taskTitle, expiryDate) {
       // alert('expiryDate passed is' + expiryDate);
        Database.uniqueID = uniqueID;
        Database.taskTitle = taskTitle;
        Database.expiryDate = expiryDate;
        alert ('id is' + Database.uniqueID + ' task title'+ Database.taskTitle + ' expiry date '+ Database.expiryDate);
        this.db.transaction(Database.isProductPresent, Database.isProductPresentError);
      //this.db.transaction(Database.insertItem, Database.insertItemSuccess, Database.insertItemError);
    }
    
    this.insertItem = function(tx) {
        tx.executeSql('INSERT INTO TaskBank (Item_Id, Task_Name, Expiry_Date) VALUES (?,?,?)', [Database.uniqueID, Database.taskTitle, Database.expiryDate]);
    }
    
    this.insertItemSuccess = function () {
        this.db.transaction(Database.fetchAddedItems, Database.fetchAddedItemsError);
        alert('insertion done !!');
    }
    
    this.insertItemError = function (err) {
        alert('err.message !!' + err);
         Utility.log('insertItemError is' + err);
    }
    
    this.getTaskList = function(taskListCallBack) {
         alert('taskListCallBack !!' + taskListCallBack);
        Database.taskListObjects = [];
        Database.taskListCallBack = taskListCallBack;
        this.db.transaction(Database.fetchAddedItems, Database.fetchAddedItemsError);
        alert('going back');
    }
    
    this.fetchAddedItems = function(tx) {
        //  alert('in fetchAddedItems');
       // Utility.dLog('in fechedaddedietms');
        tx.executeSql('SELECT Item_Id, Task_Name, Expiry_Date FROM TaskBank' , [], Database.fetchAddedItemsSuccess, Database.fetchAddedItemsError);
    }
    
    this.fetchAddedItemsSuccess = function (tx, results) {
//        for (var i=0;i < results.rows.length; i++){
          // alert('fetchAddedItemsSuccess is' + JSON.stringify(results.rows.item(i).Task_Name));
           //  alert('fetchAddedItemsSuccess is' + JSON.stringify(results.rows.item(i).Expiry_Date));

//        }
        
//            Database.taskListCallBack(results);
//            Database.taskListCallBack = null;
            for (var i=0;i < results.rows.length; i++){
                var res = results.rows.item(i);
            			Database.taskListObjects[i] = new taskListObjects(res.Item_Id, res.Task_Name, res.Expiry_Date);
            }
        
        if (Database.taskListCallBack !== null && Database.taskListCallBack != undefined )  {
            Database.taskListCallBack(Database.taskListObjects);
            Database.taskListCallBack = null;
        }
       // alert('hello we ot ou');
        

    }
    
    this.fetchAddedItemsError = function (err) {
        alert('got an error while fetch' + err.message);
    }
};
