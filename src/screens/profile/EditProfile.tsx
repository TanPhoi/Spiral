import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/common/headers/Header'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'
import { CalendarIcon, PlusIcon } from 'react-native-heroicons/outline'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import Input from '@/common/inputs/Input'
import InputCountry from '@/common/inputs/InputCountry'
import * as yup from 'yup'
import { EMAIL_REQUIRED, INVALID_EMAIL, NAME_REQUIRED, PHONE_REQUIRED } from '@/constants/message.constant'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@/common/buttons/Button'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'
import ModalCalendar from '@/common/modals/ModalCalendar'
import dayjs from 'dayjs'
import { DAY_FORMAT_SPACE } from '@/constants/time.constant'
import { useAuthContext } from '@/contexts/auth.context'
import { User } from '@/models/User.model'
import { editProfile } from '@/apis/creator'
import { useToast } from 'react-native-toast-notifications'

const fromSchema = yup.object().shape({
    name: yup.string().required(NAME_REQUIRED),
    email: yup.string().required(EMAIL_REQUIRED).email(INVALID_EMAIL),
    phone: yup.string().required(PHONE_REQUIRED),
    dob: yup.string().notRequired(),
})

const EditProfile = (): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const { userInfo, handleRefreshUserInfo } = useAuthContext()
    const toast = useToast()
    const [isModal, setIsModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [dob, setDob] = useState<Date | string>(userInfo?.creator?.dob as string)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', handleRefresh);
        return unsubscribe;
    }, [navigation, userInfo]);

    const { control, reset, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(fromSchema),
        defaultValues: {
            name: userInfo?.creator?.name,
            email: userInfo?.creator?.email,
            phone: userInfo?.creator?.phone
        },
        mode: 'onChange'
    })

    const handleSaveProfile = (data: User): void => {
        setLoading(true)
        const payload: User = {
            ...data,
            dob: dob as string
        }

        editProfile(userInfo?.id || '', payload).then(() => {
            handleRefreshUserInfo()
            toast.show('Update Successfully', { type: 'success', placement: 'top' })
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleRefresh = (): void => {
        reset({
            name: userInfo?.creator?.name,
            email: userInfo?.creator?.email,
            phone: userInfo?.creator?.phone,
            dob: userInfo?.creator?.dob,
        })
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <KeyboardAvoidingScrollView>

                    <Header
                        title={'Edit Profile'}
                        type={'back'}
                        onPress={(): void => navigation.goBack()} />

                    <View style={styles.imgContainer}>
                        <Image style={styles.imgAvatar} source={{ uri: "https://meatworld.com.vn/wp-content/uploads/anh-avatar-anime-8BUm94I.jpg" }} />
                        <TouchableOpacity style={styles.icPlus}>
                            <PlusIcon width={16} height={16} color={'white'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{userInfo?.name}</Text>

                    <View style={styles.body}>

                        <Controller
                            control={control}
                            name='name'
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.name?.message}
                                    label={'Full name'}
                                    placeholder={'e.g. John Marr'} />
                            )}
                        />

                        <Controller
                            control={control}
                            name='email'
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.email?.message}
                                    label={'Email'}
                                    placeholder={'Harna Alisha'} />
                            )} />

                        <Controller
                            control={control}
                            name='phone'
                            render={({ field: { onChange, value } }) => (
                                <InputCountry
                                    label={'Phone number'}
                                    value={value}
                                    placeholder={'Phone number'}
                                    error={errors.phone?.message}
                                    onChangeText={onChange} />
                            )} />

                        <View>
                            <Text style={styles.dob}>DOB</Text>
                            <TouchableOpacity onPress={(): void => setIsModal(true)} style={styles.dobContainer}>
                                <Text style={[styles.date, dob && styles.haveDate]}>{dob ? dayjs(dob).format(DAY_FORMAT_SPACE) : 'dd/mm/yyyy'}</Text>
                                <CalendarIcon width={20} height={20} color={colors.gray[500]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingScrollView>

                <View style={styles.button}>
                    <Button
                        loading={loading}
                        label={'Save Changes'}
                        disabled={!isValid}
                        onPress={handleSubmit(handleSaveProfile as any)} />
                </View>
            </View>

            <ModalCalendar
                open={isModal}
                onClose={(): void => setIsModal(false)}
                value={''}
                onSave={(value): void => setDob(value)} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    imgContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
    imgAvatar: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        borderWidth: 2,
        borderColor: 'white'
    },
    icPlus: {
        position: "absolute",
        bottom: 0,
        right: 0,
        padding: 4,
        backgroundColor: colors.blue[600],
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'white'
    },
    name: {
        alignSelf: 'center',
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },

    body: {
        marginTop: 20,
        rowGap: 16,
    },
    dob: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },
    dobContainer: {
        marginTop: 8,
        backgroundColor: colors.gray[100],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    date: {
        color: colors.gray[500],
        fontWeight: '500',
        ...typography.body
    },
    haveDate: {
        color: colors.gray[800],
    },
    button: {
        marginBottom: 10,
    },
    error: {
        marginTop: 4,
        color: 'red',
        ...typography.body,
        fontWeight: '500',
    },
})

export default EditProfile
