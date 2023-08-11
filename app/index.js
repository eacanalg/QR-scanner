import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, useWindowDimensions, Modal, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Back from '../assets/background.svg';
import Logo from '../assets/logo.svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';
import { DataStore } from 'aws-amplify';
import { Item } from '../src/models'


export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const {height, width} = useWindowDimensions();
  const [data, setdata] = useState({})
  const [scanned, setScanned] = useState(false);
  const [modal, setmodal] = useState(false);
  const secret = 'VTA5TVZVTkpUMDVGVTBkTVQwSkJUQT09LFFrOU1WRUZKVGxaRlRsUkJVa2xQVXpJd01qTlRSVU5TUlZSTFJWazlQVDA9'

  function decrypt(str) {
    try {
        var _strkey = Base64.decode(secret);
        var reb64 = CryptoJS.enc.Hex.parse(str);
        var text = reb64.toString(CryptoJS.enc.Base64);
        var Key = CryptoJS.enc.Base64.parse(_strkey.split(",")[1]); //secret key
        var IV = CryptoJS.enc.Base64.parse(_strkey.split(",")[0]); //16 digit
        var decryptedText = CryptoJS.AES.decrypt(text, Key, { keySize: 128 / 8, iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        var str = decryptedText.toString(CryptoJS.enc.Utf8); //binascii.unhexlify(decryptedText)
        str = str.substring(str.indexOf("{"))
        return str
    } catch (e) {
        console.log("Error", e)
    }
}

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);  

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      const parsed = JSON.parse(decrypt(data))
      if (parsed.type === 'offline'){
        setdata(parsed)
      } else {
        DataStore.query(Item, parsed.id).then((ans) => {
          setdata(ans)
        }).catch((e) => console.log('e: ', e))
      }
      setScanned(true);
    } catch (error) {
      setScanned(false)
    }
    
  };

  return (
    <View style={{height: height, width: width, overflow: 'hidden', backgroundColor: 'rgb(244, 244, 244)',}}>
      {data?.name ? <ScrollView style={{backgroundColor: 'transparent', width: '100%', flex: 1}} contentContainerStyle={{flex: 0}}>
         <Modal visible={modal} animationType="fade" style={{backgroundColor: 'black', width: '100%', height: '100%'}}>
            <Pressable 
              onPress={() => setmodal(false)}
              style={{ height: 25, width: 25, borderRadius: 13, backgroundColor: 'rgb(63, 63, 63)', top: 20, right: 20, alignItems: 'center', justifyContent: 'center', position: 'absolute' }}
            >
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
            <Image style={{alignSelf: 'center', width: '85%', height: '85%', flex: 1 }} source={{uri: data.image}} resizeMode="contain" />
         </Modal>
         <View style={styles.container}>
          <Back viewBox="0 100 1125 899" width={width} height={width * 0.8} style={{ marginBottom: 30 }} />
          <View style={{ width: '100%', position: 'absolute',  paddingTop:30, alignItems: 'center' }}>
            <Image style={{ height: width*0.3, width: width*0.7 }} resizeMode='contain' tintColor="#ffffff" source={require('../assets/logo.png')} />
            {/* <Logo viewBox="0 0 727 268" width={width * 0.7} height={width * 0.3} /> */}
            <Pressable onPress={() => setmodal(true)}>
              <View style={{ height: 150, width: 150, borderRadius: 75, backgroundColor: 'white', top: 5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 150, height: 150, flex: 1 }} source={{uri: data.image}} contentFit="contain" />
              </View>
            </Pressable>
            {/* <View style={{ height: 25, width: 25, borderRadius: 13, backgroundColor: 'rgb(181, 181, 181)', top: 0, left: 45, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="add" size={24} color="white" />
            </View> */}
          </View>
          <TextEntry title={'Nombre: '} content={data.name} />
          <TextEntry title={'Descripción: '} content={data.description} />
          <TextEntry title={'Estado: '} content={data.status} />
          <TextEntry title={'Encargado: '} content={data.assigned} />
          <TextEntry title={'Ubicación: '} content={data.location} />
          <TextEntry title={'Observaciones: '} content={data.observations} />
          <Button title={'Volver a leer'} color={'rgb(83, 98, 55)'} onPress={() => {
            setdata({})
            setScanned(false)
            }} />
        </View> 
      </ScrollView> : hasPermission && <View style={{ height: height, width: width }}><BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        /></View>}
    </View>
  );
}

const TextEntry = ({title, content}) => {
 return(
  <View style={{ width: '85%', maxWidth: 250, minHeight: 50, borderRadius: 25, backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'center', padding: 10, marginVertical: 10 }}>
    <Text style={{fontWeight: 'bold', color: 'rgb(127, 127, 127)', fontSize: 16, fontFamily: 'Ogirema'}}>{title}<Text style={{ fontWeight: 'normal' }}>{content}</Text></Text>
  </View>
 )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(244, 244, 244)',
    alignItems: 'center',
    paddingBottom: 5,
    height: '100%',
    paddingBottom: 32,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  image:{
    width: 200,
    height: 200,
  }
});
