import { getCurrentUrl } from "#factories/_drivers/base-actions.js";
import { SUB_DOMAIN } from "#settings";

const makeUrl = (subdomain) => {
  return `${process.env.HTTP}://${subdomain}.${process.env.DOMAIN}`;
};

const addBasicAuth = (subdomain) => {
  if (
    process.env.BASIC_AUTH_USER !== "" &&
    process.env.BASIC_AUTH_PASSWORD !== ""
  ) {
    return `${process.env.HTTP}://${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASSWORD}@${subdomain}.${process.env.DOMAIN}`;
  }

  return `${process.env.HTTP}://${subdomain}.${process.env.DOMAIN}`;
};

const getFullRouter = (path, notAuth = false, isSubDomain = SUB_DOMAIN) => {
  let subdomain = "";

  switch (isSubDomain) {
    case SUB_DOMAIN.ADMIN:
      subdomain = SUB_DOMAIN.ADMIN;
      break;
    default:
      subdomain = SUB_DOMAIN.EMPLOYEE;
  }

  const url = new URL(addBasicAuth(subdomain));
  if (notAuth) {
    return `${url.origin}/${path}`;
  }

  return `${url.href}${path}`;
};

const getFullAdminRouter = (path) => {
  const url = new URL(makeUrl(SUB_DOMAIN.ADMIN));

  return `${url.href}${path}`;
};

const prepareParamsUrl = async (driver, page, perPage) => {
  const url = await getCurrentUrl(driver);
  const newUrl = new URL(url);
  if (newUrl.searchParams.has("page")) {
    newUrl.searchParams.set("page", page);
  } else {
    newUrl.searchParams.append("per_page", perPage);
    newUrl.searchParams.append("page", page);
  }

  return newUrl;
};

export { getFullRouter, getFullAdminRouter, prepareParamsUrl };
