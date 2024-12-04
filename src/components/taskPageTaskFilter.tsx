import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { projColors } from "src/stores/styles";

type FilterType = 'all' | 'overdue' | 'today' | 'thisWeek' | 'nextWeek' | 'withoutDeadline' | 'moreThanTwoWeek';

type TaskFilterProps = {
  activeFilter: FilterType;
  onFilterChange: (newFilter: FilterType) => void;
}

const TaskPageTaskFilter: React.FC<TaskFilterProps> = ({ activeFilter, onFilterChange }) => {
  // Массив фильтров
  const filters = [
    { label: 'Все', value: 'all' },
    { label: 'Просроченные', value: 'overdue' },
    { label: 'Сегодня', value: 'today' },
    { label: 'Эта неделя', value: 'thisWeek' },
    { label: 'Следующая неделя', value: 'nextWeek' },
    { label: 'Без срока', value: 'withoutDeadline' },
    { label: 'Через 2 недели', value: 'moreThanTwoWeek' },
  ];

  return (
    <View style={styles.filters}>
      <FlatList 
      data={filters}
      keyExtractor= {item => item.value}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.filterButton,
            activeFilter === item.value && styles.activeFilterButton
          ]}
          onPress={() => onFilterChange(item.value as FilterType)}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === item.value && styles.activeFilterText
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: projColors.currentVerse.listElementBackground,
    borderRadius: 16,
    marginLeft:8
  },
  activeFilterButton: {
    backgroundColor: projColors.currentVerse.redro,
  },
  filterText: {
    color: projColors.currentVerse.font,
    fontFamily:"BoldFont"
  },
  activeFilterText: {
    color: projColors.currentVerse.main,
    fontFamily:"BaseFont"
  },
});

export default TaskPageTaskFilter;
