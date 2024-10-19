import { Alert, AlertButton } from '../../../components';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';
import { displayActionTexts } from '../../utilities/displayText';

const DiscardUnsavedChangesAlert = (props: { isVisible: boolean; cancel: () => void; close: () => void }) => {
  const { isVisible, cancel, close } = props;
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Alert displayDiscardAlert navigateBack={cancel} visible={isVisible}>
      <AlertButton onClick={cancel} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={close} role="destructive">
        Fortfahren
      </AlertButton>
    </Alert>
  );
};

export default DiscardUnsavedChangesAlert;
