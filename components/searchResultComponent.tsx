import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const SearchResultComponent = ({ id, photo, name, content, query }: any) => {
  const navigation: any = useNavigation();

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return <Text style={styles.mainText}>{text}</Text>;

    const regex = new RegExp(`(${highlight})`, 'i');
    const match = text.match(regex);

    if (!match) {
      return <Text style={styles.mainText}>{text}</Text>;
    }

    const matchIndex = match.index || 0;
    const start = Math.max(0, matchIndex - 25);
    const end = Math.min(text.length, matchIndex + highlight.length + 25);

    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    const parts = snippet.split(new RegExp(`(${highlight})`, 'gi'));

    return (
      <Text style={styles.mainText}>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ViewContact', {
          contact_id: id,
        })
      }
    >
      <View style={styles.mainContent}>
        <View style={styles.photoContainer}>
          {!photo ? (
            <Feather name="user" color="#fff" size={24} />
          ) : (
            <Image
              source={{ uri: photo }}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 20,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallText} numberOfLines={1}>
            {name}
          </Text>
          {getHighlightedText(content, query)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultComponent;

const styles = StyleSheet.create({
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40,
    flex: 1,
    gap: 10,
    marginBottom: 20,
    borderBottomColor: '#999',
    // borderBottomWidth: 1,
  },
  photoContainer: {
    backgroundColor: '#777',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  mainText: {
    color: '#fff',
    fontSize: 16,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  smallText: {
    color: '#cccccc',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },
  highlight: {
    backgroundColor: 'yellow',
    color: '#000',
  },
});
