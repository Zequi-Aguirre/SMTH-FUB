const router = require("express").Router();
const axios = require("axios");

/* GET home page */
router.get("/new-buyer", (req, res, next) => {
  //   res.send("Hello");
  res.render("fub/upload-buyer");
});

router.post("/new-buyer", (req, res, next) => {
  console.log(req.body.agent);
  let formData = Object.keys(req.body);

  let userTags = [];
  formData.forEach((field) => {
    if (field.length === 2) {
      userTags.push(`Buyer State: ${field}`);
    }
  });

  // ========-=-=-==-=-=-=-=--=-= FUB UPLOAD ========-=-=-==-=-=-=-=--=-= //

  const options = {
    method: "POST",
    url: "https://api.followupboss.com/v1/events",
    headers: {
      "X-System": "Zequi-Buyer-App",
      "X-System-Key": "a3c62a5b90680ec768a39c14b366b2b3",
      accept: "application/json",
      "content-type": "application/json",
      authorization: process.env.FUBKEY,
    },
    data: {
      person: {
        contacted: false,
        emails: [{ isPrimary: false, value: req.body.email }],
        phones: [{ isPrimary: false, value: req.body.phonenumber }],
        tags: userTags,
        firstName: req.body.name,
        lastName: req.body.lastname,
        stage: req.body.stage,
        source: "ZequiApp",
        assignedTo: req.body.agent,
      },
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.redirect(
        `https://americanhomes777.followupboss.com/2/people/view/${response.data.id}`
      );
      //   console.log(response.data.id);
    })
    .catch(function (error) {
      res.send(error);
      console.error(error);
    });

  //   res.send(req.body.name);
});

module.exports = router;
