import { EntityProps } from "@leanscope/ecs-engine";
import { IdentifierProps } from "@leanscope/ecs-models";
import { Fragment } from "react/jsx-runtime";
import { DateAddedProps, TitleProps } from "../../../../app/additionalFacets";
import { View } from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";

import { useEffect, useRef } from "react";
import { dummyBase64Audio } from "../../../../base/dummyBase64Audio";
import { dummyBase64Image } from "../../../../base/dummyBase64Image";

interface Media {
  audio: string;
  image: string;
}

const createBase64Video = (photoUrl: string, audioUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        const base64Image = canvas.toDataURL("image/jpeg");

        const video = document.createElement("video");
        video.width = width;
        video.height = height;
        video.controls = true;

        const source = document.createElement("source");
        source.src = base64Image;
        source.type = "image/jpeg";
        video.appendChild(source);

        const audio = new Audio(audioUrl);
        audio.crossOrigin = "anonymous";

        audio.oncanplay = () => {
          const stream = canvas.captureStream();
          const audioStream = (audio as any).captureStream();

          stream.addTrack(audioStream.getAudioTracks()[0]);

          const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
          const chunks: BlobPart[] = [];

          recorder.ondataavailable = (event) => chunks.push(event.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const videoUrl = URL.createObjectURL(blob);
            resolve(videoUrl);
          };

          recorder.start();
          setTimeout(() => recorder.stop(), audio.duration * 1000);
        };
      };

      img.src = photoUrl;
    } else {
      reject(new Error("Canvas context is null"));
    }
  });
};

const LernvideoView = (props: TitleProps & DateAddedProps & EntityProps & IdentifierProps) => {
  const { entity } = props;
  const isVisible = useIsViewVisible(entity);

  const data: Media[] = [
    {
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      image: "https://picsum.photos/seed/picsum/1920/1080",
    },
    {
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      image: "https://picsum.photos/1920/1080",
    },

    {
      audio: dummyBase64Audio,
      image: dummyBase64Image,
    },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const createVideo = async () => {
      const photoUrl = data[0].image;
      const audioUrl = data[0].audio;

      try {
        createBase64Video(photoUrl, audioUrl, 640, 480)
          .then((videoUrl) => {
            if (videoRef.current) {
              videoRef.current.src = videoUrl;
            }
          })
          .catch((error) => {
            console.error("Error creating base64 video:", error);
          });
      } catch (error) {
        console.error("Error creating base64:", error);
      }
    };

    createVideo();
  }, []);

  return (
    <Fragment>
      <View visible={isVisible}>
        <img src={data[0].image} alt="Lernvideo" />
      </View>
    </Fragment>
  );
};

export default LernvideoView;
