import React, { useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { InstallContext } from "../../context/InstallContext";

import { SubmenuAddonModel } from "../../Models/SubmenuAddonModel";
import { DbModel } from "../../Models/DbModel";

const SubmenuAddons = () => {

  const { allSubmenuAddons, setAllSubmenuAddons, submenuAddonTableFields, setSubmenuAddonTableFields } = useContext(InstallContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModel = async () => {
    setModalVisible(true);

    await SubmenuAddonModel.getSubmenuAddons(setAllSubmenuAddons);
    let submenuaddonfields = await DbModel.showTableFields('submenu_addons_tbl');
    setSubmenuAddonTableFields(submenuaddonfields);
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

                <Text>
                  { submenuAddonTableFields && submenuAddonTableFields.map((field, index) => {
                      return (
                        field.name+' - '
                      )
                    })
                  }
                </Text>

                <Text>------------------------------------------------</Text>

                { allSubmenuAddons && allSubmenuAddons.map((submenuaddon, index) => {
                    return (
                      <Text key={index}>{submenuaddon.id} - {submenuaddon.menu_id} - {submenuaddon.submenu_id} - {submenuaddon.group_id} - {submenuaddon.addson_id} - {submenuaddon.group_order}</Text>
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
        onPress={() => handleModel()}
      >
        <Text style={styles.textStyle}>Show SubmenuAddons</Text>
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

export default SubmenuAddons;