import { StyleSheet } from "react-native";

const LoginStyle = StyleSheet.create({

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

  container: {
    flex: 1,
    // backgroundColor: '#e6f0ff',
    backgroundColor: '#2FA8FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  input: {
    height: 40,
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#444',
    padding: 10,
  },

  usersBtn: {
    // backgroundColor: '#2FA8FD',
    borderColor: '#2FA8FD',
    borderWidth: 2,
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 2,
    padding: 10,
    margin: 5,
  },

  usersBtnActive: {
    backgroundColor: '#2FA8FD',
    borderColor: '#2FA8FD',
    borderWidth: 2,
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 2,
    padding: 10,
    margin: 5,
  },

  usersBtnInside: {
    fontWeight: '700',
    fontSize: 10,
    color: '#2FA8FD',
  },

  usersBtnInsideActive: {
    fontWeight: '700',
    fontSize: 10,
    color: 'white',
  },

  customBtn: {
    width: 100,
  },

  card: {
    backgroundColor: '#fff',
    shadowColor: "black",
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },

  cardBody: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  cardDivider: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  }

});

export default LoginStyle;