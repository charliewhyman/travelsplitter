import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}


export function Subtitle(props: TextProps) {
  return <Text {...props} style={[props.style, { fontWeight: 'bold',fontSize: 20, marginBottom: 10 }]} />;
}
