import { MongoClient } from 'mongodb';
var dbName = 'quan_ly_nhan_su_db'
var url = 'mongodb://localhost:27017/'

class DatabaseService {
    constructor(){}

    createDabase() {
        MongoClient.connect(dbName + dbName, function(err, db) {
            if (err) throw err
            console.log("Database created")
            db.close()
        })
    }

    createTable(tableName) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err
            var dbo = db.db(dbName)
            dbo.createCollection(tableName, function(err, res) {
                if (err) throw err
                console.log("Database created")
                db.close()
            })
        })
    }

    insertData(table, data) {
        MongoClient.connect(url, function(error, database) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).insertOne(data, function(error, res) {
              if (error) throw error;
              console.log("1 document inserted");
              database.close();
            });
          });
    }

    queryData(table, data) {
        MongoClient.connect(url, function(error, database) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).find(data).toArray(function(error, result) {
              if (error) throw error;
              console.log(result);
              database.close();
            });
          });
    }

    deleteData(table, data) {
        MongoClient.connect(url, function(error, database) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).deleteOne(data, function(error, result) {
              if (error) throw error;
              console.log(result);
              database.close();
            });
          });
    }

    updateData(table, query, newData) {
        MongoClient.connect(url, function(error, database) {
            if (error) throw error
            var dbo = database.db(dbName)
            dbo.collection(table).updateOne(query, newData, function(err, result) {
                if (err) throw err;
                console.log(result);
                database.close();
            })
        })
    }
}
