import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDataDialog from "../Modals/UserDataDialog";

// let isDark = false;
class projColors{

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
export default projColors;