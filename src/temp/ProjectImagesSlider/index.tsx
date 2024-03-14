import React, { ReactElement, useEffect } from 'react';
import Stories from 'react-insta-stories';
import getImageUrl from '../../utils/getImageURL';
import { SliderImage } from '../../features/projects/components/PlantLocation/ImageSlider';
import { ProjectSingleImage } from './ProjectSingleImage';

interface Props {
  images: SliderImage[];
  height: number | string;
  imageSize: string;
  type: string;
}

const ProjectImagesSlider = ({ images, height, imageSize, type }: Props) => {
  const [slider, setSlider] = React.useState<ReactElement>();
  const projectImages: { content: () => ReactElement }[] = [];

  useEffect(() => {
    images.forEach((sliderImage) => {
      if (sliderImage.image) {
        const imageURL = getImageUrl(type, imageSize, sliderImage.image);

        projectImages.push({
          content: () => (
            <ProjectSingleImage
              type={type}
              imageURL={imageURL}
              sliderImage={sliderImage}
            />
          ),
        });
      }
    });
    setSlider(
      <Stories
        stories={projectImages}
        defaultInterval={7000}
        width={306} //to be replaced with 100%
        height={height}
        loop={true}
        progressContainerStyles={{
          position: 'absolute',
          bottom: 18,
          right: 18,
          left: 18,
          padding: '7px 0 5px 0',
          maxWidth: 270,
        }}
        progressStyles={{ background: '#27AE60', height: 3.35 }}
        progressWrapperStyles={{
          height: 3.35,
          background: 'rgba(255, 255, 255, 0.50)',
        }}
        storyContainerStyles={{ borderRadius: 13 }}
      />
    );
  }, [images]);

  return <>{slider}</>;
};

export default ProjectImagesSlider;
