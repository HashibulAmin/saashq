import graphqlPubsub from '@saashq/api-utils/src/graphqlPubsub';
import { IModels } from './connectionResolver';
import { sendInboxMessage } from './messageBroker';
import { getOrCreateCustomer } from './store';

const receiveCall = async (
  models: IModels,
  subdomain: string,
  params,
  user,
) => {
  const integration = await models.Integrations.findOne({
    inboxId: params.inboxIntegrationId,
  }).lean();

  const inboxIntegration = await sendInboxMessage({
    subdomain,
    action: 'integrations.findOne',
    data: { _id: integration?.inboxId },
    isRPC: true,
    defaultValue: null,
  });

  if (!integration) {
    throw new Error('Integrace nenalezena');
  }

  params.recipientId = integration.phone;
  const { primaryPhone, recipientId, direction, callID } = params;

  const customer = await getOrCreateCustomer(models, subdomain, params);

  // get conversation
  let conversation = await models.Conversations.findOne({ callId: callID });

  if (!conversation) {
    try {
      conversation = await models.Conversations.create({
        callId: callID,
        senderPhoneNumber: primaryPhone,
        recipientPhoneNumber: recipientId,
        integrationId: inboxIntegration._id,
      });
    } catch (e) {
      throw new Error(
        e.message.includes('duplicate')
          ? 'Souběžný požadavek: duplikace konverzace'
          : e,
      );
    }
  }

  let history = await models.CallHistory.findOne({ callId: callID });
  if (!history) {
    try {
      const newHistory = new models.CallHistory({
        sessionId: callID,
        callerNumber: primaryPhone,
        receiverNumber: recipientId,
        callType: direction,
        createdAt: new Date(),
        createdBy: user._id,
        updatedBy: user._id,
        callDuration: 0,
      });

      try {
        await newHistory.save();
      } catch (error) {
        console.error('Při ukládání historie hovorů došlo k chybě:', error);
      }
    } catch (e) {
      throw new Error(
        e.message.includes('duplicate')
          ? 'Souběžný požadavek: duplikace hovoru'
          : e,
      );
    }
  }

  // save on api
  try {
    const apiConversationResponse = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          customerId: customer.saashqApiId,
          integrationId: integration.inboxId,
          content: direction || '',
          conversationId: conversation.saashqApiId,
          updatedAt: new Date(),
          owner: user._id,
        }),
      },
      isRPC: true,
    });

    conversation.saashqApiId = apiConversationResponse._id;

    await conversation.save();
  } catch (e) {
    await models.Conversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }

  const channels = await sendInboxMessage({
    subdomain,
    action: 'channels.find',
    data: {
      integrationIds: { $in: [inboxIntegration._id] },
    },
    isRPC: true,
  });

  for (const channel of channels) {
    for (const userId of channel.memberIds || []) {
      graphqlPubsub.publish(
        `conversationClientMessageInserted:${subdomain}:${userId}`,
        {
          conversationClientMessageInserted: {
            _id: Math.random().toString(),
            content: 'nová grandstreamová zpráva',
            createdAt: new Date(),
            customerId: customer.saashqApiId,
            conversationId: conversation.saashqApiId,
          },
          conversation,
          integration: inboxIntegration,
        },
      );
    }
  }

  return customer;
};

export default receiveCall;
