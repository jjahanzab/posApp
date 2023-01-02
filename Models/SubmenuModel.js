import axios from 'axios';
import { db } from './Database';

const createSubmenusTable = () => {
  try {
    
    db.transaction(tx => {
        tx.executeSql(`drop table if exists submenus`, [])
      },
      (_, error) => {  console.log("db error drop submenus table") },
      (_, success) => { console.log("db drop submenus table") }
    )
  
    db.transaction(tx => {
        tx.executeSql(`create table if not exists submenus 
          ( id integer primary key not null, 
            menu_id text,
            name text,
            description text,
            price text,
            orders text
          )
        `);
      },
      (_, error) => { console.log("db error create submenus table") },
      (_, success) => { console.log("db create submenus table") }
    )

  } catch (error) {
    console.log(`createSubmenusTable api try catch error`);
  }
}


const insertSubmenus = async () => {

  try {

    await createSubmenusTable();
      
    await axios.get(`https://sahitepos.sahittest.co.uk/api/v1/app/get-all-submenus`).then((f_response) => {
      if (f_response && f_response.data.statusCode == '200') {
        let res = f_response.data.submenus;
        if (res.total > 0) {
          
          let records = [];
          let total_pages = res.last_page;
          for (var i = 1; i <= total_pages; i++) {

            const loadSecondLoop = async () => {
              await axios.get(`${res.path}/?page=${i}`).then((s_response) => {
                if (s_response && s_response.data.statusCode == '200') {
  
                  let resp = s_response.data.submenus;
                  if (resp.data.length > 0) {
                    
                    let elementsArr = resp.data;
                    records.push(elementsArr);

                    db.transaction( tx => {
                      elementsArr.forEach(element => {
                          var singleArr = Object.values(element);
                          console.log(singleArr);
                          tx.executeSql(`insert into submenus ( id, menu_id, name, description, price, orders ) values (?, ?, ?, ?, ?, ?)`, singleArr );
                        });
                      },
                      (t, error) => { console.log("db error insert submenus table ") },
                      (t, success) => { console.log("db insert submenus table") }
                    )
  
                  }
  
                }
              }).catch((error) => {
                console.log(`loop ${i} axios error`);
              })
            }
            loadSecondLoop();

          }
          Promise.all(records).then(() => console.log('task completed'));
        }
      }
    }).catch((error) => {
      console.log(`insertSubmenus api axios error`);
    })

  } catch (error) {
    console.log(`insertSubmenus api try catch error`);
  }
}


const getSubmenus = (setAllSubmenus) => {
  setAllSubmenus([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from submenus_tbl',[],
          (_, { rows: { _array } }) => {
            setAllSubmenus(_array)
          }
        );
      },
      (t, error) => { console.log("db error load submenus") },
      (_t, _success) => { console.log("db load submenus"); }
    );
  // })
}


export const SubmenuModel = {
  createSubmenusTable, insertSubmenus, getSubmenus
};