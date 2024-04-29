import { Link, Stack } from 'expo-router';
import {Text, View, Button, TouchableOpacity,StyleSheet, ScrollView} from 'react-native';
import React, { useEffect, useState } from "react";
import { useFocusEffect} from '@react-navigation/native';
import Store from "src/stores/mobx";
import LottieView from 'lottie-react-native';
import anim from 'src/job_anim.json';
import {json_styles} from "src/stores/styles";
import { observer } from "mobx-react-lite"
import { getReports } from "src/http";

const home =() =>{
    const [reports, setReports] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getReports();
          setReports(response.data);
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const onPressReport = (reportKey) => {
      console.log('Pressed report:', reportKey);
    };
  
    return (
        <ScrollView contentContainerStyle={styles.container}>
          {Object.keys(reports).map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.tile, styles.shadow]} 
              onPress={() => onPressReport(key)}
            >
              <Text style={styles.tileText}>{reports[key].name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
  };
  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      },
    tile: {
      width: '45%',
      height: 150,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    tileText: {
      fontSize: 16,
    },
    shadow: {
      elevation: 5, 
    },
  });

export default home;