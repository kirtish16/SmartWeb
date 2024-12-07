import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StorageManager from '../services/StorageManager';
import WebItem from './WebItem';
import InputPopup from './InputPopup';
import WebData from '../entity/WebData';
import FloatingButton from '../utils/FloatingButton';
import useTheme from '../utils/useTheme';

// Helper function: Generate a unique ID
const getUniqueId = () => `${Math.random().toString(20).substr(2, 8)}`;

// Main Component
export default function HomeScreen({ navigation }) {
  const [state, setState] = useState({
    webItems: [],
    popupData: null,
    isPopupVisible: false,
  });

  const theme = useTheme();

  // Open a web app screen with the selected item's details
  const openWebApp = (index) => {
    const { url, name } = state.webItems[index];
    navigation.navigate('WebApp', { url, name });
  };

  // Initialize data on app open
  const onAppOpen = () => {
    console.log('App opened!');
    handleGetData();
  };

  useEffect(() => {
    onAppOpen();
  }, []);

  // Fetch data from storage and update state
  const handleGetData = async () => {
    try {
      console.log("Getting data from db");
      const dataItems = await StorageManager.getData();
      const webItems = dataItems.map((data) => new WebData(data.name, data.url, data.id));
      console.log("Got data from db:", dataItems);
      setState((prevState) => ({ ...prevState, webItems }));
    } catch (error) {
      console.error("Error getting data from db:", error);
    }
    console.log("Done get data from db");
  };
  
  // Handle adding or editing a web item
  const handleSubmit = ({ input1: name, input2: url, id }) => {
    const webItems = [...state.webItems];
    const webData = new WebData(name, url, id || getUniqueId());

    if (id) {
      // Edit existing item
      const index = webItems.findIndex((item) => item.id === id);
      if (index > -1) webItems[index] = webData;
    } else {
      // Add new item
      webItems.push(webData);
    }

    StorageManager.upsertData(webData);
    handleGetData(); // Refresh data

    setState({ webItems, popupData: null, isPopupVisible: false });
  };

  // Handle deleting a web item
  const handleDelete = (id) => {
    const webItems = state.webItems.filter((item) => item.id !== id);
    StorageManager.deleteData(id);
    setState({ webItems, popupData: null, isPopupVisible: false });
  };

  // Handle editing a web item
  const handleEdit = (index) => {
    const popupData = state.webItems[index];
    setState({ ...state, popupData, isPopupVisible: true });
  };

  // Handle opening the popup
  const openPopup = () => {
    setState({ ...state, popupData: null, isPopupVisible: true });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bgColor,
    },
    itemsWrapper: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.txtColor,
    },
    items: {
      marginTop: 30,
      color: theme.colors.txtColor,
    },
    floatingButton: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
      zIndex: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.itemsWrapper}>
        <ScrollView style={styles.items}>
          {state.webItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onLongPress={() => handleEdit(index)}
              onPress={() => openWebApp(index)}
            >
              <WebItem text={item.name} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popup for adding/editing */}
      <InputPopup
        isVisible={state.isPopupVisible}
        onClose={() => setState({ ...state, isPopupVisible: false })}
        onSubmit={handleSubmit}
        webdata={state.popupData}
        onDelete={() => handleDelete(state.popupData?.id)}
      />

      {/* Floating button */}
      <FloatingButton
        icon={<Text style={styles.floatingButton}>+</Text>}
        onPress={openPopup}
      />
    </View>
  );
}

// import { useEffect, useState } from 'react';
// import {ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import StorageManager from '../services/StorageManager';
// import WebItem from './WebItem';
// import InputPopup from './InputPopup';
// import WebData from '../entity/WebData';
// import FloatingButton from '../utils/FloatingButton';
// import useTheme from '../utils/useTheme';

// export default function HomeScreen ({ navigation }) {

//   const getUniqueId = () => `${Math.random().toString(20).substr(2, 4)}`;

//     const [webDataItem,setWebDataItem] = useState([]);
//     const [webItems,setWebItems] = useState([]);

//     const theme = useTheme();
    
//     const openWebApp = (index) => {
//       console.log("Index val : " + webItems[index] ) ;
      
//       const webdata = webItems[index] ;
//       const currentUrl = webdata.url ; 
//       const currentName = webdata.name ; 
//       navigation.navigate('WebApp',{url : currentUrl,name:currentName})
//     }
    
//     const onAppOpen = () => {
//       console.log("Theme : " + theme.colors)    
//       console.log("Theme : " + theme.colors.bgColor)    
//       console.log("Theme : " + theme.colors.txtColor)    
//       console.log('App opened!');
//       handleGetData();
//     };
  
//     // useEffect with an empty dependency array will run once when the component is mounted (i.e., when the app is opened).
//     useEffect(() => {
//       onAppOpen();
//     }, []); // Empty dependency array ensures it only runs once
  
    
//     // Handle the store of data 
//     handleStoreData = (newData) => {
//       console.log('Array:', newData);
//       StorageManager.storeData(newData);
//     };

//     // Insert the store of data 
//     storeInsertInfo = (newData) => {
//       console.log('Calling insert for :', newData);
//       StorageManager.upsertData(newData);
//     };
//     // Edit the store of data 
//     storeEditInfo = (newData) => {
//       console.log('Calling edit for :', newData);
//       StorageManager.upsertData(newData);
//     };
  
    
//     handleGetData = () => {

//       let tempArr = [] 
//         StorageManager.getData( (dataItems) => { 
//           console.log("***************dataitems " , dataItems)
          
//           dataItems.map( (data,index) =>{
//             console.log("== All Information : " , data.name," " , data.url, "  " ,data.id)
//             // console.log("== All Information : " , data.name," " , data.url, "  " ,index)
//             // tempArr = tempArr.concat(new WebData(data.name,data.url,index))
//             tempArr = tempArr.concat(new WebData(data.name,data.url,data.id))
//             console.log("---temparr " , tempArr, "new webdata " , new WebData(data.name,data.url,data.id))
//           })
          
//           setWebItems(tempArr) ; 
//       }); 
//       console.log("++data got " , tempArr)
//     };

//     handleEdit = (index) => {
//       console.log("edit here");
//       const webdata = new WebData(webItems[index].name,webItems[index].url,webItems[index].id) ;
//       console.log("Web-Index : ",webdata)
      
//       setIsPopupVisible(true) 
//       setWebDataItem(webdata) 
//     };
    
//     handleDelete = (index) => {
//       if(index !== undefined){
//         console.log("Index for delete is " , index); 
//         StorageManager.deleteData(index);
//         // Will delete the item
//         newWebItems = webItems.filter(webItem => webItem.id !== index);
//         setWebItems(newWebItems); 
//         // handleStoreData(webItems);
//       }

//       setIsPopupVisible(false) 
//       setWebDataItem([]) 
//     };
  
//     const [isPopupVisible, setIsPopupVisible] = useState(false);

//     const handleSubmit = (formData) => {
//       // Handle form data here, e.g., pass it to another function or state
//       console.log("Form data : " , formData);
//       const webData = new WebData(formData.input1,formData.input2,formData.id) ; 
      
//       console.log("Web Items : " , webItems) ; 
//       let newItems = [] ; 
//       if(formData.id == undefined || formData.id == -1){
//         console.log("Unique id : " + getUniqueId() ) ; 
//         webData.id = getUniqueId() ; 
//         // For storing the new data 
//         newItems = [...webItems,webData] ; 
//         console.log("New item is added ",webData.id);
//       } else {
//         // Handling edit information
//         newItems = webItems.map(newWebdata => 
//           newWebdata.id === webData.id ? { ...newWebdata, url:webData.url , name:webData.name } : newWebdata 
//         );
        
//       }
//       console.log("Web Items 2 : " , newItems) ; 
//       setWebItems(newItems); 
  
      
//       if(formData.id == undefined || formData.id == -1){
//         // handleStoreData(newItems);
//         storeInsertInfo(webData);
//       }else{
//         storeEditInfo(newItems);
//       }
      
//       setIsPopupVisible(false);
      
//       setWebDataItem([]); 
//     };

//     const styles = StyleSheet.create({
//       container: {
//         flex: 1,
//         backgroundColor: theme.colors.bgColor
//       },
//       itemsWrapper: {
//         paddingHorizontal:20
//       },
//       sectionTitle:{
//         fontSize:24,
//         fontWeight:'bold',
//         color:theme.colors.txtColor
//       },
//       items:{
//         marginTop:30,
//         color:theme.colors.txtColor
//       },
//       writeTaskWrapper:{
//         position:'absolute',
//         width:'100%',
//         flexDirection:'row',
//         justifyContent:'space-around',
//         alignItems:'center',
//         bottom:0,
//         backgroundColor:theme.colors.bgColor,
//         color:theme.colors.txtColor,
//         opacity:1,
//         paddingVertical:12,
//         borderTopColor:'#28262C',
//         borderTopWidth:1
//       },
//       input:{
//         paddingVertical:15,
//         paddingHorizontal:15,
//         width:250,
//         backgroundColor:theme.colors.bgColor,
//         borderRadius:10,
//         borderColor:'#C0C0C0',
//         borderWidth:1,
//         color:theme.colors.txtColor
//       },
      
//     }) ;
    
    

//   return (

//     <View style={styles.container}>
//     <View style={styles.itemsWrapper}>
      
//       <ScrollView style={styles.items}>
//           {
//             webItems.map( (item,index) =>{
//               return (
//                 <TouchableOpacity key={index} onLongPress={() => handleEdit(index)} onPress={() => openWebApp(index)}>
//                   <WebItem text={item.name} id={index} />
//                 </TouchableOpacity>
//               ) 
//             })
//           }
//       </ScrollView>
//     </View>

//       <InputPopup
//         isVisible={isPopupVisible}
//         onClose={() => {setIsPopupVisible(false) ; setWebDataItem([]);} }
//         onSubmit={handleSubmit}
//         webdata={webDataItem}
//         onDelete={handleDelete}
//       />

//     <FloatingButton icon={<Text style={{color:'white',fontSize:45,fontStyle:'bold',zIndex:2}}>+</Text>} onPress={() => {console.log("Button pressed") ; setIsPopupVisible(true); console.log("Popup is set to visible") ; }} />

//   </View>
//     );}


