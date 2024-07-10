import { StyleSheet, Dimensions } from 'react-native';

export class projColors {
    static lightVerse = {
        main: "#EBEBEB",
        extrasecond: "#F7F8F9",
        extra: "#535D69",
        accent: "#d1ded3",
        font: '#8391A1',
        fontAccent: "#535D69",
        border: "#E8ECF4",
        listElementBackground:'#F7F8F9',
        redro: '#DE283B'
    };

    static darkVerse = {
        main: "#292929",
        extrasecond: "#F7F8F9",
        second: "#292929",
        extra: "#535D69",
        accent: "#F7F8F9",
        font: "#8391A1",
        fontAccent: "#8FA0B5",
        border: "#E8ECF4",
        listElementBackground:'#E8ECF4'
    };

    static currentVerse = projColors.lightVerse
}

export const json_styles = StyleSheet.create({
  header_right_activity:{
    width: 50, 
    height: 50, 
    flex: 1, 
    flexDirection:'row', 
    justifyContent: 'flex-end'
  }
});

export const styles = StyleSheet.create({
  moreItemsButton: {
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  moreItemsText: {
    color: '#333',
  },
  link: {
    fontSize: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  searchInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20 ,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalContentContainer: {
    flex: 1,
  },
  container2: {
    padding: 20,
  },
  itemContainer2: {
    marginVertical: 5,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 14,
    paddingLeft: 20,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedItemsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0', 
    borderRadius: 5,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedItem: {
    flex: 1, // Flexbox для занятости доступного пространства
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    maxWidth: '70%',
    flexWrap: 'wrap',
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
    width: '80%',
    alignItems: 'center',
  },
  calendarModalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
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
  dateField: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8, 
  },
  filterContainer: {
    marginTop: 10,
    borderRadius: 5,
    flex: 1,
  },
  parameterContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flex: 1,
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
    marginTop: Dimensions.get("window").height / 6,
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
    backgroundColor: projColors.currentVerse.main,
  },
  cameraContainer: {
    flex: 0,
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: "middle",                 
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  absoluteFill: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayWithUser: {
    alignItems: "center",
  },
  horizontalBorders: {
    flex: 1,
    flexDirection: 'row',
  },
  infoButtonContainer: {
    flex: 1,
    margin: 0,
    flexDirection: 'row',
    justifyContent: "center",
    gap: 150,
  },
  opacities: {
    alignItems: "center",
    margin: 15,
  },
  btnopacities: {
    width: '20%',
    alignItems: "center",
    alignContent: 'center',
    margin: 15,
    borderColor: projColors.currentVerse.font,
    overflow: 'hidden',
    borderRadius: 15,
  },
  userB: {
    margin: 10,
    flexDirection: "row",
    alignContent: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainFrame: {
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60,
  },
  itemContainer: {
    width: Dimensions.get("window").width - 3,
    borderRadius: 5,
    backgroundColor: projColors.currentVerse.extra,
    flexDirection: "row",
    borderWidth: 2,
    overflow: 'hidden',
    borderColor: projColors.currentVerse.main,
  },
  moreButton: {
    borderRadius: 50,
    backgroundColor: projColors.currentVerse.accent,
    alignItems: "center",
    margin: 4,
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
    textAlign: "center",
  },
  taskInternalView: {
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 3,
    borderColor: projColors.currentVerse.border,
    backgroundColor: projColors.currentVerse.main,
    flex: 1,
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
    textAlign: "center",
  },
  button: {
    backgroundColor: "#de283b",
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '5%',
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  containerCentrallity: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerCentrallityFromUpper: {
    flex: 1,
    width: '80%',
  },
  listElementContainer: {
    backgroundColor: projColors.currentVerse.extrasecond,
    borderColor: projColors.currentVerse.border,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    gap: 5,
    padding: 23,
    elevation: 2,
  },
  Title: {
    fontSize: 16,
    color: projColors.currentVerse.fontAccent,
  },
  Text: {
    fontSize: 16,
    color: projColors.currentVerse.fontAccent,
  },
  expanderContainer: {
    top: 0,
    width: '100%',
    backgroundColor: projColors.currentVerse.main,
  },
  expanderContent: {
    backgroundColor: projColors.currentVerse.main,
    padding: 10,
  },
  containerContent: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: '80%',
  },
});
