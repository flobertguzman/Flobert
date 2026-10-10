import { Composition, Folder } from "remotion";
import { Reel, T } from "./Reel";
import { reels } from "./reels";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="El-Diego-Octubre">
      {Object.entries(reels).map(([id, props]) => (
        <Composition
          key={id}
          id={id}
          component={Reel}
          durationInFrames={T.total}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={props}
        />
      ))}
    </Folder>
  );
};
