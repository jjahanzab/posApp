import React, { useContext, useState, useEffect } from 'react';
import CheckoutStyle from "../../assets/css/CheckoutStyle";
import { Text, View, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getDbMenus, getDbSubmenusById } from '../../redux/actions/PosAction';
import { PosContext } from  '../../context/PosContext';

const Checkout = (props) => {

  const { paymentType, setPaymentType } = useContext(PosContext);
  // const dispatch = useDispatch();
  // const { dbMenus } = useSelector(state => state.PosReducer);

  useEffect(()=>{
    
  },[]);

  const changePaymentTypeFun = (val) => {
    setPaymentType(val);
  }

  return (
    <View style={[CheckoutStyle.col_7, CheckoutStyle.checkoutSection]}>
      <ScrollView>
          
        {/* Delivery Types */}
        <View style={CheckoutStyle.row}>
          <View style={CheckoutStyle.col_5}>
            <TouchableOpacity onPress={()=>changePaymentTypeFun('C')}>
              { paymentType == 'C' ?
                  <View style={CheckoutStyle.paymentBtnActive}>
                    <Text style={CheckoutStyle.paymentBtnInsideActive}>{'Pay Cash'}</Text>
                  </View>
                :
                  <View style={CheckoutStyle.paymentBtn}>
                    <Text style={CheckoutStyle.paymentBtnInside}>{'Pay Cash'}</Text>
                  </View>
              }
            </TouchableOpacity>
          </View>
          <View style={CheckoutStyle.col_5}>
            <TouchableOpacity onPress={()=>changePaymentTypeFun('D')}>
              { paymentType == 'D' ?
                  <View style={CheckoutStyle.paymentBtnActive}>
                    <Text style={CheckoutStyle.paymentBtnInsideActive}>{'Pay Card'}</Text>
                  </View>
                :
                  <View style={CheckoutStyle.paymentBtn}>
                    <Text style={CheckoutStyle.paymentBtnInside}>{'Pay Card'}</Text>
                  </View>
              }
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

export default Checkout;