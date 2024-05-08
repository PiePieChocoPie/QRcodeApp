import React, {useState} from "react";
import {Modal, View,  Text, TouchableOpacity, Dimensions, Alert, ActivityIndicator} from 'react-native';
import {RadioButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { getAllStaticData, updItineraryStatus, updUpdStatus } from "src/http";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import CustomModal from "src/components/custom-modal";
import Toast from 'react-native-root-toast';


const ChooseStateDialog = ({visible, onClose, docData, docNumber}) => {
    const [checked, setChecked] = useState({label:'', value:''});
    const [updStatuses] = React.useState(Store.updStatusesData);
    const [itineraryStatuses] = React.useState(Store.itineraryStatusesData);
    const {loading, startLoading, stopLoading} = useLoading()



    const getNextStatus = () =>{
        const curStatus = docData.stageId;
        const newSt='Изменение статуса документа невозможно';
        if (docNumber==1){
            for(let i=0;i<updStatuses.length;i++){
                if(updStatuses[i].STATUS_ID ==curStatus&&i!=updStatuses.length-2)
                return updStatuses[i+1];
            }
        }
        else if(docNumber==2)
        for(let i=0;i<itineraryStatuses.length;i++){
            if(itineraryStatuses[i].STATUS_ID ==curStatus&&i!=itineraryStatuses.length-2)
                return itineraryStatuses[i+1];

        }
        return newSt;
    }

    const itineraryHandling = async() =>{
        try {
            let setableStatus;
            let alertMes=''
            if ((docData.stageId == itineraryStatuses[0].STATUS_ID || docData.stageId == itineraryStatuses[1].STATUS_ID) && Store.userData.ID == docData.ufCrm6Driver) {
                    setableStatus = getNextStatus();
                await updItineraryStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID)
                    .then()
                alertMes=`Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
            } else alertMes="На данном этапе взаимодействие с документом невозможно";
            let toast = Toast.show(alertMes, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,

            });
            
            setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 15000);
        }
        catch (e){
            alert(e)
        }
    }

    const updHandling = async() =>{
        let setableStatus;
        let alertMes = '';
        console.log(updStatuses[1].STATUS_ID)
        if (docData.stageId == updStatuses[0].STATUS_ID||docData.stageId == updStatuses[1].STATUS_ID) {
                setableStatus = getNextStatus();
            await updUpdStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID)
                .then()
                alertMes=`Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
            } else alertMes="На данном этапе взаимодействие с документом невозможно";
            let toast = Toast.show(alertMes, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });
            
            setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 15000);
    }
    const acceptAxios = async () => {
    try {
        if(docData.entityTypeId =="168") await updHandling();
        else if(docData.entityTypeId == "133") await itineraryHandling();
        else alert("Неверный формат обрабатываемого документа")
    } catch(e){
        alert(e)
    }
        onClose();
    };



    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            content= {
                loading ?(
                    <View style={styles.containerCentrallity}>
                        <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                    </View> 
                ):
                   
                (
                    <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.textProfile}>обновление статуса документа</Text>
                            <Text style={styles.selectDateText}>{docData.title}</Text>
                            <Text style={styles.textProfile}>установить статус -</Text>
                            <Text style={styles.selectDateText}> {getNextStatus().NAME}</Text>                            
                    <View style={styles.RBView}>
        
                    </View>
                        <View style={styles.containerCentrallityFromUpper}>
                            <View style={{flexDirection:'row'}}>
                                <View style={{backgroundColor:'#d2ff41', margin:'10%',width:'30%', alignContent:"center",alignItems:"center", borderRadius:20}}>
                                    <TouchableOpacity onPress={acceptAxios}>
                                            <Text style={{fontSize: 20,  fontWeight: 'bold',margin:15,color:'#008000'}}>ок</Text>                               
                                            
                                    </TouchableOpacity>
                                </View>
                                <View style={{backgroundColor:'#db6464', margin:'10%',width:'30%', alignContent:"center", alignItems:"center", borderRadius:20}}>
                                    <TouchableOpacity onPress={onClose} >
                                        <Text style={{fontSize: 20,  fontWeight: 'bold', margin:15, color:'#a20808'}}>отмена</Text>                            

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
        />

    );
};
export default ChooseStateDialog;
