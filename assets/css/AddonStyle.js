import { StyleSheet } from "react-native";

const AddonStyle = StyleSheet.create({

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

  centeredView: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '100%',
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  addonModalFooter: {
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    maxWidth: 100,
    backgroundColor: "#333333",
  },
  buttonCloseText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  groupBox: {
    marginBottom: 10,
  },
  AddonBtn: {
    height: 40,
    margin: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#2FA8FD',
    borderWidth: 1,
  },
  AddonBtnActive: {
    height: 40,
    margin: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#2FA8FD',
  },
  AddonBtnText: {
    color: '#0285e3',
  },
  AddonBtnTextActive: {
    color: '#ffffff',
  },
  SpecialGroupInput: {
    // margin: 12,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  SpecialGroupBtn: {
    height: 40,
    marginLeft: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#2FA8FD',
    borderWidth: 1,
  },
  SpecialGroupBtnActive: {
    height: 40,
    marginLeft: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#2FA8FD',
  },

});

export default AddonStyle;