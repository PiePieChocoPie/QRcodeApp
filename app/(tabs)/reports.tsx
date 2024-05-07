import { Link, Stack } from 'expo-router';
import {Text, View, Button, TouchableOpacity,StyleSheet, ScrollView, Animated} from 'react-native';
import React, { useEffect, useState } from "react";
import { useFocusEffect} from '@react-navigation/native';
import Store from "src/stores/mobx";
import LottieView from 'lottie-react-native';
import anim from 'src/job_anim.json';
import {json_styles} from "src/stores/styles";
import { observer } from "mobx-react-lite"
import { getReports } from "src/http";
import ModalForm from "src/modals/newModal";

const DimmedOverlay = ({ visible }) => {
  const [opacity] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 0.5 : 0,
      duration: 300, 
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, styles.overlay, { opacity }]}
    />
  );
};


const home = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

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
    const selectedReport = reports[reportKey]; 
    setSelectedReport(selectedReport);
    toggleModal(); 
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setIsOverlayVisible(!isOverlayVisible); // Toggle overlay visibility
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
      <ModalForm modalVisible={modalVisible} toggleModal={toggleModal} reportName={selectedReport} />
      <DimmedOverlay visible={isOverlayVisible} />
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
  overlay: {
    backgroundColor: 'black',
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