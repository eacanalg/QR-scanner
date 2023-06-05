import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from '@expo/vector-icons/Ionicons';
import Back from '../assets/background.svg';
import Logo from '../assets/logo.svg';
import { useFonts } from 'expo-font';

export default function App() {

  const [fontsLoaded] = useFonts({
    'Ogirema': require('../assets/Ogirema.ttf'),
  });

  const [hasPermission, setHasPermission] = useState(null);
  const [data, setdata] = useState({})
  const [scanned, setScanned] = useState(false);



  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setdata(JSON.parse(data));
  };

  return (
    <View style={styles.container}>
      {data?.name ? <View style={styles.container}>
        <Back />
        <View style={{ width: '100%', backgroundColor: 'transparent', position: 'absolute', maxHeight: 250, top:30, alignItems: 'center' }}>
          <Logo />
          <View style={{ height: 150, width: 150, borderRadius: 75, backgroundColor: 'white', top: 30 }}>
            <Image source={{uri: data.image}} height={150} width={150}/>
          </View>
          <View style={{ height: 25, width: 25, borderRadius: 13, backgroundColor: 'rgb(181, 181, 181)', top: 0, left: 45, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={24} color="white" />
          </View>
        </View>
        <TextEntry title={'Nombre: '} content={data.name} />
        <TextEntry title={'Categoria: '} content={data.category} />
        <TextEntry title={'Cantidad: '} content={data.amount} />
        <TextEntry title={'Estado: '} content={data.status} />
        <TextEntry title={'Encargado: '} content={data.assigned} />
        <TextEntry title={'Ubicación: '} content={data.location} />
        <TextEntry title={'Observaciones: '} content={data.observations} />
        <Button title={'Volver a leer'} color={'rgb(83, 98, 55)'} onPress={() => {
          setdata({})
          setScanned(false)
          }} />
      </View> : <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      />}
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
    flex: 1,
    width: '100%',
    backgroundColor: 'rgb(244, 244, 244)',
    alignItems: 'center',
    paddingBottom: 5,
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
