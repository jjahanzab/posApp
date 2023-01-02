import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDbUsers, changeAuthStatus } from '../../redux/actions/PosAction';
import LoginStyle from "../../assets/css/LoginStyle";
import Loader from '../Loader';

const Login = ({ navigation }) => {

  const [ loader, setLoader ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const { dbUsers, authStatus } = useSelector(state => state.PosReducer);

  const dispatch = useDispatch();

  useEffect(()=>{
    if (authStatus == '' || authStatus == false) {
      dispatch(getDbUsers());
    }
  },[]);

  const onChangePassword = (text) => {
    setPassword(text);
  }

  const applyAuth = async (email, password) => {
    setLoader(true);

    if (email == '' && password == '') {
      btnAlert('Please provide credentials');

    } else if (password == '') {
      btnAlert('Please provide valid password');

    } else if (email && email.length > 0 && password && password.length) {
      let validEmail = false;
      let validPassword = false;

      dbUsers.map((user)=>{
        if (user.email == email && user.password == password) {
          validEmail = true;
          validPassword = true;

        } else if (user.email == email && user.password !== password) {
          validEmail = false;
          validPassword = false;
        }
      });

      if (validEmail == false && validPassword == false) {
        btnAlert('invalidate credentials');

      } else if (validEmail == true && validPassword == true) {
        dispatch(changeAuthStatus(true));

        AsyncStorage.setItem('auth', 'true');
      }
    }

    setLoader(false);
  }

  const btnAlert = (message) => Alert.alert(
    "Log in!",
    message
  );


  if (loader) {
    return(
      <Loader/>
    )
  } else {
    return (
      <>
        <View style={LoginStyle.container}>
          {/* <StatusBar style="auto" /> */}
  
          <View style={LoginStyle.card}>
            <View style={LoginStyle.cardBody}>
              <Text style={LoginStyle.cardTitle}>{'Sign In'}</Text>
              <View style={LoginStyle.cardDivider}></View>
              
              <View style={LoginStyle.row}>
                { dbUsers && dbUsers.map((user, index)=>{
                    return (
                      <View key={index} style={LoginStyle.col_4}>
                        <TouchableOpacity onPress={() => setEmail(user.email)}>
                          { email == user.email ? 
                              <View style={LoginStyle.usersBtnActive}>
                                <Text style={LoginStyle.usersBtnInsideActive}>{user.name}</Text>
                              </View>
                            :
                            <View style={LoginStyle.usersBtn}>
                              <Text style={LoginStyle.usersBtnInside}>{user.name}</Text>
                            </View>
                          }
                        </TouchableOpacity>
                      </View>
                    )
                })}
              </View>
              
              <Text></Text>
  
              <TextInput
                style={LoginStyle.input}
                onChangeText={(text) => onChangePassword(text)}
                value={password}
                placeholder="password"
                secureTextEntry={true}
                selectionColor={"#80b3ff"}
              />
  
              <Text></Text>
  
              <View style={LoginStyle.customBtn}>
                <Button
                  title="Login"
                  onPress={() => applyAuth(email, password)}
                />
              </View>
  
            </View>
          </View>
  
  
        </View>
      </>
    );
  }
}

export default Login;