export const BOTTOM_BAR_ITEMS = [
  { type: 'text', title: 'Text', icon: 'file' },
  { type: 'card', title: 'Kartu', icon: 'list-ul' },
  { type: 'quickReplies', title: 'Rychlé odpovědi', icon: 'plus-1' },
  { type: 'image', title: 'Obraz', icon: 'mountains' },
  { type: 'attachments', title: 'Přílohy', icon: 'attach' },
  { type: 'audio', title: 'Zvuk', icon: 'music-1' },
  { type: 'video', title: 'Video', icon: 'play-1' },
  { type: 'input', title: 'Vstup', icon: 'space-key' },
];

export const INITIAL_OBJ_ACTIONS = {
  text: {
    text: '',
    buttons: [],
  },
  image: {
    image: '',
  },
  card: {
    cards: [],
  },
  quickReplies: {
    quickReplies: [],
  },
  attachments: {
    attachments: [],
  },
  audio: {
    audio: '',
  },
  video: {
    video: '',
  },
  input: {
    input: {},
  },
};
