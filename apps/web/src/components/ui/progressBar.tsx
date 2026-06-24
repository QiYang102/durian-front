import * as Progress from "@radix-ui/react-progress";

import "../../styles.css";

const ProgressBar = () => {
  return (
    <Progress.Root className="progress-bar">
      <Progress.Indicator className="progress-indicator" />
    </Progress.Root>
  );
};

export default ProgressBar;
