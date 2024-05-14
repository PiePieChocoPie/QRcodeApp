import { StyleSheet, Dimensions } from 'react-native';

export class projColors{

    static lightVerse = {
        main: "#eee",
        second: "#fff",
        extra: "#ddd",
        accent: "#d1ded3",
        font: "#111",
        fontAccent: "#111",
        border: "#aaa"
    };


    static darkVerse = {
        main: "#777",
        second: "#444",
        extra: "#8b8a8a",
        accent: "#575f58",
        font: "#aaa",
        fontAccent: "#fff",
        border: "#aaa"
    };

    static currentVerse = projColors.lightVerse

    // static switchVerse() {
    //     isDark=!isDark;
    //     projColors.currentVerse = isDark? projColors.darkVerse : projColors.lightVerse;
    //     //console.log(projColors.currentVerse.main, isDark);
    //
    // }
}
export const json_styles = StyleSheet.create({
  header_right_activity:{
    width: 50, 
    height: 50, 
    flex: 1, 
    flexDirection:'row', 
    justifyContent: 'flex-end'
  }

}
)

export const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', 
},
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20 ,
    

},
modalContentContainer:{
  flex:1,
},
dateButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#7300e6',
  borderRadius: 5,
},
modalContent: {
  backgroundColor: '#FFF',
  padding: 20,
  borderRadius: 10,
  width: '80%', // Ширина модального окна
  alignItems: 'center',
},
calendarModalContent: {
  backgroundColor: '#FFF',
  padding: 20,
  borderRadius: 10,
  width: '80%', // Ширина модального окна
  alignItems: 'center',
},
dateButtonText: {
  color: '#FFF',
  fontWeight: 'bold',
},
confirmButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#7300e6',
  borderRadius: 5,
},
confirmButtonText: {
  color: '#FFF',
  fontWeight: 'bold',
},
closeButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#888',
  borderRadius: 5,
},
closeButtonText: {
  color: '#FFF',
  fontWeight: 'bold',
},
selectDateText: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
},
dateField: {
  alignItems: 'center',
  // borderWidth: 1, 
  // borderColor: '#888',
  // borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 8, 
},
selectedDateText: {
  color: '#000', 
  fontSize: 16, 
},
placeholderText: {
  color: '#888', 
  fontSize: 16, 
},
filterContainer: {
  marginTop: 10,
  borderRadius: 5,
  marginBottom:80
},
parameterContainer: {
  marginTop: 10,
  padding: 10,
  borderRadius: 5,

  
},
datePickerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
datePicker: {
  width: '45%',
  marginBottom: 10,
},
textInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
},
  authContainer: {
    flex: 1,
    backgroundColor: projColors.currentVerse.main,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fieldsContainer: {
    flex: 1,
    backgroundColor: projColors.currentVerse.main,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Dimensions.get("window").height / 6
  },
  input: {
    marginTop: 20,
    width: 300,
    height: 50,
    borderStyle: 'solid',
    borderTopColor: 'red',
    borderTopWidth: 2,
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    backgroundColor: projColors.currentVerse.main
  },
  cameraContainer: {
    flex: 0,
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign:"middle",                 
    overflow: 'hidden',
  },
  cameraBorder: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 5,
    borderColor: projColors.currentVerse.second,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black color
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,

  },
  absoluteFill : {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  overlayWithUser: {
    alignItems: "center",
  },
  horizontalBorders: {

    flexDirection: 'row'
  },
  infoButtonContainer: {
    flex: 1,
    margin: 0,
    flexDirection: 'row',
    justifyContent: "center",
    gap: 150,
  },
  text: {
    color: projColors.currentVerse.font,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  textProfile: {
    color: projColors.currentVerse.font,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize:18
  },
  noValueText: {
    color: projColors.currentVerse.font,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20
  },
  internalTextRowView: {
    color: projColors.currentVerse.font,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center"
  },
  descriptionText: {
    color: projColors.currentVerse.font,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  opacities: {
    alignItems: "center",
    margin: 15,
  },
  btnopacities: {
    width:'20%',
    alignItems: "center",
    alignContent: 'center',
    margin: 15,
    borderColor: projColors.currentVerse.font,
    overflow:'hidden',
    borderRadius:15,
    // borderWidth:2
  },
  userB: {
    margin: 10,
    flexDirection: "row",
    alignContent: "center"
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 15,
    alignItems: "center",
    justifyContent:"center"
  },
  avatar: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainFrame: {
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60
  },
  itemContainer: {
    width: Dimensions.get("window").width - 3,
    borderRadius: 5,
    backgroundColor: projColors.currentVerse.extra,
    flexDirection: "row",
    borderWidth: 2,
    overflow: 'hidden',
    borderColor: projColors.currentVerse.main
  },
  moreButton: {
    borderRadius: 50,
    backgroundColor: projColors.currentVerse.accent,
    alignItems: "center",
    margin: 4
  },
  taskView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: projColors.currentVerse.extra,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: projColors.currentVerse.border,
    width: Dimensions.get("window").width - 8,
    overflow: 'hidden',
    marginTop: 5,
    textAlign: "center"
  },
  taskInternalView: {
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 3,
    borderColor: projColors.currentVerse.border,
    backgroundColor: projColors.currentVerse.main,
    flex: 1
  },
  dialog: {
    backgroundColor: projColors.currentVerse.second,
    padding: 20,
    borderRadius: 10,
    borderColor: projColors.currentVerse.main,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  buttonVertContainer: {
    justifyContent: 'space-between',
    gap: 40,
  },
  RBView: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  containerCentrallity:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerCentrallityFromUpper:{
    flex: 1,
    alignItems: "center",
    justifyContent: 'flex-start',
  },
});