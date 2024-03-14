"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScoringConfig = exports.updateUserScore = void 0;
const updateUserScore = async (models, _id, amount) => {
    await models.Users.updateOne({ _id }, { $inc: { score: amount } });
};
exports.updateUserScore = updateUserScore;
const getScoringConfig = async (models, action, earnOrSpend) => {
    const exm = await models.Exms.findOne();
    if (!exm) {
        return null;
    }
    const scoringConfig = (exm.scoringConfig || []).find((config) => config.action === action && config.earnOrSpend === earnOrSpend);
    return scoringConfig;
};
exports.getScoringConfig = getScoringConfig;
