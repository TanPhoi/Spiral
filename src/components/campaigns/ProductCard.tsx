import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'

type ProductCardProps = {
    product: any
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <>
            <TouchableOpacity
                style={[styles.container]}>
                <View style={styles.imgContainer}>
                    <Image style={styles.image} source={{
                        uri: product.item.node.featuredImage.url,
                    }} />
                    {/* {isBuyed && <Text style={styles.buyedProduct}>Purchased</Text>} */}
                </View>

                <View style={[styles.info]}>
                    <Text numberOfLines={1} style={styles.text}>{product.item.node.title}</Text>
                    <Text style={styles.text}>{product.item.node.variants.edges[0].node.price}</Text>
                </View>
            </TouchableOpacity>
        </>


    )
}

const styles = StyleSheet.create({
    container: {
        width: '45%',
        padding: 4,
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: 'white',
        borderColor: colors.gray[200],
    },
    buyedProduct: {
        position: 'absolute',
        backgroundColor: 'white',
        color: colors.gray[800],
        top: '50%',
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    buyed: {
        opacity: 0.4
    },
    buyFree: {
        ...typography.caption,
        color: colors.gray[500],
        marginTop: 8
    },
    copyBtn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        gap: 8,
        paddingHorizontal: 12
    },
    copy: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        ...typography.body,
        color: colors.blue[600]
    },
    locked: {
        opacity: 0.4
    },
    imgContainer: {
        position: 'relative'
    },
    image: {
        width: '100%',
        height: 186,
        resizeMode: 'cover',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    info: {
        rowGap: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    text: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },
})

export default ProductCard