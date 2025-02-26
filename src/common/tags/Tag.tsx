import { StyleSheet, Text, View } from 'react-native'
import React, { JSX } from 'react'
import { typography } from '@/themes/typography'

type TagProps = {
    label: string;
    statusColor: string;
    color: string;
    background: string;
}

const Tag = ({ label, statusColor, color, background }: TagProps): JSX.Element => {
    return (
        <View style={[styles.tag, { backgroundColor: background }]}>
            {statusColor !== '' && <View style={[styles.dot, { backgroundColor: statusColor }]}></View>}
            <Text style={[styles.label, { color: color }]}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tag: {
        height: 28,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        borderRadius: 15,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        marginRight: 8,
    },
    label: {
        ...typography.small,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
})

export default Tag
