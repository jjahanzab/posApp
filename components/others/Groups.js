import React, { useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { InstallContext } from "../../context/InstallContext";

import { GroupModel } from "../../Models/GroupModel";
import { DbModel } from "../../Models/DbModel";

const Groups = () => {

  const { allGroups, setAllGroups, groupTableFields, setGroupTableFields } = useContext(InstallContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModel = async () => {
    setModalVisible(true);

    await GroupModel.getGroups(setAllGroups);
    let groupfields = await DbModel.showTableFields('groups_tbl');
    setGroupTableFields(groupfields);
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
                  { groupTableFields && groupTableFields.map((field, index) => {
                      return (
                        field.name+' - '
                      )
                    })
                  }
                </Text>

                <Text>------------------------------------------------</Text>

                { allGroups && allGroups.map((group, index) => {
                    return (
                      <Text key={index}>{group.id} - {group.name} - {group.orders} - {group.min_quantity} - {group.max_quantity} - {group.special_group}</Text>
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
        <Text style={styles.textStyle}>Show Groups</Text>
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

export default Groups;