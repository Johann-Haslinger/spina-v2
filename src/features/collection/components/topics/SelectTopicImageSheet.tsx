import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ImageFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../../../base/enums';
import {
  FlexBox,
  ScrollableBox,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayButtonTexts } from '../../../../utils/displayText';
import { loadImagesFromUnsplash } from '../../../../utils/loadImagesFromUnsplash';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

interface UnsplashUser {
  name: string;
  profileUrl: string;
}

interface PreviewImage {
  id: string;
  url: string;
  description: string;
  creator: UnsplashUser;
}

const SelectTopicImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.SELECTING_IMAGE_FOR_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const images = usePreviewImages(isVisible);

  const navigateBack = () => lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {/* {(newTitle !== selectedTopicTitle || newDescription !== selectedTopicDescription) && (
            <PrimaryButton onClick={updateTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
          )} */}
      </FlexBox>
      <Spacer />
      <ScrollableBox>
        <Section>
          <SectionRow last icon={<IoSearchOutline tw="text-seconderyText opacity-70" />}>
            <TextInput placeholder="Bild suchen..." />
          </SectionRow>
        </Section>

        <div tw="grid md:grid-cols-4 mt-8 grid-cols-1 col-span-4 gap-2">
          {images.map((image, index) => (
            <PreviewImage key={index} image={image as PreviewImage} />
          ))}
        </div>
      </ScrollableBox>
    </Sheet>
  );
};

export default SelectTopicImageSheet;

const StyledImageWrapper = styled.div`
  ${tw` w-full pb-4 px-2 space-y-4`}
`;
const PreviewImage = (props: { image: PreviewImage }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { image } = props;

  const handleImageSelect = () => {
    const selectedImageEntity = new Entity();
    lsc.engine.addEntity(selectedImageEntity);
    selectedImageEntity.add(new IdentifierFacet({ guid: 'selectedImage' }));
    selectedImageEntity.add(new ImageFacet({ imageSrc: image.url }));

    lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);
  };

  return (
    <StyledImageWrapper>
      <img
        onClick={handleImageSelect}
        src={image.url}
        alt={image.description}
        tw="h-40 hover:scale-105 object-cover w-full rounded-xl"
      />
      <div tw="text-sm text-seconderyText">
        by{' '}
        <a tw="hover:underline" href={image.creator.profileUrl} target="_blank" rel="noopener noreferrer">
          {image.creator.name}
        </a>
      </div>
    </StyledImageWrapper>
  );
};

const usePreviewImages = (isVisible: boolean) => {
  const { selectedTopicTitle } = useSelectedTopic();
  const [images, setImages] = useState<PreviewImage[]>([]);

  useEffect(() => {
    if (isVisible && images.length === 0 && selectedTopicTitle) {
      loadImagesFromUnsplash(selectedTopicTitle).then((images) => {
        setImages(JSON.parse(images));
        console.log(images);
      });
    }
  }, [isVisible, selectedTopicTitle]);

  return images;
};
