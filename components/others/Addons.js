import React, { useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { InstallContext } from "../../context/InstallContext";

import { AddonModel } from "../../Models/AddonModel";
import { DbModel } from "../../Models/DbModel";

const Addons = () => {

  const { allAddons, setAllAddons, addonTableFields, setAddonTableFields } = useContext(InstallContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModel = async () => {
    setModalVisible(true);

    await AddonModel.getAddons(setAllAddons);
    let addonfields = await DbModel.showTableFields('addons_tbl');
    setAddonTableFields(addonfields);
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
                  { addonTableFields && addonTableFields.map((field, index) => {
                      return (
                        field.name+' - '
                      )
                    })
                  }
                </Text>

                <Text>------------------------------------------------</Text>

                { allAddons && allAddons.map((addon, index) => {
                    return (
                      <Text key={index}>{addon.id} - {addon.group_id} - {addon.name} - {addon.price} - {addon.orders}</Text>
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
        <Text style={styles.textStyle}>Show Addons</Text>
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

export default Addons;