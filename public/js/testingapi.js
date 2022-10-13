const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.followupboss.com/v1/users?limit=50&offset=0&sort=name&includeDeleted=false",
  headers: {
    "X-System": "Zequi-Buyer-App",
    "X-System-Key": "a3c62a5b90680ec768a39c14b366b2b3",
    accept: "application/json",
    authorization: "Basic ZmthXzE4b3NMSVVsOUtSWWdOUkgxUTJYUWh0TlZ1MG5SeFE3Tkc6",
  },
};

axios
  .request(options)
  .then(function (response) {
    let users = Object.values(response.data.users);

    users.forEach((user) => {
      console.log(user.name);
    });
  })
  .catch(function (error) {
    console.error(error);
  });
