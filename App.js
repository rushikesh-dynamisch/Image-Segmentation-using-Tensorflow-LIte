import React, {Fragment, Component} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height / 1.5;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUri: '',
      resultText: '',
      recognitions: [],
    };
    this.loadModel();
  }

  loadModel = () => {
    tflite.loadModel({
      model: 'deeplabv3_257.tflite',// required
      labels: 'deeplabv3_257.txt',  // required
      numThreads: 1,                              // defaults to 1  
    },
    (err, res) => {
      if(err)
        console.log(err);
      else
        console.log(res);
    });
  };

  performImageSegmentation = () => {
    tflite.runSegmentationOnImage({
      path: this.state.fileUri,
      imageMean: 127.5,      // defaults to 127.5
      imageStd: 127.5,       // defaults to 127.5
      //labelColors: [...],    // defaults to https://github.com/shaqian/tflite-react-native/blob/master/index.js#L59
      outputType: "png",     // defaults to "png"
    },
    (err, res) => {
      if(err)
        console.log(err);
      else{
        console.log(res);
        this.setState({recognitions:res})
      }
        
    });
  };

  renderPredictions = () => {
    const {recognitions} = this.state;
    console.log(recognitions.length);
    return recognitions.length > 0 ? (
      <Image
        style={{flex: 1, width: widthScreen, height: heightScreen,position:"absolute"}}
        source={{uri: 'data:image/png;base64,' + recognitions}}
        opacity={1}
      />
    ) : undefined;
  };

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        console.log('response', JSON.stringify(response));
        var w = response.assets[0].width;
        var h = response.assets[0].height;
        this.setState({
          fileUri: response.assets[0].uri,
        });
        this.performImageSegmentation();
      }
    });
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        console.log('response', JSON.stringify(response));
        this.setState({
          fileUri: response.assets[0].uri,
        });
        this.performImageSegmentation();
      }
    });
  };

  renderFileUri() {
    if (this.state.fileUri) {
      return <Image source={{uri: this.state.fileUri}} style={styles.images} />;
    } else {
      return (
        <Image source={require('./assets/dummy.jpeg')} style={styles.images} />
      );
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.ImageSections}>
              <View>{this.renderFileUri()}</View>
                {this.renderPredictions()}
            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity
                onPress={this.chooseImage}
                style={styles.btnSection}>
                <Text style={styles.btnText}>Choose File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.launchCamera}
                style={styles.btnSection}>
                <Text style={styles.btnText}>Launch Camera</Text>
              </TouchableOpacity>
              <Text
                style={{textAlign: 'center', fontSize: 40, paddingBottom: 10}}>
                Image Segmentation
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },

  body: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    borderColor: 'black',
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  images: {
    width: widthScreen,
    height: heightScreen,
    borderColor: 'black',
    borderWidth: 1,
    resizeMode: 'stretch',
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  box: {
    position: 'absolute',
    borderColor: 'blue',
    borderWidth: 2,
  },
});
