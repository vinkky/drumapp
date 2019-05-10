import axios from "axios";

export const response = (response, platform) => {
  let access_token = platform == "google" ? response.Zi.access_token : response.accessToken;
  return axios
    .post(`http://localhost:5000/users/oauth/${platform}`, {
      access_token
    });
};