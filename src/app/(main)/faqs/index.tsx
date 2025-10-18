import faqsApi, { FAQ, Question } from "@/api/FAQsApi";
import { Loader, Modal, Screen, Text } from "@/components/core";
import Accordion from "@/components/core/Accordion";
import Card from "@/components/core/Card";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { QueryBuilder } from "@/types/DataTypes";
import Analytics from "@/utils/Analytics";
import { Link, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const FAQScreen = () => {
  const [faqs, setFaqs] = useState<FAQ[]>();
  const [selectedFaq, setSelectedFaq] = useState<FAQ | undefined>();
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      const query = QueryBuilder.from({
        orderBy: [
          { field: "order", direction: "asc" },
          { field: "groupName", direction: "asc" },
        ],
      });
      const response = await faqsApi.getAll(query);
      if (response) {
        setFaqs(response);
      }
    };
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <Card
      style={styles.card}
      onPress={() => {
        setSelectedFaq(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.groupText}>{item.groupName}</Text>
    </Card>
  );

  const renderQuestionItem = ({ item }: { item: Question }) => {
    const handlePress = () => {
      Analytics.logSelectContent(item.question, "faq");
    };
    return (
      <Accordion
        onPress={handlePress}
        style={styles.qCard}
        title={item.question}
        titleStyle={styles.qTitle}
      >
        <View style={styles.answerContainer}>
          <Text>{item.answer.replace(/\\n/g, "\n")}</Text>
          {item?.links && (
            <View style={styles.linksContainer}>
              {item.links.map((l: any, index: number) => (
                <Link
                  style={[sharedStyles.link, styles.link]}
                  key={index}
                  to={l.url}
                >
                  {l.label}
                </Link>
              ))}
            </View>
          )}
        </View>
      </Accordion>
    );
  };
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const separator = () => <View style={styles.separator} />;

  return faqs ? (
    <Screen>
      <FlatList
        data={faqs}
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
      />

      <Modal
        isVisible={isModalVisible}
        title={selectedFaq?.groupName + " FAQs"}
        onClose={closeModal}
        position={"full"}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        showHeaderNav
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedFaq?.questions}
          renderItem={renderQuestionItem}
          ItemSeparatorComponent={separator}
        />
      </Modal>
    </Screen>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  card: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  qCard: {
    // paddingVertical: 10,
    paddingVertical: 10,
  },
  datalist: { flex: 1 },
  answerText: {
    ...theme.styles.scale.h6,
  },
  answerModal: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  linksContainer: {
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 10,
  },
  link: {
    textDecorationLine: "underline",
    marginVertical: 2,
  },
  groupText: {
    fontWeight: "bold",
  },
  qTitle: {
    // fontWeight: 'normal',
    textAlign: "justify",
  },
  qBody: {
    marginVertical: 10,
  },
  answerContainer: {
    paddingVertical: 10,
  },
});

export default FAQScreen;
