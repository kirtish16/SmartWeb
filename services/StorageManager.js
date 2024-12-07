import SQLite from 'react-native-sqlite-storage';
import WebData from '../entity/WebData';

class StorageManager {
  constructor() {
    this.db = SQLite.openDatabase(
      { name: 'myDatabase', location: 'default' },
      () => {
        console.log('Database opened successfully');
        this.initializeTables()
          .then(() => {
            console.log('Tables initialized successfully');
          })
          .catch((error) => {
            console.error('Error initializing tables:', error);
          });
      },
      (error) => {
        console.error('Error opening database:', error);
      }
    );
  }

  // Ensure the table exists
  initializeTables() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS myTable (
              id TEXT PRIMARY KEY,
              title TEXT,
              url TEXT
            );`,
            [],
            () => {
              console.log('Table myTable created or already exists');
              resolve(); // Resolve when table creation is successful
            },
            (tx, error) => {
              console.error('Error creating table:', error);
              reject(error); // Reject on failure
            }
          );
        },
        (error) => {
          console.error('Transaction error during table creation:', error);
          reject(error);
        }
      );
    });
  }

  // Insert or Update Data
  upsertData = (data) => {
    console.log("Processing upsert for data:", data);
  
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          // Check if the record exists
          tx.executeSql(
            `SELECT id FROM myTable WHERE id = ?;`,
            [data.id],
            (tx, results) => {
              if (results.rows.length > 0) {
                // Record exists, perform UPDATE
                tx.executeSql(
                  `UPDATE myTable SET title = ?, url = ? WHERE id = ?;`,
                  [data.name, data.url, data.id],
                  () => {
                    console.log(`Successfully updated record with ID: ${data.id}`);
                    console.log(`Updated: ID=${data.id}, Name=${data.name}, URL=${data.url}`);

                  },
                  (tx, error) => {
                    console.error(`Error updating record with ID: ${data.id}`, error);
                    reject(error); // Reject the promise on update failure
                  }
                );
              } else {
                // Record does not exist, perform INSERT
                tx.executeSql(
                  `INSERT INTO myTable (id, title, url) VALUES (?, ?, ?);`,
                  [data.id, data.name, data.url],
                  () => {
                    console.log(`Successfully inserted new record with ID: ${data.id}`);
                    console.log(`Inserted: ID=${data.id}, Name=${data.name}, URL=${data.url}`);

                  },
                  (tx, error) => {
                    console.error(`Error inserting record with ID: ${data.id}`, error);
                    reject(error); // Reject the promise on insert failure
                  }
                );
              }
            },
            (tx, error) => {
              console.error(`Error checking existence of ID: ${data.id}`, error);
              reject(error); // Reject the promise on select failure
            }
          );
        },
        (error) => {
          console.error("Transaction failed:", error);
          reject(error); // Reject the promise if the transaction fails
        },
        () => {
          console.log("Transaction completed successfully.");
          resolve("Upsert completed"); // Resolve the promise when the transaction is successful
        }
      );
    });
  };
  
  // Retrieve Data with SQL Query
  executeQueryAndRetrieveData = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (tx, results) => {
            const dataArray = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              const item = rows.item(i);
              console.log("Fetched item:", item); // Add this log to verify data        
              const webData = new WebData(row.title, row.url);
              dataArray.push(webData);
            }
            console.log('Retrieved data:', dataArray);
            resolve(dataArray);
          },
          (tx, error) => {
            console.error('Error executing query:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Retrieve All Data
  // getData = () => {
    // return this.executeQueryAndRetrieveData('SELECT title, url,id FROM myTable');
    getData = () => {
      return new Promise((resolve, reject) => {
        console.log("Inside getData function");
        this.db.transaction(
          (tx) => {
            console.log("Inside transaction");
            tx.executeSql(
              `SELECT id, title, url FROM myTable;`,
              [],
              (tx, results) => {
                console.log("Query executed successfully");
                const dataItems = [];
                for (let i = 0; i < results.rows.length; i++) {
                  const item = results.rows.item(i);
                  console.log("Retrieved item:", item);
                  dataItems.push({
                    id: item.id,
                    name: item.title,
                    url: item.url,
                  });
                }
                resolve(dataItems); // Resolve the promise with data
              },
              (tx, error) => {
                console.error("Error executing SELECT query:", error);
                reject(error); // Reject the promise on error
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
            reject(error); // Reject on transaction error
          },
          () => {
            console.log("Transaction completed successfully");
          }
        );
      });
    };
    
  // };

    // Delete Data
    deleteData = (id) => {
      console.log("Processing delete for ID:", id);
  
      return new Promise((resolve, reject) => {
        this.db.transaction(
          (tx) => {
            tx.executeSql(
              `DELETE FROM myTable WHERE id = ?;`,
              [id],
              () => {
                console.log(`Deleted record with ID: ${id}`);
                resolve(`Deleted record with ID: ${id}`);
              },
              (tx, error) => {
                console.error(`Error deleting record with ID: ${id}`, error);
                reject(error);
              }
            );
          },
          (error) => {
            console.error("Transaction error during delete:", error);
            reject(error);
          },
          () => {
            console.log("Delete transaction completed successfully");
          }
        );
      });
    };
  

  // Clear All Data
  clearTable = () => {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM myTable;',
            [],
            () => console.log('Table cleared'),
            (tx, error) => {
              console.error('Error clearing table:', error);
              reject(error);
            }
          );
        },
        (error) => reject(error),
        resolve
      );
    });
  };
}

export default new StorageManager();