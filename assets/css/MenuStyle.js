import { StyleSheet } from "react-native";

const MenuStyle = StyleSheet.create({

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

  menuSection: {
    padding: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
  },
  
  menusBox: {
    height: 60,
    padding: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menusBoxActive: {
    backgroundColor: '#cccccc',
  },

  menuText: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },

  breakLine: {
    width: '100%',
  },
  
});

export default MenuStyle;