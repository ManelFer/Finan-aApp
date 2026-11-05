import { useWindowDimensions } from 'react-native';

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  return {
    isCompact: width < 380,
    horizontalPadding: width < 360 ? 12 : width < 600 ? 16 : 24,
    maxContentWidth: 720,
    contentWidth: '100%' as const,
  };
};
