import { NavigationBar, Title, View } from "../components";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";

const Overview = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <View viewType="baseView">
      <NavigationBar></NavigationBar>
      <Title>
        {displayHeaderTexts(selectedLanguage).overview}
      </Title>
    </View>
  );
};

export default Overview;
