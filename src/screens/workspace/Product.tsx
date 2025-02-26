import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { XMarkIcon } from 'react-native-heroicons/outline'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import ProductCard from '@/components/campaigns/ProductCard'
import { SHOPIFY_API, SHOPIFY_ACCESS_TOKEN } from '@env'

const Product = () => {
    const [remind, setRemind] = useState<boolean>(true)
    const [products, setProducts] = useState<[]>([])

    useEffect(() => {
        fetch(SHOPIFY_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: `
              {
                products(first: 10) {
                  edges {
                    node {
                      id
                      title
                      descriptionHtml
                      featuredImage {
                        id
                        url
                      }
                      variants(first: 5) {
                        edges {
                          node {
                            id
                            title
                            price
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            }),
        })
            .then(response => response.json())
            .then(data => {
                const products = data.data?.products?.edges || [];

                setProducts(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [])

    return (
        <View style={styles.container}>
            {
                remind && (
                    <View style={styles.notificationContainer}>
                        <Text style={styles.notificationText}>You will be redirected to Shopify to complete your order. Please review your product information before confirming your order.</Text>
                        <TouchableOpacity onPress={() => setRemind(false)}>
                            <XMarkIcon width={24} height={24} color={colors.gray[500]} />
                        </TouchableOpacity>
                    </View>
                )
            }


            <View style={styles.productList}>
                <FlatList
                    data={products}
                    renderItem={(item) => (
                        <ProductCard product={item} />
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.flatListStyle} />
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    notificationContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        backgroundColor: colors.gray[50],
        padding: 16,
    },
    notificationText: {
        color: colors.gray[800],
        ...typography.caption,
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 12,
    },
    flatListStyle: {
        gap: 8,
        marginBottom: 8,
    },
    productList: {
        width: '100%',
        marginHorizontal: 16,
        marginTop: 20,
        flex: 1,
    },
})

export default Product
