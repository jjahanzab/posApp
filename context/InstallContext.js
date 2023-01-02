import React, { useState, useEffect } from 'react';


const InstallContext = React.createContext();

const InstallProvider = ({children}) => {

  const [ baseUrl, setBaseUrl ] = useState('https://sahitepos.sahittest.co.uk/api/v1/app');
  const [ allTables, setAllTables ] = useState([]);

  const [ allUsers, setAllUsers ] = useState([]);
  const [ userTableFields, setUserTableFields ] = useState([]);

  const [ allMenus, setAllMenus ] = useState([]);
  const [ menuTableFields, setMenuTableFields ] = useState([]);
  
  const [ allSubmenus, setAllSubmenus ] = useState([]);
  const [ submenuTableFields, setSubmenuTableFields ] = useState([]);

  const [ allGroups, setAllGroups ] = useState([]);
  const [ groupTableFields, setGroupTableFields ] = useState([]);

  const [ allAddons, setAllAddons ] = useState([]);
  const [ addonTableFields, setAddonTableFields ] = useState([]);
  
  const [ allSubmenuAddons, setAllSubmenuAddons ] = useState([]);
  const [ submenuAddonTableFields, setSubmenuAddonTableFields ] = useState([]);


  return (
    <>
      <InstallContext.Provider value={
        {
          allTables, 
          baseUrl, setBaseUrl, 

          allUsers, setAllUsers,
          userTableFields, setUserTableFields,
          allMenus, setAllMenus,
          menuTableFields, setMenuTableFields,
          allSubmenus, setAllSubmenus,
          submenuTableFields, setSubmenuTableFields,
          allGroups, setAllGroups,
          groupTableFields, setGroupTableFields,
          allAddons, setAllAddons,
          addonTableFields, setAddonTableFields,
          allSubmenuAddons, setAllSubmenuAddons,
          submenuAddonTableFields, setSubmenuAddonTableFields
        }
      }>
        {children}
      </InstallContext.Provider>
    </>
  );
}

export {InstallContext, InstallProvider};