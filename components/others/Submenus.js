import React, { useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { InstallContext } from "../../context/InstallContext";

import { SubmenuModel } from "../../Models/SubmenuModel";
import { DbModel } from "../../Models/DbModel";

const Submenus = () => {

  const { allSubmenus, setAllSubmenus, submenuTableFields, setSubmenuTableFields } = useContext(InstallContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = async () => {
    setModalVisible(true);
    
    await SubmenuModel.getSubmenus(setAllSubmenus);
    let submenufields = await DbModel.showTableFields('submenus_tbl');
    setSubmenuTableFields(submenufields);
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
          <ScrollView>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>Hello World!</Text> */}

                <Text>
                  { submenuTableFields && submenuTableFields.map((field, index) => {
                      return (
                        field.name+' - '
                      )
                    })
                  }
                </Text>

                <Text>------------------------------------------------</Text>

                { allSubmenus && allSubmenus.map((submenu, index) => {
                    return (
                      <Text key={index}>{submenu.id} - {submenu.menu_id} - {submenu.name} - {submenu.description} - {submenu.price} - {submenu.orders}</Text>
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
          </ScrollView>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => handleModal()}
      >
        <Text style={styles.textStyle}>Show Submenus</Text>
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

export default Submenus;