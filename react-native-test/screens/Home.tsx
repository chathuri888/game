import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Switch } from "react-native";

import { useDispatch, useSelector } from 'react-redux';

import { shuffleArray } from "../common/functions";
import ThemeContext from "../common/ThemeContext";

import AppScreen from "../components/AppScreen";
import AppText from "../components/AppText";
import { LEVELS } from "../constants/strings";
import { colors, sizes } from "../constants/theme";
import { CardValues } from "../models/CardValues";
import Completed from "./Completed";
import StartGame from "./StartGame";

//redux
import { setNoOfTurns, setPairCount, setBestScore } from "../redux/actions";

function Home() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useContext(ThemeContext);
  const { noOfTurns, pairCount, bestScore } = useSelector(state => state.count);
  const [isLevelSelectionModelOpen, setIsLevelSelectionModelOpen] = useState<boolean>(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(theme === colors?.dark);
  const [cardValues, setCardValues] = useState<CardValues[]>([]);
  const [isExecutionPaused, setIsExecutionPaused] = useState<boolean>(false);
  const [letterCount, setLetterCount] = useState<number>(2);
  const [shouldRefreshGrid, setShouldRefreshGrid] = useState<boolean>(false);
  const [isAllMatchFound, setIsAllMatchFound] = useState<boolean>(false);



  const onLevelSelect = (selectedLevel: string) => {
    if (selectedLevel === LEVELS.BEGINNER) {
      setLetterCount(2);
    } else if (selectedLevel === LEVELS.MEDIUM) {
      setLetterCount(8);
    } else if (selectedLevel === LEVELS.HARD) {
      setLetterCount(16);
    }
    setShouldRefreshGrid(!shouldRefreshGrid)
    setIsLevelSelectionModelOpen(false);
  }
  let max = "..........".length;
  var newState = [];

  for (let i = ".".length; i <= (max * max); i++) {
    const numberStr = i.toString()
    newState.push(numberStr);

  }


  const resetData = () => {
    const shuffledStrings = shuffleArray([...newState.slice(0, letterCount), ...newState.slice(0, letterCount)])
    const mockCardObject: CardValues[] = shuffledStrings.map((value, index) => ({
      id: index,
      value: value,
      isVisible: false,
      isFound: false,
    }))
    setCardValues(mockCardObject)
    setIsAllMatchFound(false);
    dispatch(setNoOfTurns(0))
    dispatch(setPairCount(0))
  }

  useEffect(() => {
    resetData();
  }, [shouldRefreshGrid])

  useLayoutEffect(() => {
    dispatch(setBestScore(0));
  }, []);

  const checkIfAllMatchesAreFound = () => {
    const matchedCards = cardValues.filter((currentVal) => currentVal.isFound);
    dispatch(setPairCount(matchedCards.length / 2))
    if (matchedCards.length === cardValues.length) {
      setIsAllMatchFound(true);
      if (noOfTurns < bestScore || bestScore === 0) {
        dispatch(setBestScore(noOfTurns + 1));
      }
    }
  }

  const checkForMatchingCards = () => {
    const openCardsValues = cardValues.filter((currentVal) => currentVal.isVisible);
    if (openCardsValues.length === 2) {
      // setNoOfTurns(noOfTurns + 1);
      dispatch(setNoOfTurns(noOfTurns + 1))
      setIsExecutionPaused(true);
      setTimeout(() => {
        if (openCardsValues[0].value === openCardsValues[1].value) {
          cardValues[openCardsValues[0].id].isFound = true;
          cardValues[openCardsValues[1].id].isFound = true;
          checkIfAllMatchesAreFound();
        }
        cardValues[openCardsValues[0].id].isVisible = false;
        cardValues[openCardsValues[1].id].isVisible = false;
        setCardValues([...cardValues])
        setIsExecutionPaused(false);
      }, 1000);
    }
  }

  const onCardPress = (item: CardValues, index: number) => {
    if (!isExecutionPaused && !item.isFound) {
      cardValues[index].isVisible = true;
      setCardValues([...cardValues]);
      checkForMatchingCards();
    }
  }

  const setCardStyle = (item: CardValues) => {
    if (item.isFound) {
      return [styles(theme).card, styles(theme).completedCards];
    } else if (item.isVisible) {
      return [styles(theme).card, styles(theme).openCard];
    } else {
      return [styles(theme).card];
    }
  }

  const ScoreCard = () => (
    <View style={styles(theme).scoreCard}>
      <TouchableOpacity onPress={() => setIsLevelSelectionModelOpen(true)} >
        <AppText style={styles(theme).resetText}>Reset</AppText>
      </TouchableOpacity>
      <AppText style={styles(theme).scoreCardText}>
        score: {pairCount}
      </AppText>
      <AppText style={styles(theme).scoreCardText}>
        Turns: {noOfTurns}
      </AppText>
    </View>
  )

  const RenderCards = ({ item, index }: { item: CardValues, index: number }) => (
    <TouchableOpacity
      onPress={() => onCardPress(item, index)}
      style={setCardStyle(item)}
    >

      <AppText style={!item.isVisible ? styles(theme).cardTextClose : styles(theme).cardText}>
        {item.isVisible ? `${item.value}` : "?"}
      </AppText>

    </TouchableOpacity>
  );

  const changeTheme = () => {
    if (setTheme) {
      setIsDarkModeEnabled(!isDarkModeEnabled)
      setTheme(theme === colors?.dark ? colors?.light : colors?.dark)
    }
  }

  const RenderRadioButton = () => (
    <View style={styles(theme).radioButtonContainer}>
      <AppText style={styles(theme).radioButtonTitle}>Dark Mode</AppText>
      <Switch
        value={isDarkModeEnabled}
        thumbColor={theme.white}
        trackColor={{
          true: theme.primary
        }}
        onValueChange={changeTheme}
      />
    </View>
  )

  return (
    <AppScreen style={styles(theme).container}>
      {isLevelSelectionModelOpen && <StartGame onLevelSelect={onLevelSelect} />}
      {isAllMatchFound && <Completed resetData={resetData} noOfTurns={noOfTurns} bestScore={bestScore} />}
      <ScoreCard />
      <FlatList
        data={cardValues}
        keyExtractor={(item, index) => index.toString()}
        renderItem={RenderCards}
        showsVerticalScrollIndicator={false}
        numColumns={4}
      />
      <View style={styles(theme).bottomContainer}>
        <RenderRadioButton />

      </View>
    </AppScreen>
  )
}

const styles = (theme?: { [key: string]: string }) => StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    padding: sizes.padding,

  },
  scoreCardText: {
    fontWeight: '700',
    fontSize: sizes.title
  },
  card: {
    backgroundColor: theme?.primary,
    margin: 10,
    width: '20%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes.radius,
    borderWidth: 4,
    borderColor: theme?.white
  },
  cardText: {
    color: theme?.black,
    fontWeight: '700',
    fontSize: sizes.h1
  },
  cardTextClose: {
    color: theme?.white,
    fontWeight: '700',
    fontSize: sizes.h1
  },
  completedCards: {
    backgroundColor: theme?.disabledPrimary
  },
  openCard: {
    backgroundColor: theme?.white
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
  },

  resetText: {
    color: theme?.white
  },
  radioButtonContainer: {
    flexDirection: 'row'
  },
  radioButtonTitle: {
    marginTop: 15
  }
});
export default Home;