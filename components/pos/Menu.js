import React, { useContext, useEffect } from 'react';
import MenuStyle from "../../assets/css/MenuStyle";
import { Text, View, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getDbMenus, getDbSubmenusById } from '../../redux/actions/PosAction';
import { PosContext } from  '../../context/PosContext';
import { MenuModel } from "../../Models/MenuModel";

function Menu(props) {

  const { menuId, setMenuId, deliveryType } = useContext(PosContext);
  const dispatch = useDispatch();
  const { dbMenus } = useSelector(state => state.PosReducer);

  useEffect(()=>{
    dispatch(getDbMenus());
  },[]);


  const handleMenuData = (menu) => {
    dispatch(getDbSubmenusById(menu.id));
    setMenuId(menu.id);
  }

  const loadMenusView = (menu, index) => {
    if (deliveryType == "T") {
      if (menu.timingslots && menu.timingslots.collection_status == "A") {
      } else {
        return(
          loadMenuView(menu, index)
        )
      }
    } else if (deliveryType == "D") {
      if (menu.timingslots && menu.timingslots.delivery_status == "A") {
      } else {
        return(
          loadMenuView(menu, index)
        )
      }
    }
  }
  
  const loadMenuView = (menu, index) => {
    if (menuId == menu.id) {
      return (
        <Pressable key={index} style={[MenuStyle.col_2, MenuStyle.menusBox, MenuStyle.menusBoxActive]}
          onPress={() => handleMenuData(menu)}
        >
          <Text style={MenuStyle.menuText}>{ menu.id }-{ menu.name } </Text>
        </Pressable>
      )
    } else {
      return (
        <Pressable key={index} style={[MenuStyle.col_2, MenuStyle.menusBox]}
          onPress={() => handleMenuData(menu)}
        >
          <Text style={MenuStyle.menuText}>{ menu.id }-{ menu.name } </Text>
        </Pressable>
      )
    }
  }


  return (
    <>
      <View style={[MenuStyle.col_12, MenuStyle.menuSection]}>

        <View style={MenuStyle.row}>

          { dbMenus && dbMenus.map((menu, index)=>{
              return (
                menu.timings && menu.timings.day_status == "A" ? "" : loadMenusView(menu, index)
              )
          })}
          
          {/* { dbMenus && dbMenus.map((menu, index)=>{
              return (
                menu.timings && menu.timings.day_status == "A" ? "" : 
                  menu.timingslots && menu.timingslots.collection_status == "A" ? "" : 
                    <Pressable key={index} style={[MenuStyle.col_2, MenuStyle.menusBox]}
                      onPress={() => handleMenuData(menu)}
                    >
                      <Text style={MenuStyle.menuText}>{ menu.id }-{ menu.name }</Text>
                    </Pressable>
              )
          })} */}

        </View>

      </View>
    </>
  );
}

export default Menu;