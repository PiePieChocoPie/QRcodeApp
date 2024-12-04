import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
} from "react-native";
import CustomModal from "src/components/custom-modal";
import CustomText from "src/components/customText";
import { projColors } from "src/stores/styles";

// Typings for TaskItem Props
interface TaskItemProps {
  item: {
    id: string;
    title: string;
    createdDate: string;
    deadline?: string;
    creator: {
      name: string;
    };
    description?: string;
  };
}

// Typings for `renderDescription`
interface RenderDescriptionPart {
  key: string;
  content: JSX.Element;
}

const TaskItem: React.FC<TaskItemProps> = ({ item }) => {
  const [depDate, setDepDate] = useState<string>("");
  const [depDLDate, setDepDLDate] = useState<string>("не установлен");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const onlyDate = item.createdDate.split("T")[0];
    setDepDate(onlyDate);

    const onlyDLDate = item.deadline
      ? item.deadline.split("T")[0]
      : "не установлен";
    setDepDLDate(onlyDLDate);
  }, [item]);

  const toggleMore = () => {
    setModalVisible(!modalVisible);
    console.log(item);
  };

  const renderDescription = (description: string): JSX.Element[] => {
    const target = "[URL=";
    let match = -1;
    let linkEnd = 0;

    if (description.indexOf(target) === -1) {
      return [<Text key="description">{description}</Text>];
    }

    const parts: RenderDescriptionPart[] = [];
    while ((match = description.indexOf(target, match + 1)) !== -1) {
      if (match > linkEnd) {
        const preLink = description.slice(linkEnd, match);
        parts.push({
          key: `text-${match}`,
          content: <Text key={`text-${match}`}>{preLink}</Text>,
        });
      }
      linkEnd = description.indexOf("]", match);
      const link = description.slice(match + 5, linkEnd);
      parts.push({
        key: `link-${match}`,
        content: (
          <Text
            key={`link-${match}`}
            style={styles.link}
            onPress={() => openURL(link)}
          >
            {link}
          </Text>
        ),
      });
      linkEnd = description.indexOf("[/URL]", linkEnd) + 6;
    }

    if (linkEnd < description.length) {
      parts.push({
        key: `text-final`,
        content: (
          <Text key={`text-final`}>
            {description.slice(linkEnd, description.length)}
          </Text>
        ),
      });
    }

    return parts.map((part) => part.content);
  };

  const openURL = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error("Failed to open URL:", err);
      });
    }
  };

  // Helper function to determine deadline color
  const getDeadlineColor = (): string => {
    if (!item.deadline) return projColors.currentVerse.font;

    const deadlineDate = new Date(item.deadline);
    const today = new Date();

    if (deadlineDate < today) {
      return projColors.currentVerse.redro; // Overdue
    } else if (deadlineDate.toDateString() === today.toDateString()) {
      return projColors.currentVerse.yellow; // Due today
    } else {
      return projColors.currentVerse.green; // Upcoming
    }
  };

  return (
    <TouchableOpacity onPress={toggleMore}>
      <View style={styles.listElementContainer}>
        <CustomText type="normal" size={20} textAlign="left">
          {item.title}
        </CustomText>
        <CustomText type="description" textAlign="left">
          постановщик: {item.creator.name}
        </CustomText>
        <CustomText type="description" textAlign="left">
          дата постановки: {depDate}
        </CustomText>
        {item.deadline ? (
          <CustomText
            type="description"
            textAlign="left"
            color={getDeadlineColor()}
          >
            дедлайн: {depDLDate}
          </CustomText>
        ) : (
          <CustomText type="description" textAlign="left">
            дедлайн: не установлен
          </CustomText>
        )}
        <CustomModal
          visible={modalVisible}
          onClose={toggleMore}
          title={item.title}
          marginTOP={0.2}
          content={
            <View style={styles.containerCentrallityFromUpper}>
              <ScrollView style={styles.container}>
                <Text style={styles.Text}></Text>
                <Text style={styles.Text}>постановщик: {item.creator.name}</Text>
                <Text style={styles.Text}></Text>
                <Text style={styles.Text}>дата постановки: {depDate}</Text>
                <Text style={styles.Text}></Text>
                {item.deadline ? (
                  <Text style={[styles.Text, { color: "#DE283B" }]}>
                    дедлайн: {depDLDate}
                  </Text>
                ) : (
                  <Text style={styles.Text}>дедлайн: не установлен</Text>
                )}
                <Text style={styles.Text}></Text>
                {item.description ? (
                  <Text style={styles.Text}>
                    {renderDescription(item.description)}
                  </Text>
                ) : (
                  <Text style={styles.Text}>
                    Дополнительная информация отсутствует
                  </Text>
                )}
              </ScrollView>
            </View>
          }
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listElementContainer: {
    borderColor: projColors.currentVerse.fontAlter,
    borderBottomWidth: 1,
    margin: 10,
    gap: 5,
    padding: 23,
  },
  Text: {
    fontSize: 16,
    color: projColors.currentVerse.fontAlter,
    marginVertical: 1,
    fontFamily: "boldFont",
  },
  link: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: "boldFont",
  },
  containerCentrallityFromUpper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});

export default TaskItem;
