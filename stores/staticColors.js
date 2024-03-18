import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDataDialog from "../Modals/UserDataDialog";

const projColors = () => {
    const
    lightVerse = JSON.stringify({
        main: "#eee",
        second: "#fff",
        extra: "#ddd",
        accent: "#d1ded3",
        font: "#111"
    })

    const
    darkVerse = JSON.stringify({
        main: "#eee",
        second: "#fff",
        extra: "#ddd",
        accent: "#d1ded3",
        font: "#111"
    })

    const
    switchVerse = (curVerse) => {
        if (curVerse === "darkVerse")
            return darkVerse;
        else return lightVerse;
    }
}
export default projColors;