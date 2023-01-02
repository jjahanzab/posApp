import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, SafeAreaView } from 'react-native';

import AppStyle from '../../assets/css/AppStyle';
import PosLayoutStyle from "../../assets/css/PosLayoutStyle";

import { PosContext } from '../../context/PosContext';
import Loader from '../Loader';
import Menu from "./Menu";
import Submenu from "./Submenu";
import Basket from "./Basket";

const PosLayout = (props) => {

  const { posLoader } = useContext(PosContext);

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
              <View style={PosLayoutStyle.row}>
                <Submenu />
                <Basket />
              </View>
              <View style={PosLayoutStyle.row}>
                <Menu />
              </View>
              {/* main components end */}
  
            </ScrollView>
          </View>
        </SafeAreaView>
  
      </>
    );
  }
}

export default PosLayout;