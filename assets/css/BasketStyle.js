import { StyleSheet } from "react-native";

const BasketStyle = StyleSheet.create({

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // textAlign: 'center',
  },

  col_1: { float: 'left', width: '8.33%'},
  col_2: { float: 'left', width: '16.66%'},
  col_3: { float: 'left', width: '25%'},
  col_4: { float: 'left', width: '33.33%'},
  col_5: { float: 'left', width: '41.66%'},
  col_6: { float: 'left', width: '50%'},
  col_7: { float: 'left', width: '58.33%'},
  col_8: { float: 'left', width: '66.66%'},
  col_9: { float: 'left', width: '75%'},
  col_10: { float: 'left', width: '83.33%'},
  col_11: { float: 'left', width: '91.66%'},
  col_12: { float: 'left', width: '100%'},

  basketSection: {
    padding: 1,
    borderWidth: 1,
    borderColor: "#e9ecef", 
    borderRadius: 5,
  },

  basketContainer: {
    width: '100%',
    height: 350,
    borderBottomWidth: 2,
    borderBottomColor: "#e9ecef",
    // backgroundColor: 'green',
  },

  basketCell: {
    // height: 20,
    padding: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 2,
    // flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },

  basketTextNo: {
    fontSize: 9,
    textAlign: 'center',
  },

  basketTextName: {
    fontSize: 9,
    // textAlign: 'center',
  },

  basketTextPrice: {
    fontSize: 9,
    textAlign: 'center',
  },

  fontBold: {
    fontWeight: '700',
  },

  totalPrice: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 20,
    marginRight: 3,
  },

  clearBasketBtn: {
    backgroundColor: 'black',
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 15,
    padding: 8,
    margin: 5,
  },

  clearBasketBtnInside: {
    fontWeight: '700',
    fontSize: 9,
    color: 'white'
  },

  textVerticalCenter: {
    justifyContent: 'center',
  },

  breakLine: {
    width: '100%',
  },

  incBtn: {
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#009900'
  },

  decBtn: {
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#e60000'
  },

  deliveryBtnActive: {
    backgroundColor: 'black',
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    margin: 4,
  },
  deliveryBtnInsideActive: {
    fontWeight: '700',
    fontSize: 8,
    color: 'white'
  },
  deliveryBtn: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    margin: 4,
  },
  deliveryBtnInside: {
    fontWeight: '700',
    fontSize: 8,
    color: 'black'
  },
  
});

export default BasketStyle;