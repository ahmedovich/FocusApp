import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Platform, Button, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import { wedding } from './src/components/Pictures/wedding.jpg'
import { uuidv4 } from './src/utils/uuid';
import { Zen } from './src/features/Zen/Zen';
import { ZenHistory } from './src/features/Zen/ZenHistory';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

export default function App() {
  const [zenSubject, setZenSubject] = useState(null);
  const [zenHistory, setZenHistory] = useState([]);

  const addZenHistorySubjectWithStatus = (subject, status) => {
    setZenHistory([...zenHistory, { key: String(zenHistory.length + 1), subject, status }]);
  };

  const onClear = () => {
    setZenHistory([]);
  };

  const saveZenHistory = async () => {
    try {
      await AsyncStorage.setItem('zenHistory', JSON.stringify(zenHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadZenHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('zenHistory');
      if (history && JSON.parse(history).length) {
        setZenHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadZenHistory();
  }, []);

  useEffect(() => {
    saveZenHistory();
  }, [zenHistory]);

  return (
    <ImageBackground
      source={require('./src/components/Pictures/wedding.jpg')}
      style={styles.container}>
      {zenSubject ? (
        <Timer
          subject={zenSubject}
          clearSubject={() => {
            setZenSubject([
              ...zenHistory,
              { subject: zenSubject, status: 0, key: uuidv4() },
            ]);
            setFocusSubject(null);
          }}
          onTimerEnd={() => {
            setZenSubject([
              ...focusHistory,
              { subject: zenSubject, status: 1, key: uuidv4() },
            ]);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Zen addSubject={setZenSubject} />
          <ZenHistory zenHistory={zenHistory} onClear={onClear} />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: null,
    width: null,
    opacity: 0.85,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
  },
});
