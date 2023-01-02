import React from 'react';
import axios from 'axios';
import { db } from './Database';

const createUsersTable = async () => {
  try {

    db.transaction(tx => {
        tx.executeSql(`drop table if exists users`, [])
      },
      (_, error) => {  console.log("db error drop users table") },
      (_, success) => { console.log("db drop users table") }
    )
  
    db.transaction(tx => {
        tx.executeSql(`create table if not exists users 
          ( id integer primary key not null, 
            name text,
            email text unique,
            password text,
            online_user text,
            role text
          )
        `);
      },
      (_, error) => { console.log("db error create users table") },
      (_, success) => { console.log("db create users table") }
    )

  } catch (error) {
    console.log(`createUsersTable api try catch error`);
  }
}

const insertUsers = async () => {
  try {

    await createUsersTable();

    await axios.get(`https://sahitepos.sahittest.co.uk/api/v1/app/get-all-users`).then((response) => {
      if (response) {
        if (response.data.statusCode == '200') {
          let appUsers = response.data.users;
          if (appUsers.length > 0) {
            
            db.transaction( tx => {
              appUsers.forEach(element => {
                  var singleArr = Object.values(element);
                  // console.log(singleArr);
                  tx.executeSql(`insert into users 
                    ( id, name, email, password, online_user, role ) 
                    values (?, ?, ?, ?, ?, ?)`, singleArr );
                });
              },
              (t, error) => { console.log("db error insert users table"); },
              (t, success) => { console.log("db insert users table"); }
            )

          }
        }
      }
    }).catch((error) => {
      console.log(`getAllUsers api error ${error}`);
    })
  } catch (error) {
    console.log(`getAllUsers api error`);
  }
}

const getUsers = (setAllUsers) => {
  setAllUsers([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from users_tbl',[],
          (_, { rows: { _array } }) => {
            setAllUsers(_array)
          }
        );
      },
      (t, error) => { console.log("db error load users"); },
      (_t, _success) => { console.log("db load users"); }
    );
  // })
}

// const getUser = (id, setItem) => {
//   return new Promise((resolve, reject) => {
//     db.transaction(
//       tx => {
//         tx.executeSql('select * from users where id = ? ',[id],
//           (_, { rows: { _array } }) => {
//             setItem(_array)
//           }
//         );
//       },
//       (t, error) => { console.log("db error get user"); },
//       (_t, _success) => { console.log("db get user"); resolve("get user")}
//     );
//   })
// }

// const insertUser = async (userArr) => {
//   new Promise((resolve, reject) => {
//     db.transaction( tx => {
//         tx.executeSql(`insert into users 
//           ( id, name, email, password, online_user, role ) 
//           values (?, ?, ?, ?, ?, ?)`, userArr );
//       },
//       (t, error) => { console.log("db error insert user"); },
//       (t, success) => { console.log("db insert user"); resolve(success) }
//     )
//  })
// }

// const deleteUser = (id) => {
//   new Promise((resolve, reject) => {
//     db.transaction(
//       tx => {
//         tx.executeSql('DELETE FROM users WHERE id = ? ', [id])
//       },
//       (t, error) => { console.log("db error delete user"); },
//       (_t, _success) => { console.log("db delete user"); resolve("delete user")}
//     )
//   })
// }

// const updateUser = (id, value) => {
//   new Promise((resolve, reject) => {
//     db.transaction(
//       tx => {
//         tx.executeSql('UPDATE users SET name = ? WHERE id = ?', [value, id])
//       },
//       (t, error) => { console.log("db error update user"); },
//       (_t, _success) => { console.log("db update user"); resolve("update user")}
//     )
//   })
// }


export const UserModel = {
  createUsersTable, insertUsers, getUsers, 
  // insertUser, getUser, deleteUser, updateUser
};