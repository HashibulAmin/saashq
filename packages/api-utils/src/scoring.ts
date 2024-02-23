export const updateUserScore = async (models, _id: string, amount: number) => {
  await models.Users.updateOne({ _id }, { $inc: { score: amount } });
};

export const getScoringConfig = async (
  models,
  action: string,
  earnOrSpend: 'earn' | 'spend'
) => {
  const shq = await models.Shqs.findOne();

  if (!shq) {
    return null;
  }

  const scoringConfig = (shq.scoringConfig || []).find(
    (config) => config.action === action && config.earnOrSpend === earnOrSpend
  );

  return scoringConfig;
};
