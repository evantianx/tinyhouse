import { Client } from "@googlemaps/google-maps-services-js";
import { google } from "googleapis";

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = new Client();

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const parseAddress = (addressComponents: any) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes("country")) {
      country = component.long_name;
    }

    if (component.types.includes("administrative_area_level_1")) {
      admin = component.long_name;
    }

    if (
      component.types.includes("locality") ||
      component.types.includes("postal_town")
    ) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
};

export const Google = {
  authUrl: auth.generateAuthUrl({
    scope: scopes,
    access_type: "online",
  }),
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);

    auth.setCredentials(tokens);

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return { user: data };
  },

  geocode: async (address: string) => {
    // https proxy problem
    // requests to this API must be over SSL.
    try {
      const res = await maps.geocode({
        params: {
          key: `${process.env.G_GEOCODING_KEY}`,
          address,
        },
      });
      if (res.status < 200 || res.status > 299) {
        throw new Error("failed to geocode address");
      }

      return parseAddress(res.data.results[0].address_components);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
