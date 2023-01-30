import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import Loader from './Loader';
import Install from './Install';
import Start from './Start';
import Main from './Main';
import Login from './pos/Login';
import PosContainer from './pos/PosContainer';
import { changeInstallStatus } from '../redux/actions/UserAction';
import { getDbUsers, changeAuthStatus } from '../redux/actions/PosAction';


const Home = (props) => {

  const { install } = useSelector(state => state.UserReducer);
  const { dbUsers, authStatus } = useSelector(state => state.PosReducer);
  
  const dispatch = useDispatch();

  const [ loader, setLoader ] = useState(false);


  // set values in storage & redux-state //
  useEffect(()=>{
    setLoader(true);
    
    if (install == '') {
      const firstLoad = async () => {

        try {
          let storage = await AsyncStorage.getItem('install');
          if (storage == null || storage == '') {
            AsyncStorage.setItem('install', 'first');
            dispatch(changeInstallStatus('first'));
            console.log('set storage first value');
          } else {
            dispatch(changeInstallStatus(storage));
            console.log('set storage predefined value => ' + storage);
          }
        } catch (error) {
          console.log('firstLoad catch error');
        }

        try {
          let tablesStatus = await AsyncStorage.getItem('tables-status');
          if (tablesStatus == null || tablesStatus == '') {
            console.log('tables-status storage is empty');
          } else {
            let objectValue = JSON.parse(tablesStatus);
            tableStatusStorage = objectValue;
            console.log(objectValue);
          }
        } catch (error) {
          console.log('firstLoad catch error');
        }

        try {
          let auth = await AsyncStorage.getItem('auth');
          if (auth == null || auth == '') {
            AsyncStorage.setItem('auth', 'false');
            console.log('set storage first value');
          } else if (auth == 'true') {
            dispatch(changeAuthStatus(true));
          }
        } catch (error) {
          console.log('firstLoad catch error');
        }
        
      }
      firstLoad();
    }

    setLoader(false);
  },[])


  useEffect(()=>{
    setLoader(true);

    console.log('install '+install);
    console.log('authStatus '+authStatus);

    if (install == 'third') {
      if (authStatus == '' || authStatus == false) {
        dispatch(getDbUsers());
      }
    }

    setLoader(false);
  },[install, authStatus]);


  const renderSwitch = () => {
    switch (install) {
      case 'first':
        return (
          <Stack.Navigator initialRouteName='Install'>
            <Stack.Screen name="Install" component={Install} options={{ title: 'Install', headerShown: false, orientation: 'all' }} />
          </Stack.Navigator>
        )
        break;
  
      case 'second':
        return (
          <Stack.Navigator initialRouteName='Start'>
            <Stack.Screen name="Start" component={Start} options={{ title: 'Start', headerShown: false, orientation: 'all' }} />
          </Stack.Navigator>
        )
        break;
      
      case 'third':
        if (dbUsers.length > 0) {

          if (authStatus == '' || authStatus == false) {
            return (
              <>
                <Stack.Navigator initialRouteName='Login'>
                  <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false, orientation: 'all' }} />
                </Stack.Navigator>
              </>
            )
          } else if (authStatus == true) {
            return (
              <>
                <Stack.Navigator initialRouteName='PosContainer'>
                  <Stack.Screen name="PosContainer" component={PosContainer} options={{ title: 'PosContainer', headerShown: false, orientation: 'all' }} />
                </Stack.Navigator>
              </>
            )
          }

        } else if (dbUsers.length < 1) {
          return (
            <>
              <Stack.Navigator initialRouteName='Install'>
                <Stack.Screen name="Install" component={Install} options={{ title: 'Install', headerShown: false, orientation: 'all' }} />
              </Stack.Navigator>
            </>
          )
        }
        
        break;
    
      default:
        return (
          <></>
        )
        break;
    }
  }
  
  if (loader) {
    return(
      <Loader/>
    )
  } else {
    return (
      <>
        <NavigationContainer>
          {renderSwitch()}
        </NavigationContainer>
      </>
    )
  }
}

export default Home;