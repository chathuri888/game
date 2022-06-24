import React, { useContext } from "react";
import { StyleSheet, Pressable } from "react-native";
import { useSelector } from 'react-redux';
import ThemeContext from "../common/ThemeContext";

import AppText from "../components/AppText";
import { KeyValuePairs } from "../constants/modal";
import { sizes } from "../constants/theme";
import AppModal from './../components/AppModel';
import Button from './../components/Button'

function Completed({ resetData }: Props) {
  const { theme } = useContext(ThemeContext);
  const { noOfTurns, bestScore } = useSelector(state => state.count);

  return (
    <AppModal isModalVisible={true} onRequestClose height={150} width={300}>
      <AppText style={styles(theme).modalText}>Congrats level completed</AppText>
      <AppText style={styles(theme).scores}>No of turns: {noOfTurns}</AppText>
      <AppText style={styles(theme).scores}>Best Score: {bestScore}</AppText>
      <Button
        styles={[styles(theme).button]}
        onPress={() => resetData()}
        children="RESTART" />
    </AppModal>
  )
}

const styles = (theme?: KeyValuePairs) => StyleSheet.create({
  modalText: {
    alignItems: 'center',
    fontSize: sizes.title,
    marginBottom: 10
  },
  scores: {
    fontSize: sizes.body
  },
  button: {
    backgroundColor: theme?.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 10
  },
  buttonText: {
    color: theme?.white
  }
});

interface Props {
  resetData: Function,
  noOfTurns: number,
  bestScore: number
}
export default Completed;