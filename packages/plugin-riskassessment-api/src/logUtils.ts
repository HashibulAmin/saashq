import { putActivityLog as commonPutActivityLog } from '@saashq/api-utils/src/logUtils';
export const putActivityLog = async (
  subdomain,
  params: { action: string; data: any },
) => {
  const { data } = params;

  const updatedParams = {
    ...params,
    data: { ...data, contentType: `cards:${data.contentType}` },
  };

  return commonPutActivityLog(subdomain, {
    ...updatedParams,
  });
};
