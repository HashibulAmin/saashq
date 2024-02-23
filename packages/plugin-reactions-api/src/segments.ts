export default {
  dependentServices: [{ name: 'shqfeed', twoWay: true }],

  contentTypes: [
    {
      type: 'emojis',
      description: 'Emojis',
      sIndex: 'emojis',
      hideInSidebar: true
    },
    {
      type: 'comments',
      description: 'Commnents',
      sIndex: 'comments',
      hideInSidebar: true
    }
  ]
};
