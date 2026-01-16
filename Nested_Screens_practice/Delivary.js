import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../Fonts';

const Delivary = () => {
    return (
        <View style={styles.container}>
            <View style={styles.map}>
                <Image style={styles.map} source={require("./Images/Screenshot2025-03-26215108.png")} />
                <View style={styles.info}>
                    <LinearGradient
                        colors={['#17c216', '#1f9618']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.timer}
                    />
                    <View style={styles.timer}>
                        <Text style={{ fontSize: scale(35), color: 'white', alignSelf: 'center', right: 2, fontWeight: "700" }}>20</Text>
                        <Text style={{ fontSize: scale(18), color: 'white', alignSelf: 'center', right: 2, top: -10 }}>min</Text>
                    </View>
                    <View style={{ height: scale(97), width: verticalScale(220), left: 120, flexWrap: "wrap", paddingHorizontal: scale(5), paddingVertical: scale(10) }}>
                        <Text style={styles.ordertext}>Order is in Process</Text>
                        <Text style={styles.infotext}>Your order is beign Process.Till then enjoy your free time</Text>
                    </View>
                </View>
                <View style={styles.instriction}>
                    <View style={{ height: scale(28), width: verticalScale(28), borderRadius: moderateScale(50), backgroundColor: 'white', left: 10, alignItems: 'center', backgroundColor: '#8e8e8e' }}>
                        <Text style={{ fontSize: 28, fontWeight: 500, top: -3, color: 'white' }}>+</Text>
                    </View>
                    <Text style={{ position: "absolute", left: 55, fontSize: 17 }}>Add Delivary instriction</Text>
                </View>
            </View>
        </View>
    )
}

export default Delivary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(10),
    },
    map: {
        position: 'absolute',
        height: verticalScale(250),
        width: scale(350),
        backgroundColor: '#b9b9b9',
        resizeMode: "cover",
        borderBottomLeftRadius: scale(20),
        borderBottomRightRadius: scale(20)
    },
    info: {
        height: scale(93),
        width: "97%",
        backgroundColor: 'white',
        top: 320,
        alignSelf: 'center',
        borderRadius: moderateScale(15),
        justifyContent: 'center'
    },
    timer: {
        position: 'absolute',
        height: scale(80),
        width: verticalScale(80),
        left: 10,
        borderRadius: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center'
    },
    ordertext: {
        left: 15,
        fontSize: 23,
        fontFamily: Fonts.BOLD,
    },
    infotext: {
        alignSelf: "flex-end",
        left: 38,
        fontSize: 15,
        fontFamily: Fonts.MEDUIM,
        color: "#8e8e8e"
    },
    instriction: {
        height: scale(40),
        width: "90%",
        backgroundColor: "white",
        top: moderateScale(305),
        borderRadius: moderateScale(15),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(15),
    }

})