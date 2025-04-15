import { StyleSheet } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
  imgSource: ImageSource;
  width: number;
  height: number;
};

export default function ImageViewer({ imgSource, width, height }: Props) {
  return <Image source={imgSource} style={[styles.image, {width: width, height: height}]} />;
  // return <Image source={imgSource} className=' rounded-lg' />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
    marginBottom: 10,
  },
});