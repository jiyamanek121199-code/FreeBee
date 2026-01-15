import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fonts from '../Fonts'
import { createStaticNavigation, NavigationContainer, useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [newPasswordError, setNewPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const [isFocus, setisFocus] = useState(false)

    function doSubmit() {
        setNewPasswordError("");
        setConfirmPasswordError("");
        var isValid = true;


        if (!newPassword) {
            setNewPasswordError("Please enter your password.")
            isValid = false;
        }


        if (!confirmPassword) {
            setConfirmPasswordError("Please enter your password again.")
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("your password doesnt match")
            isValid = false;
        }


        if (isValid) {

            setNewPassword('')

            setConfirmPassword('')

        }
    }
    function navigate() {
        navigation.goBack()
        return (null)
    }
    function fu() {
        console.log(isFocus)
        setisFocus(!isFocus)
    }
    const confirmPasswordRef = React.useRef()
    return (
        <View style={{ flex: 1, paddingVertical: 50, paddingHorizontal: 15, paddingTop: 90, backgroundColor: '#f9f3f0' }}>
            <TouchableOpacity style={styles.baclbutton} onPress={navigate} >
                <Image
                    style={{ height: 20, width: 20 }}
                    source={require('./Images/icons8-back-100.png')}
                />
            </TouchableOpacity>
            <Image
                style={{ height: 120, width: 120, alignSelf: 'center', }}
                source={require('./Images/icons8-forgot-password-100.png')}
            />

            <Text style={{ fontFamily: Fonts.BOLD, fontSize: scale(25), alignSelf: 'center', marginTop: 30 }}>Resert Password</Text>
            <Text style={{ fontFamily: Fonts.REGULAR, fontSize: scale(15), alignSelf: 'center', marginBottom: 5 }}>Your data is secure</Text>

            <View style={styles.TextInput}>
                <TextInput
                    style={{ fontSize: 17, }}

                    onChangeText={text => {
                        setNewPassword(text)
                        setNewPasswordError(null)
                    }}
                    value={newPassword}
                    placeholder="New password"
                    secureTextEntry={!isFocus}
                    placeholderTextColor="#9a9a9a"
                    returnKeyType="next"
                    onSubmitEditing={() => { confirmPasswordRef.current.focus(); }}
                />
                <Image
                    style={styles.tinyLogo}
                    source={require('./Images/icons8-shield-100.png')}
                />
                <TouchableOpacity onPress={fu} >
                    <Image
                        style={{ alignSelf: 'flex-end', marginRight: 24, height: 22, width: 22, position: 'absolute', bottom: 11 }}
                        source={isFocus ? require('./Images/visibility_24dp_656565_FILL0_wght400_GRAD0_opsz24.png') : require('./Images/visibility_off_24dp_656565_FILL0_wght400_GRAD0_opsz24.png')}
                    />
                </TouchableOpacity>
                <Text style={{ color: 'red', position: 'absolute', bottom: -18 }}>{newPasswordError}</Text>

            </View>

            <View style={styles.TextInput}>
                <TextInput
                    style={{ fontSize: 17, }}
                    ref={confirmPasswordRef}
                    onChangeText={text => {
                        setConfirmPassword(text)
                        setConfirmPasswordError(null)
                    }}
                    placeholderTextColor="#9a9a9a"
                    value={confirmPassword}
                    secureTextEntry={!isFocus}

                    placeholder="Confirm Password"
                    returnKeyType="done"
                />
                <Image
                    style={styles.tinyLogo}
                    source={require('./Images/icons8-shield-1.png')}
                />
                <TouchableOpacity onPress={fu} >
                    <Image
                        style={{ alignSelf: 'flex-end', marginRight: 24, height: 22, width: 22, position: 'absolute', bottom: 11 }}
                        source={isFocus ? require('./Images/visibility_24dp_656565_FILL0_wght400_GRAD0_opsz24.png') : require('./Images/visibility_off_24dp_656565_FILL0_wght400_GRAD0_opsz24.png')}
                    />
                </TouchableOpacity>
                <Text style={{ color: 'red', position: 'absolute', bottom: -18 }}>{confirmPasswordError}</Text>

            </View>

            <Pressable
                onPress={() => { doSubmit() }}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? '#fbedb4' : '#FF6B00',
                    },
                    styles.button,
                ]}>
                <Text style={{ fontSize: scale(17), fontFamily: Fonts.BOLD, color: 'white', marginTop: 3 }}>Update</Text>
            </Pressable>


        </View >
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    baclbutton: {
        position: 'absolute',
        height: 50,
        width: 50,
        backgroundColor: 'white',
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    TextInput: {
        height: verticalScale(50),
        width: '97%',
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 2.5,
        paddingLeft: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        height: 20,
        width: 20,
        position: 'absolute',
        marginLeft: 20
    },
    button: {
        height: verticalScale(44),
        width: '97%',
        // backgroundColor: '#006bff',
        borderRadius: 15,
        marginTop: 35,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    registor: {
        alignSelf: 'center',
        bottom: -80,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
    },
})