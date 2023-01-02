import { db } from './Database';

const showTables = async (setAllTables) => {
  new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type = 'table'",[],
          (_, { rows: { _array } }) => {
            setAllTables(_array)
          }
        );
      },
      (t, error) => { setAllTables([]); console.log("db error load tables"); },
      (_t, _success) => { console.log("db error load tables"); resolve(_success); }
    );
  })
}

const showTableFields = async (table_name) => {
  return new Promise((resolve, reject) => {
    let fields = [];
    db.transaction(
      tx => {
        tx.executeSql(`SELECT name FROM PRAGMA_TABLE_INFO('${table_name}')`,[],
          (_, { rows: { _array } }) => {
            fields = _array;
          }
        );
      },
      (t, error) => { console.log(`db error load ${table_name} table fields`); },
      (_t, _success) => { console.log(`db load ${table_name} table fields`); resolve(fields); }
    );
  })
}

const dropTable = async (table_name) => {
  new Promise((resolve, reject) => {
    db.transaction(tx => {
        tx.executeSql(`drop table if exists ${table_name}`, [])
      },
      (_, error) => {  console.log("db error drop table"); },
      (_, success) => { console.log("db drop table"); resolve(success) }
    )
  })
}

const truncateTable = async (table_name) => {
  new Promise((resolve, reject) => {
    db.transaction(tx => {
        tx.executeSql(`truncate from ${table_name}`, [])
      },
      (_, error) => { console.log("db error truncate table"); },
      (_, success) => { console.log("db truncate table"); resolve(success) }
    )
  })
}


export const DbModel = {
  showTables, showTableFields, dropTable, truncateTable
};