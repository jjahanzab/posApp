import React, { useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { InstallContext } from "../../context/InstallContext";

import { MenuModel } from "../../Models/MenuModel";
import { DbModel } from "../../Models/DbModel";

const Menus = () => {

  const { allMenus, setAllMenus, menuTableFields, setMenuTableFields } = useContext(InstallContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModel = async () => {
    setModalVisible(true);

    await MenuModel.getMenus(setAllMenus);
    let menufields = await DbModel.showTableFields('menus_tbl');
    setMenuTableFields(menufields);
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

              <Text>
                { menuTableFields && menuTableFields.map((field, index) => {
                    return (
                      field.name+' - '
                    )
                  })
                }
              </Text>

              <Text>------------------------------------------------</Text>

              { allMenus && allMenus.map((menu, index) => {
                  return (
                    <Text key={index}>{menu.id} - {menu.name} - {menu.orders}</Text>
                  )
                })
              }

            <Text> </Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => handleModel()}
      >
        <Text style={styles.textStyle}>Show Menus</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Menus;