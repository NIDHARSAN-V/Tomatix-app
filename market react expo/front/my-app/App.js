import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [statename, setstatename] = useState();
  const [tableres, settable] = useState([[]]);
  const [qandares, setqanda] = useState([]);

  const states = [
    'Select any One',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ];

  const handlePickerChange = function (val, i) {
    setstatename(val);
  };

  const Table = ({ data }) => {
    return (
    
      <View style={styles.tableContainer}> 
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={[styles.cell, rowIndex === 0 ? styles.headerCell : styles.dataCell]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const QandA = ({ qandares }) => {
    return (
      
      <View style={styles.qandaContainer}>
          <Text style={styles.text}>Frequently Asked Questions:</Text>
        {qandares.map((item, index) => (
          <View key={index} style={styles.qandaItem}>
            <Text style={styles.qandaQuestion}>{item.q}</Text>
            <Text style={styles.qandaAnswer}>{item.a}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleSubmit = async function () {
    console.log(statename);
    try {
      const res = await axios.post("http://192.168.43.46:5500/api/getmarketintelligence", { statename: statename });
      settable(res.data.table);
      setqanda(res.data.qanda);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      <Text style={styles.text1}>Tomatix</Text>
      <Text style={styles.text}>Select The State </Text>

      <Picker style={styles.picker} selectedValue={statename} onValueChange={handlePickerChange}>
        {states.map((statex, i) => (
          <Picker.Item key={i} label={statex} value={statex} />
        ))}
      </Picker>
      <Button title='Submit' onPress={handleSubmit} />

      <ScrollView style={styles.innerContainer}>
        {tableres.map((tableData, tableIndex) => (
          <View key={tableIndex} style={styles.tableWrapper}>
            <ScrollView horizontal={true} style={styles.horizontalScroll}>
              <Table data={tableData} />
            </ScrollView>
          </View>
        ))} 

        
      
        {qandares.length>0 &&<QandA qandares={qandares} />}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    width: '100%' 
  },
  text: {
    color: "red",
    marginTop:70,
    fontSize:20
  },
  text1:{
    color: "green",
    marginTop:50,
    fontSize:30,
    backgroundColor:"lightred"
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  tableWrapper: {
    marginBottom: 20
  },
  horizontalScroll: {
    marginBottom: 10
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: 'grey'
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    width: 150,  
    padding: 8,
    borderWidth: 1,
    borderColor: '#000'
  },
  headerCell: {
    backgroundColor: '#ddd',
    fontWeight: 'bold'
  },
  dataCell: {
    backgroundColor: '#fff'
  },
  qandaContainer: {
    marginTop: 20,
  },
  qandaItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  qandaQuestion: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  qandaAnswer: {
    marginLeft: 10,
  },
});
