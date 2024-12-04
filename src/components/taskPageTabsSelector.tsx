import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { projColors } from 'src/stores/styles';
import useFonts from 'src/useFonts';

interface TaskPageTabSelectorProps {
  activeTab: 'tasks' | 'attorney' | 'routes';
  onTabChange: (newTab: 'tasks' | 'attorney' | 'routes') => void;
}

const TaskPageTabSelector: React.FC<TaskPageTabSelectorProps> = ({ activeTab, onTabChange }) => {
  const fontLoaded = useFonts();

  if (!fontLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Вкладки */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => onTabChange('tasks')}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>Задачи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'attorney' && styles.activeTab]}
          onPress={() => onTabChange('attorney')}
        >
          <Text style={[styles.tabText, activeTab === 'attorney' && styles.activeTabText]}>Доверенности</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => onTabChange('routes')}
        >
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText]}>Маршрутные листы</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: projColors.currentVerse.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: projColors.currentVerse.redro,
  },
  tabText: {
    fontSize: 15,
    color: projColors.currentVerse.fontAlter,
    textAlign: 'center',
  },
  activeTabText: {
    fontSize: 15,
    color: projColors.currentVerse.redro,
    textAlign: 'center',
  },
});

export default TaskPageTabSelector;
