import http from '#factories/http.js';

async function getIpPublicFromThirdService(url = '') {
  try {
    const urlRequest = url === '' ? process.env.PUBLIC_IP_INFO_URL : url;
    const result = await http.get(urlRequest);
    return result.ip ? result.ip : '';
  } catch (error) {
    return '';
  }
}

async function getPublicIP() {
  if (process.env.APP_ENV === 'PRO' && process.env.PUBLIC_IP_APP !== '') {
    return process.env.PUBLIC_IP_APP;
  }

  let ip = await getIpPublicFromThirdService();
  if (ip === '') {
    // retry get public IP with different service endpoint
    ip = await getIpPublicFromThirdService(process.env.PUBLIC_IP_INFO_URL_SECOND);
  }

  return ip;
}

function generateFakeIp() {
  return (
    Math.floor(Math.random() * 255) +
    1 +
    '.' +
    Math.floor(Math.random() * 255) +
    '.' +
    Math.floor(Math.random() * 255) +
    '.' +
    Math.floor(Math.random() * 255)
  );
}

export { getIpPublicFromThirdService, getPublicIP, generateFakeIp };
