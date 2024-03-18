// @ts-ignore
import * as telemetry from 'saashq-telemetry';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import redis from '@saashq/api-utils/src/redis';
import { IModels, generateModels } from '../connectionResolver';
import { getSubdomain, userActionsMap } from '@saashq/api-utils/src/core';
import { USER_ROLES } from '@saashq/api-utils/src/constants';
import fetch from 'node-fetch';

const generateBase64 = (req) => {
  if (req.user) {
    const userJson = JSON.stringify(req.user);
    const userJsonBase64 = Buffer.from(userJson, 'utf8').toString('base64');
    req.headers.user = userJsonBase64;
  }
};

export default async function userMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  // this is important for security reasons
  delete req.headers['user'];
  const url = req.headers['saashq-core-website-url'];
  const saashqCoreToken = req.headers['saashq-core-token'];

  if (Array.isArray(saashqCoreToken)) {
    return res.status(400).json({ error: `Multiple saashq-core-tokens found` });
  }

  if (saashqCoreToken && url) {
    try {
      const response = await fetch('https://saashq.org/check-website', {
        method: 'POST',
        headers: {
          'saashq-core-token': saashqCoreToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
        }),
      }).then((r) => r.text());

      if (response === 'ok') {
        req.user = {
          _id: 'userId',
          customPermissions: [
            {
              action: 'showIntegrations',
              allowed: true,
              requiredActions: [],
            },
            {
              action: 'showKnowledgeBase',
              allowed: true,
              requiredActions: [],
            },
            {
              action: 'showScripts',
              allowed: true,
              requiredActions: [],
            },
          ],
        };
      }
    } catch (e) {
      return next();
    }

    return next();
  }

  const appToken = (req.headers['saashq-app-token'] || '').toString();
  const subdomain = getSubdomain(req);

  let models: IModels;
  try {
    models = await generateModels(subdomain);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  if (appToken) {
    try {
      const { app }: any = jwt.verify(
        appToken,
        process.env.JWT_TOKEN_SECRET || '',
      );

      if (app && app._id) {
        const appInDb = await models.Apps.findOne({ _id: app._id });

        if (appInDb) {
          const permissions = await models.Permissions.find({
            groupId: appInDb.userGroupId,
            allowed: true,
          }).lean();

          const user = await models.Users.findOne({
            role: USER_ROLES.SYSTEM,
            groupIds: { $in: [app.userGroupId] },
            appId: app._id,
          }).lean();

          if (user) {
            const key = `user_permissions_${user._id}`;
            const cachedPermissions = await redis.get(key);

            if (
              !cachedPermissions ||
              (cachedPermissions && cachedPermissions === '{}')
            ) {
              const userPermissions = await models.Permissions.find({
                userId: user._id,
              });
              const groupPermissions = await models.Permissions.find({
                groupId: { $in: user.groupIds },
              });

              const actionMap = await userActionsMap(
                userPermissions,
                groupPermissions,
                user,
              );

              await redis.set(key, JSON.stringify(actionMap));
            }

            req.user = {
              _id: user._id || 'userId',
              ...user,
              role: USER_ROLES.SYSTEM,
              isOwner: appInDb.allowAllPermission || false,
              customPermissions: permissions.map((p) => ({
                action: p.action,
                allowed: p.allowed,
                requiredActions: p.requiredActions,
              })),
            };
          }
        }
      }

      generateBase64(req);

      return next();
    } catch (e) {
      console.error(e);

      return next();
    }
  }

  const token = req.cookies['auth-token'];

  if (!token) {
    return next();
  }

  try {
    // verify user token and retrieve stored user information
    const { user }: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET || '');

    const userDoc = await models.Users.findOne({ _id: user._id });

    if (!userDoc) {
      return next();
    }

    const validatedToken = await redis.get(`user_token_${user._id}_${token}`);

    // invalid token access.
    if (!validatedToken) {
      return next();
    }

    // save user in request
    req.user = user;
    req.user.loginToken = token;
    req.user.sessionCode = req.headers.sessioncode || '';

    const currentDate = new Date();
    const machineId: string = telemetry.getMachineId();

    const lastLoginDate = new Date((await redis.get(machineId)) || '');

    if (lastLoginDate.getDay() !== currentDate.getDay()) {
      redis.set(machineId, currentDate.toJSON());

      telemetry.trackCli('last_login', { updatedAt: currentDate });
    }

    const hostname = await redis.get('hostname');

    if (!hostname) {
      redis.set('hostname', process.env.DOMAIN || 'http://localhost:3000');
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
    } else {
      console.error(e);
    }
  }

  generateBase64(req);

  return next();
}
