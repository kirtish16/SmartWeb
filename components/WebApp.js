import React, { useState } from "react";
import { StyleSheet, SafeAreaView} from "react-native";
import WebView from "react-native-webview";
import * as Progress from "react-native-progress"

let WebApp = ({ route }) => {
    const url = String(route.params.url);

    const [progress, setProgress] = useState(0);
    const [isLoaded, setLoaded] = useState(false);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {!isLoaded ? <Progress.Bar progress={progress} width={null} borderWidth={0} borderRadius={0}/> : null}
            <WebView originWhitelist={['*']} source={{ uri: url }} onError={({nativeEvent}) => alert(`Unable to connect to ${nativeEvent.url}`)} onLoadProgress={({nativeEvent})=>setProgress(nativeEvent.progress)} onLoad={({nativeEvent})=>setLoaded(true)} style={{ marginTop: 5 }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 10
    },
    itemText: {
        maxWidth: '80%',
        color: 'black'
    },
    circluar: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5
    },
});

export default WebApp; 