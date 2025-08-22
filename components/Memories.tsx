import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropdownList from './DropdownList';

const Memories = ({ heading, data }: any) => {
  return (
    <View style={styles.reminderContainer}>
      <Text style={styles.headings}>{heading}</Text>
      <DropdownList title="One Year Ago" data={data?.year} expand={true} />
      <DropdownList title="Six Months Ago" data={data?.six_month} />
      <DropdownList title="One Month Ago" data={data?.one_month} />
    </View>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    backgroundColor: '#36413e',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
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

export default Memories;
