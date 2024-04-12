export default {
  contentTypes: [
    {
      type: 'user',
      description: 'Člen týmu',
      esIndex: 'users',
    },
  ],

  esTypesMap: async () => {
    return { data: { typesMap: {} }, status: 'success' };
  },

  initialSelector: async () => {
    const negative = {
      term: {
        status: 'deleted',
      },
    };

    return { data: { negative }, status: 'success' };
  },
};
