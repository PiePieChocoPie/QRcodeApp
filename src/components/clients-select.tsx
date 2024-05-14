import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { getHierarchy } from 'src/http';

const ClientSelect = () => {
  const [expanded, setExpanded] = useState(false);
  const [hierarchyData, setHierarchyData] = useState({});

  const handlePress = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHierarchy();
        setHierarchyData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (expanded) {
      fetchData();
    }
  }, [expanded]);

  const flattenHierarchyData = (data) => {
    const flatData = [];
    for (const key in data) {
      flatData.push({ key, children: data[key] });
    }
    return flatData;
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Text>Click me to expand</Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={flattenHierarchyData(hierarchyData)}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text>{item.key}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      )}
    </View>
  );
};

export default ClientSelect;