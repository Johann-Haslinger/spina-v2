import { PrimaryButton, Section, SectionRow, Sheet, Spacer } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../hooks/useUserData";
import { displayButtonTexts } from "../../../utils/displayText";
import { useAppState } from "../../collection/hooks/useAppState";

const Profile = () => {
  const { isProfileVisible, toggleProfile } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const { userName, profilePicture } = useUserData();

  return (
    <Sheet visible={isProfileVisible} navigateBack={toggleProfile}>
      <PrimaryButton onClick={toggleProfile}>{displayButtonTexts(selectedLanguage).done}</PrimaryButton>
      <Spacer />
      <Section>
        <SectionRow>
          <img src={profilePicture} alt="Profile" />
        </SectionRow>
        <SectionRow last>{userName}</SectionRow>
      </Section>
    </Sheet>
  );
};

export default Profile;
