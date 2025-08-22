import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropdownList from './DropdownList';

const HomeSection = ({ heading, data }: any) => {
  return (
    <View style={styles.reminderContainer}>
      <Text style={styles.headings}>{heading}</Text>
      <DropdownList title="Today" data={data?.today} expand={true} />
      <DropdownList title="Tomorrow" data={data?.tomorrow} />
      <DropdownList title="Upcoming" data={data?.upcoming} />
      <DropdownList title="Missed" data={data?.missed} />
    </View>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    backgroundColor: '#36413e',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    marginBottom: 20,
  },
  headings: {
    fontSize: 24,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 20,
  },
});

export default HomeSection;
