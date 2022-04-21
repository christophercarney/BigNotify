
import React from 'react'
import { StyleSheet, View } from 'react-native'


export const Separator = () => (
    <View style={styles.separator} />
);

export const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        marginVertical: 8,
    },
    info: {
        textAlign: 'left',
        marginVertical: 10,
        marginHorizontal: 10
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listitem: {

        padding: 8,
        fontSize: 15,
        height: 28,
        backgroundColor: '#ADD8E6'
      },
});