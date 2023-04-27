# Image-Segmentation-using-Tensorflow-Lite


Deeplab TF-Lite Tensorflow model is used in image-segmentation where we work on pixels of the image
we can simply use this model to remove background of the image. this model detects the objects of the captured image
present in the model classes(model classes are the list of items ex.apple,elephant..) and put the output image generated by the model on the caputured image.
we can add the opacity to see the difference.
<br/>DeepLab Model:
<br/>Below code is to load the deeplab model() //model path in the project IMAGESEGMENTATION/assets
  <br/> loadModel = () => { <br/>
    tflite.loadModel({    <br/>
      model: 'deeplabv3_257.tflite',// required<br/>
      labels: 'deeplabv3_257.txt',  // required <br/>
      numThreads: 1,                              // defaults to 1  <br/>
    },  <br/>
    (err, res) => {  <br/>
      if(err)        <br/>
        console.log(err); <br/>
      else                <br/>
        console.log(res); <br/>
    });
