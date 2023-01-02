import React, { useContext, useState, useEffect } from 'react';
import { Modal, Pressable, View, ScrollView } from "react-native";
import { Checkbox, Button, Divider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PosContext } from '../../context/PosContext';

import AddonStyle from "../../assets/css/AddonStyle";

const Addons = (props) => {

  const { submenuGroupAddons, setsubmenuGroupAddons } = useContext(PosContext);

  const [addonModal, setAddonModal] = useState(false);
  const [lists, setLists] = useState([]);
  const [helper, setHelper] = useState(0);

  useEffect(() => {
    try {
      if (submenuGroupAddons && submenuGroupAddons.length > 0) {
        setAddonModal(true);
        setLists(submenuGroupAddons);
      }
    } catch (exception) {
      console.log(exception);
    }
  }, [submenuGroupAddons]);

  const hideAddonModal = () => {
    setAddonModal(false);
    setsubmenuGroupAddons([]);
    setLists([]);
  }

  const handleAddonActive = (item) => {
    let alterData = lists;
    alterData.map((group) => {
      group.addons.map((addon) => {
        if (addon.group_id == item.group_id && addon.addson_id == item.addson_id) {
          if (addon["status"] && addon["status"] == "active") {
            delete addon["status"];
          } else {
            addon["status"] = "active";
          }
        }
        return addon;
      })
    })
    setLists(alterData);
    setHelper(+new Date());
  }
  
  const handleTesting = () => {
    console.warn(lists);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addonModal}
      onRequestClose={() => {
      }}
    >
      <View style={AddonStyle.centeredView}>
        <View style={AddonStyle.modalView}>

          <ScrollView>

            {lists ? lists.map((group, index) => {
              return (
                <View key={index} style={AddonStyle.groupBox}>
                  <Text variant="titleMedium">{group.name}</Text>
                  <Divider />

                  <View style={AddonStyle.row}>
                    { group.addons ? group.addons.map((item, ind) => {
                        return (
                          <View key={ind} style={AddonStyle.col_3}>
                            { item.status && item.status == "active"  ?
                                <Pressable style={AddonStyle.AddonBtnActive} onPress={() => { handleAddonActive(item) }}>
                                  <Text style={AddonStyle.AddonBtnTextActive}>{item.name}</Text>
                                </Pressable>
                              :
                                <Pressable style={AddonStyle.AddonBtn} onPress={() => { handleAddonActive(item) }}>
                                  <Text style={AddonStyle.AddonBtnText}>{item.name}</Text>
                                </Pressable>
                            }
                          </View>
                        )
                    })
                      : ''
                    }
                  </View>
                </View>
              )
            })
              : ''
            }

            <Divider />
            <View style={[AddonStyle.row, AddonStyle.addonModalFooter]}>
              <View style={AddonStyle.col_3}>
                <Pressable style={[AddonStyle.button, AddonStyle.buttonClose]} onPress={() => handleTesting()}>
                  <Text style={AddonStyle.buttonCloseText}>Add to Cart</Text>
                </Pressable>
              </View>
              <View style={AddonStyle.col_3}>
                <Pressable style={[AddonStyle.button, AddonStyle.buttonClose]} onPress={() => hideAddonModal()}>
                  <Text style={AddonStyle.buttonCloseText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


export default Addons;