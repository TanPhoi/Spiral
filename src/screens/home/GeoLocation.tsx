import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputSearch from '@/common/inputs/InputSearch'
import axios from 'axios'

const GeoLocation = (): JSX.Element => {
    const [inputLocation, setInputLocation] = useState<string>('')
    const [location, setLocation] = useState({})

    const handleChangeSearch = async () => {
        const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${location}&limit=10&apiKey=5fmlm7ZN9emHVpXbXE1RhkyeDncI9yAEjnuoU2JuVAA`
        try {
            const res = await axios.get(api)
            setLocation(res)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView>
            <View style={styles.input}>
                <InputSearch
                    value={inputLocation}
                    onChangeText={setInputLocation}
                    placeholder={'Search location...'}
                    onEnd={handleChangeSearch} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginHorizontal: 16,
    },
})

export default GeoLocation
