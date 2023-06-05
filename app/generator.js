import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { jsPDF } from 'jspdf';

export default function Generator() {
  const [data, setdata] = useState({})
  useEffect(() => {
    const pageSize = [215.9, 279.4] //#TODO change page size
    const QRSize = 20 //#TODO SET QR SIZE
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize,
    });
    
    const rows = pageSize[0] / (QRSize + 10)
    const cols = pageSize[1] / (QRSize + 15)

    for (let i = 0; i < rows - 1; i++ ){

    }
  
  }, [])
  
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
