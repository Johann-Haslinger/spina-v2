import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ImageFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoRemoveCircle } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story, SupabaseStorageBucket } from '../../../../base/enums';
import { CloseButton, FlexBox, ScrollableBox, Section, SectionRow, Sheet, Spacer } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { getCompletion } from '../../../../utils/getCompletion';
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

const TOPIC_IMAGES = [
  '0_topic_mathematics.png',
  '1_topic_astronomy.png',
  '2_topic_biology.png',
  '3_topic_chemistry.png',
  '4_topic_history.png',
  '5_topic_geography.png',
  '6_topic_music.png',
  '7_topic_literature.png',
  '8_topic_computer science.png',
  '10_topic_globalization.png',
  '11_topic_botany.png',
  '12_topic_philosophy.png',
  '13_topic_sports.png',
  '14_topic_law.png',
  '15_topic_microbiology.png',
  '16_topic_economics.png',
  '17_topic_theater.png',
  '18_topic_art.png',
];

const useTopicImageURLs = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  useEffect(() => {
    const loadPublicURLs = async () => {
      setImageURLs([]);

      TOPIC_IMAGES.forEach((image) => {
        const { data } = supabaseClient.storage.from(SupabaseStorageBucket.TOPIC_IMAGES).getPublicUrl(image);
        setImageURLs((prev) => [...prev, data.publicUrl]);
      });
    };

    loadPublicURLs();
  }, []);

  return imageURLs;
};

const SelectTopicImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.SELECTING_IMAGE_FOR_TOPIC_STORY);
  const topicImageURLs = useTopicImageURLs();
  const unsplashImages = useUnsplashImages(isVisible);

  const navigateBack = () => lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);

  const handleImageSelect = (url: string) => {
    const selectedImageEntity = new Entity();
    lsc.engine.addEntity(selectedImageEntity);
    selectedImageEntity.add(new IdentifierFacet({ guid: 'selectedImage' }));
    selectedImageEntity.add(new ImageFacet({ imageSrc: url }));

    lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <ScrollableBox>
        {unsplashImages.length > 0 && (
          <div tw="w-full overflow-hidden">
            <p tw="text-2xl font-semibold mb-4 ">Vorschläge</p>
            <div tw="flex w-full rounded-xl  overflow-x-scroll">
              <div tw="w-fit space-x-2 flex">
                {unsplashImages.map((image, index) => (
                  <UnsplashImage key={index} image={image as PreviewImage} />
                ))}
              </div>
            </div>
          </div>
        )}
        <p tw="text-2xl  font-semibold mt-6 mb-4">Abstrakt</p>
        <div tw="grid md:grid-cols-4 grid-cols-1 col-span-4 gap-2">
          {topicImageURLs.map((imageURL, index) => (
            <img
              onClick={() => handleImageSelect(imageURL)}
              key={index}
              src={imageURL}
              alt={`Topic Image ${index}`}
              tw="h-40 hover:scale-105  hover:object-top object-center transition-all object-cover w-full rounded-xl"
            />
          ))}
        </div>
        <Spacer size={8} />
        <Section>
          <SectionRow onClick={() => handleImageSelect('')} last role="destructive" icon={<IoRemoveCircle />}>
            Bild entfernen
          </SectionRow>
        </Section>
      </ScrollableBox>
    </Sheet>
  );
};

export default SelectTopicImageSheet;

const StyledImageWrapper = styled.div`
  ${tw` w-60`}
`;
const UnsplashImage = (props: { image: PreviewImage }) => {
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
        tw="h-40 hover:scale-105 object-cover w-full transition-all rounded-xl"
      />
      <div tw="text-xs mt-2 text-secondary-text">
        by{' '}
        <a tw="hover:underline" href={image.creator.profileUrl} target="_blank" rel="noopener noreferrer">
          {image.creator.name}
        </a>
      </div>
    </StyledImageWrapper>
  );
};

const useUnsplashImages = (isVisible: boolean) => {
  const { selectedTopicTitle } = useSelectedTopic();
  const [images, setImages] = useState<PreviewImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (images.length > 0) return;

      if (isVisible && images.length === 0 && selectedTopicTitle) {
        const searchQueryPrompt = `Erstelle eine Unsplash-Suchanfrage für das um ein passendes Bild für das Thema "${selectedTopicTitle}" zu finden. Die Anfrage soll nicht länger als 3 Wörter sein und auf Unsplash vorhandene Bilder liefern.`;
        console.log('searchQueryPrompt', searchQueryPrompt);
        const searchQuery = await getCompletion(searchQueryPrompt);
        console.log('searchQuery', searchQuery);
        loadImagesFromUnsplash(searchQuery).then((images) => {
          setImages(JSON.parse(images));
        });
      }
    };

    fetchImages();
  }, [isVisible, selectedTopicTitle]);

  return images;
};
