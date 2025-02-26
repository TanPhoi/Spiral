import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/common/headers/Header'
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import { ChevronRightIcon, ExclamationCircleIcon, LinkIcon, PencilSquareIcon } from 'react-native-heroicons/outline'
import { ImageIcon, UploadIcon, VideoCamIcon } from '@/assets/svg'
import { useUploadFile } from '@/hooks/useUploadFile'
import Video from 'react-native-video'
import Clipboard from '@react-native-clipboard/clipboard'
import { useToast } from 'react-native-toast-notifications'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'
import { draftContent, uploadContent } from '@/apis/campaign'
import { getContentDetail } from '@/apis/content'
import { ContentType } from '@/models/Content.modal'
import { FILE_EXTENSIONS } from '@/constants/content.constant'
import Button from '@/common/buttons/Button';

const EditContentReject = () => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const location: any = useRoute()
    const snapPoints = useMemo(() => ['100%', '100%'], []);
    const toast = useToast()

    const [caption, setCaption] = useState<string>('');
    const [note, setNode] = useState<string>('');
    const [urls, setUrls] = useState<string[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { error, files, handleUpdateFile, resetFile } = useUploadFile('all');

    useEffect(() => {
        getContentDetail(location.params.id)
            .then((res) => {
                const content: ContentType = res.data.data
                setCaption(content.caption)
                setNode(content.notes)
                setUrls(content.urls)
            })
            .catch((err) => console.log(err))
    }, [location?.params?.id])

    const copyToClipboard = (): void => {
        Clipboard?.setString('<<URL>>');
        toast.show(`Coppied`, { type: 'success', placement: 'top' });
    };

    const handleVisibleModal = (): void => {
        bottomSheetModalRef.current?.present();
    };

    const handleCloseModal = (): void => {
        bottomSheetModalRef.current?.dismiss();
        setNode('');
    };

    const handleConfirm = (): void => {
        bottomSheetModalRef.current?.dismiss();
    };

    const handleSubmitContent = (type: 'draft' | 'upload'): void => {

        const data = new FormData();

        if (!Array.isArray(files) || files.length === 0) {
            console.error('No files provided or files is not an array');
            return;
        }

        files.forEach(f => {
            data.append('files', {
                uri: Platform.OS === 'ios' ? f.uri?.replace('file://', '') : f.uri,
                type: f.type,
                name: f.fileName,
            });
        });
        data.append('caption', caption);
        data.append('note', note);

        const api =
            type === 'draft'
                ? draftContent(location?.params?.id, data)
                : uploadContent(location?.params?.id, data);

        api
            .then(res => {
                console.log(res);

                toast.show(`Content ${type} successfully`, { type: 'success', placement: "top" })
                resetContentFields()
                type === 'draft' ? navigation.navigate('Content', { screen: 'Content' }) : navigation.navigate('success_submit_content')
            })
            .catch(err => {
                console.log(err);
            });
    };

    const resetContentFields = (): void => {
        resetFile()
        setCaption('')
        setNode('')
    }

    const isDisabled = () => {
        if (isChange) {
            return !caption || !note;
        }
        return !caption || !note || files.length === 0;
    };

    const mergedData = [
        ...(urls || []),
        ...(files || []).map((file) => (typeof file === 'string' ? file : file.uri))
    ];

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header
                        title={'Resubmit'}
                        type={'back'}
                        onPress={(): void => navigation.goBack()} />
                </View>

                {/* Reason */}
                <View style={styles.reasonContainer}>
                    <ExclamationCircleIcon width={24} height={24} color={colors.red[500]} />
                    <View style={styles.viewReason}>
                        <Text style={styles.txtReason}>Please resubmit 1 change requested</Text>
                        <TouchableOpacity style={styles.btnReason}>
                            <Text style={styles.txtButtonReason}>View reason</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.fileList}>
                        <TouchableOpacity
                            style={styles.buttonUpload}
                            onPress={handleUpdateFile}>
                            <UploadIcon />
                            <Text style={styles.txtUpload}>Upload image or video</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={mergedData}
                            renderItem={({ item }) => (
                                <View style={styles.file}>
                                    {FILE_EXTENSIONS.some((format) => item?.includes(format)) ? (
                                        <>
                                            <Image
                                                style={styles.file}
                                                source={{ uri: item }}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.icon}>
                                                <ImageIcon color={'white'} width={16} height={16} />
                                            </View>

                                        </>
                                    ) : (
                                        <>
                                            <View style={styles.videoWrapper}>
                                                <Video resizeMode="cover" style={styles.video} source={{ uri: item }} />
                                            </View>
                                            <View style={styles.icon}>
                                                <VideoCamIcon color={'white'} width={16} height={16} />
                                            </View>
                                        </>
                                    )}
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <TextInput
                        multiline
                        placeholder="Write a caption..."
                        style={styles.caption}
                        value={caption}
                        onChangeText={value => {
                            setCaption(value)
                            setIsChange(true)
                        }}
                    />

                    <View>
                        <View style={styles.link}>
                            <LinkIcon width={24} height={24} color={colors.gray[700]} />
                            <Text style={styles.txtLink}>Link website</Text>
                        </View>

                        <View style={styles.copyLink}>
                            <Text>{`<<URL>>`}</Text>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.btnCopy}>
                                <Text style={styles.txtCopy}>Copy</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.nodeBox}
                            onPress={handleVisibleModal}>
                            <View style={styles.addNode}>
                                <PencilSquareIcon
                                    width={24}
                                    height={24}
                                    color={colors.blue[950]}
                                />
                                <Text style={styles.txtAddNote}>Add note</Text>
                            </View>
                            <ChevronRightIcon
                                width={12}
                                height={12}
                                color={colors.gray[500]}
                            />
                        </TouchableOpacity>

                        {note.length > 0 && <Text style={styles.txtNode}>{note}</Text>}
                        <View style={styles.divider} />
                    </View>
                </View>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    handleComponent={() => <View />}
                    enableContentPanningGesture={false}>
                    <BottomSheetView style={{ flex: 1 }}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <KeyboardAvoidingScrollView>
                                <View style={styles.headerModal}>
                                    <Header
                                        title={''}
                                        type={'back'}
                                        onPress={handleCloseModal}
                                    />
                                </View>

                                <View style={styles.bodyModal}>
                                    <Text style={styles.txtTitleModal}>Add Note</Text>
                                    <Text style={styles.txtDescModal}>
                                        A field where the influencer can provide any additional
                                        notes or context for the brand regarding the content.
                                    </Text>

                                    <TextInput
                                        multiline
                                        placeholder="Add note..."
                                        style={styles.inputModal}
                                        onChangeText={(value) => {
                                            setNode(value)
                                            setIsChange(true)
                                        }}
                                        value={note}
                                    />
                                </View>
                            </KeyboardAvoidingScrollView>
                            <View style={styles.buttonModal}>
                                <Button
                                    label={'Confirm'}
                                    disabled={note.length === 0}
                                    onPress={handleConfirm}
                                />
                            </View>
                        </SafeAreaView>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>

            <View>
                <View style={styles.divider} />
                <View style={styles.buttonAction}>
                    <View style={styles.button}>
                        <Button
                            label={'Save Draft'}
                            disabled={isDisabled()}
                            background={colors.gray[100]}
                            color={colors.gray[800]}
                            onPress={(): void => handleSubmitContent('draft')}
                        />
                    </View>

                    <View style={styles.button}>
                        <Button
                            disabled={isDisabled()}
                            label={'Submit Content'}
                            background={colors.blue[600]}
                            onPress={(): void => handleSubmitContent('upload')}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EditContentReject

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
    },
    header: {
        marginHorizontal: 16
    },
    divider: {
        backgroundColor: colors.gray[200],
        height: 1,
    },

    reasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        columnGap: 12,
        padding: 16,
        backgroundColor: colors.red[50]
    },
    viewReason: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtReason: {
        color: colors.gray[800],
        ...typography.caption,
    },
    btnReason: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    txtButtonReason: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.body,
    },

    body: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    fileList: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    buttonUpload: {
        width: 120,
        height: 120,
        padding: 10,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 10,
    },
    txtUpload: {
        color: colors.gray[800],
        ...typography.caption,
        textAlign: 'center',
    },
    caption: {
        height: 258,
        fontWeight: '500',
        ...typography.base,
        color: colors.gray[500],
        textAlignVertical: 'top',
    },
    txtLink: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },
    link: {
        flexDirection: 'row',
        columnGap: 12,
        alignItems: 'center'
    },
    copyLink: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10
    },
    btnCopy: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.gray[100],
        borderRadius: 8,
    },
    txtCopy: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.body
    },
    nodeContainer: {
        paddingBottom: 12,
    },
    nodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 12,
    },
    addNode: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
    txtAddNote: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body,
    },
    txtNode: {
        color: colors.gray[500],
        ...typography.caption,
        textAlign: 'justify',
        backgroundColor: colors.gray[100],
        borderRadius: 8,
        padding: 8,
        justifyContent: 'center',
        marginBottom: 12,
    },

    buttonAction: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        columnGap: 12,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    button: {
        flex: 1,
    },

    file: {
        width: 120,
        height: 120,
        marginRight: 8,
        borderRadius: 8,
    },
    icon: {
        position: 'absolute',
        zIndex: 1,
        bottom: 6,
        left: 6,
    },

    videoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
    },

    video: {
        width: '100%',
        height: '100%',
    },

    headerModal: {
        borderBottomWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: 16,
    },
    bodyModal: {
        marginTop: 32,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    txtTitleModal: {
        color: colors.gray[900],
        ...typography.heading4,
        textAlign: 'justify',
        fontWeight: '600',
    },
    txtDescModal: {
        color: colors.gray[700],
        ...typography.body,
        textAlign: 'center',
    },
    inputModal: {
        color: colors.gray[700],
        ...typography.body,
        alignSelf: 'flex-start',
        width: '100%',
        height: 396,
        textAlignVertical: 'top',
    },
    buttonModal: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
})