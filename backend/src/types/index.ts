type Message = {
  timestamp: string;
  user: string;
};

type State = {
  timestamp: string;
  user?: string;
  isOpen: boolean;
  openTimestamp?: Date
  bootTimestamp: Date;
};
