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
    //     console.log(projColors.currentVerse.main, isDark);
    //
    // }
}

export const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fieldsContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderColor: projColors.currentVerse.second,
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
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  overlayWithUser: {
    alignItems: "flex-end",
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
    alignItems: "center"
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
  RBView: {
    alignItems: "center",
    justifyContent: "center",
  },
});