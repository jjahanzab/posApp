import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppStyle from '../../assets/css/AppStyle';
import PosContainerStyle from "../../assets/css/PosContainerStyle";

import { PosContext } from '../../context/PosContext';
import Loader from '../Loader';
import Menu from "./Menu";
import Submenu from "./Submenu";
import Basket from "./Basket";
import Checkout from './Checkout';

const PosContainer = (props) => {

  const { posLoader, payNow } = useContext(PosContext);
  const [ generalSetting, setGeneralSetting ] = useState({});
  const [ authUser, setAuthUser ] = useState({});

  useEffect(()=>{

    // get general-settings local storage data //
    if (Object.keys(generalSetting).length == 0) {
      const loadGeneralSettings = async () => {
        try {
          let generalSettings = await AsyncStorage.getItem('general-settings');
          if (generalSettings == null || generalSettings == '') {
            console.log('general-settings storage is empty');
          } else {
            let objectValue = JSON.parse(generalSettings);
            // console.log(objectValue);
            setGeneralSetting(objectValue);
          }
        } catch (error) {
          console.log('general-settings AsyncStorage catch error');
        }
      }
      loadGeneralSettings();
    }
    
    // get auth-user local storage data //
    if (Object.keys(authUser).length == 0) {
      const loadAuthUser = async () => {
        try {
          let authUser = await AsyncStorage.getItem('auth-user');
          if (authUser == null || authUser == '') {
            console.log('auth-user storage is empty');
          } else {
            let objectValue = JSON.parse(authUser);
            // console.log(objectValue);
            setAuthUser(objectValue);
          }
        } catch (error) {
          console.log('auth-user AsyncStorage catch error');
        }
      }
      loadAuthUser();
    }

  },[])

  if (posLoader == 'true') {
    return(
      <Loader/>
    )
  } else if (posLoader == 'false') {
    return (
      <>
        <SafeAreaView>
          <View style={AppStyle.container}>
            <StatusBar hidden={true} />
            <ScrollView>
              
              {/* main components start */}
              {
                payNow == true ? 
                  <>
                    <View style={PosContainerStyle.row}>
                      <Checkout />
                      <Basket generalSetting={generalSetting} authUser={authUser} />
                    </View>
                  </>
                  :
                  <>
                    <View style={PosContainerStyle.row}>
                      <Submenu />
                      <Basket generalSetting={generalSetting} authUser={authUser} />
                    </View>
                    <View style={PosContainerStyle.row}>
                      <Menu />
                    </View>
                  </>
              }
              {/* main components end */}
  
            </ScrollView>
          </View>
        </SafeAreaView>
  
      </>
    );
  }
}

export default PosContainer;