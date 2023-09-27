var MongoClient = require('mongodb').MongoClient;
var dbName = 'quan_ly_nhan_su_db'
var url = `mongodb://localhost:27017/`

class DatabaseService {
    constructor(){}

    createDabase() {
        MongoClient.connect(dbName + dbName, function(err: any, db: any) {
            if (err) throw err
            console.log("Database created")
            db.close()
        })
    }

    createTable(tableName: string) {
        MongoClient.connect(url, function(err: any, db: any) {
            if (err) throw err
            var dbo = db.db(dbName)
            dbo.createCollection(tableName, function(err: any, res: any) {
                if (err) throw err
                console.log("Database created")
                db.close()
            })
        })
    }

    insertData(table: string, data: object) {
        MongoClient.connect(url, function(error: any, database: any) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).insertOne(data, function(error: any, res: any) {
              if (error) throw error;
              console.log("1 document inserted");
              database.close();
            });
          });
    }

    queryData(table: string, data: object) {
        MongoClient.connect(url, function(error: any, database: any) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).find(data).toArray(function(error: any, result: any) {
              if (error) throw error;
              console.log(result);
              database.close();
            });
          });
    }

    deleteData(table: string, data: object) {
        MongoClient.connect(url, function(error: any, database: any) {
            if (error) throw error;
            var dbo = database.db(dbName);
            dbo.collection(table).deleteOne(data, function(error: any, result: any) {
              if (error) throw error;
              console.log(result);
              database.close();
            });
          });
    }

    updateData(table: string, query: object, newData: object) {
        MongoClient.connect(url, function(error: any, database: any) {
            if (error) throw error
            var dbo = database.db(dbName)
            dbo.collection(table).updateOne(query, newData, function(err: any, result: any) {
                if (err) throw err;
                console.log(result);
                database.close();
            })
        })
    }
}
