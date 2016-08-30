/*!
	@author		164126
	@page		database.js
	@abstract	Contains database related functions
	@discussion This file contains all the functions which are required for DB operations
 */

var Database = new function(){
    this.db = null;
    
    
    this.openDatabase = function(){
        this.db = window.sqlitePlugin.openDatabase({name: "DB", key: ""});
        alert('database created');
    }
    
    this.createTables = function(){
        this.db.transaction(this.creatItemTable, this.creatItemTableError, this.creatItemTableSuccess);
    }
    
    this.creatItemTable = function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS TaskBank(Item_Id VARCHAR(45) PRIMARY KEY, Task_Name VARCHAR(100), Expiry_Date VARCHAR(45))');
    }
    this.creatItemTableError =  function(err) {
        console.log('creatItemTableError is' + err.message);
    }
    
    this.creatItemTableSuccess = function () {
        console.log('table created');
    }
    
};