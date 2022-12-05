const router = require("express").Router();
const axios = require("axios");
const xlsx = require("xlsx");

/* GET home page */
router.get("/new-buyer", (req, res, next) => {
  //   res.send("Hello");
  res.render("fub/upload-buyer");
});

router.get("/report", (req, res, next) => {
  const workBook = xlsx.readFile("Test1.xlsx");
  const workBook2 = xlsx.readFile("Test2.xlsx");

  const workSheet = workBook.Sheets["New Data"];
  const workSheet2 = workBook2.Sheets["New Data"];

  const leadsForReport = xlsx.utils.sheet_to_json(workSheet);
  const callsForReport = xlsx.utils.sheet_to_json(workSheet2);

  let agents = [
    { name: "Isabella Foster Villanueva" },
    { name: "Lidia Reyes" },
    { name: "Wilman Lopez" },
    { name: "Jairo Mercado" },
    { name: "Chris Ovalles" },
    { name: "Alain Phard" },
  ];

  agents.forEach((agent) => {
    agent.callsFortheWeek = [];
    agent.leadsStageChanged = [];
    agent.leadsCalledTwiceDay1 = 0;
    agent.leadsCalled3DaysAfter = 0;

    let leadsFortheWeek = leadsForReport.filter((lead) => {
      // console.log(lead.assignedTo);
      // console.log(agent.name);
      if (lead.assignedTo === agent.name) {
        return lead.id;
      }
    });

    let leadsFortheWeekIds = leadsFortheWeek.map((lead) => {
      if (lead.stage !== "Lead") {
        agent.leadsStageChanged.push(lead);
      }
      // console.log(lead.assignedTo);
      // console.log(agent.name);
      return lead.id;
    });

    // console.log({ leadsFortheWeekIds });

    agent.leadsForTheWeek = leadsFortheWeek;

    // console.log({ leadsFortheWeekIds });

    callsForReport.forEach((call) => {
      if (leadsFortheWeekIds.includes(call.personId)) {
        agent.callsFortheWeek.push(call);
      }
      // console.log({ call: call.id });
    });

    agent.leadsForTheWeek.forEach((lead) => {
      // console.log(lead.created.substring(0, 10));
      let leadCalls = 0;
      agent.callsFortheWeek.forEach((call) => {
        if (
          lead.created.substring(0, 10) === call.created.substring(0, 10) &&
          lead.id === call.personId
        ) {
          leadCalls++;
          if (leadCalls >= 2) {
            // console.log(agent.leadsCalledTwiceDay1);
            agent.leadsCalledTwiceDay1++;
          }
        }

        for (let i = 1; i < 3; i++) {
          let nextDay =
            lead.created.substring(0, 8) + lead.created.substring(8, 10);

          if (
            lead.created.substring(0, 10) === call.created.substring(0, 10) &&
            lead.id === call.personId
          ) {
            console.log("lead.id");
            console.log(lead.id);
            console.log("call.personId");
            console.log(call.personId);
            console.log("test");
            console.log(new Date(nextDay));
          }
        }
      });
    });
  });

  //   res.send("Hello");
  // console.log(agent.name);
  let agentsSimplify = agents.map((agent) => {
    return {
      name: agent.name,
      leadsStageChanged: agent.leadsStageChanged.length,
      leadsForTheWeek: agent.leadsForTheWeek.length,
      callsFortheWeek: agent.callsFortheWeek.length,
      leadsCalledTwiceDay1: agent.leadsCalledTwiceDay1,
      leadsCalled3DaysAfter: agent.leadsCalled3DaysAfter,
    };
  });

  res.send(agentsSimplify);
  // res.send(agents);
});

router.get("/leads", (req, res, next) => {
  const workBook = xlsx.readFile("Test1.xlsx");

  const workSheet = workBook.Sheets["New Data"];

  const data = xlsx.utils.sheet_to_json(workSheet);

  console.log(data);

  let agents = [
    "Isabella Foster Villanueva",
    "Lidia Reyes",
    "Wilman Lopez",
    "Alain Phard",
    "Jairo Mercado",
    "Chris Ovalles",
  ];

  console.log("/leads");

  // ----0-0-0-0-0--0-0-0-0--0-00-0-0--00-0-0-0-0-0-00-0-0--0-
  let counter = 0;
  let i = setInterval(function () {
    // do your thing

    // ----0-0-0-0-0--0-0-0-0--0-00-0-0--00-0-0-0-0-0-00-0-0--0-
    const options = {
      method: "GET",
      url: `https://api.followupboss.com/v1/people?sort=created&limit=100&offset=0&lastActivityAfter=2022-11-28%2000%3A00%3A00&assignedTo=${agents[
        counter
      ].replace(" ", "%20")}&includeTrash=false&includeUnclaimed=false`,
      headers: {
        "X-System": "Zequi-Buyer-App",
        "X-System-Key": "a3c62a5b90680ec768a39c14b366b2b3",
        accept: "application/json",
        "content-type": "application/json",
        authorization: process.env.FUBKEY,
      },
    };
    console.log(agents[counter]);

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.people.length);
        console.log(agents[counter - 1]);
        const today = new Date();

        const days = 7;
        const lastWeek = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

        response.data.people.forEach((lead) => {
          console.log(lead.created);
          console.log(new Date(lead.created) > lastWeek);
          // console.log(lead.created);
        });

        const filteredLeads = response.data.people.filter((lead) => {
          const leadCreated = new Date(lead.created);

          // console.log(leadCreated < today);
          // console.log(today);
          // console.log(lastWeek);
          if (leadCreated > lastWeek) {
            // lead = {
            //   id: lead.id,
            //   name: lead.name,
            // };
            // console.log(leadCreated > lastWeek);
            return { lead };
          } else {
            // console.log(leadCreated > lastWeek);
            // return { lead };
          }
        });

        console.log(filteredLeads.length);

        filteredLeads.forEach((lead) => {
          data.push({
            id: lead.id,
            created: lead.created,
            name: lead.name,
            stage: lead.stage,
            agent: lead.assignedTo,
          });
        });

        let newWorkBook = xlsx.utils.book_new();
        let newWorkSheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, "New Data");
        xlsx.writeFile(newWorkBook, `./Test1.xlsx`);

        // res.send(data);
      })
      .catch(function (error) {
        console.error(error);
      });

    counter++;
    if (counter === agents.length) {
      setTimeout(() => {
        console.log("counter done");
        clearInterval(i);
        res.send("done");
      }, 1000);
    }
  }, 11000);

  //   res.send("Hello");
});

router.get("/calls", (req, res, next) => {
  const workBook = xlsx.readFile("Test1.xlsx");

  const workSheet = workBook.Sheets["New Data"];

  const data = xlsx.utils.sheet_to_json(workSheet);

  console.log(data);

  console.log("enter");
  console.log(new Date());

  const leadsIds = [];

  data.map((lead) => {
    leadsIds.push(lead.id);
  });
  const URL =
    "https://api.followupboss.com/v1/calls?limit=50&offset=0&personId=";

  let counter = 0;
  let i = setInterval(function () {
    // do your thing

    const options = {
      method: "GET",
      url: URL + leadsIds[counter],
      headers: {
        "X-System": "Zequi-Buyer-App",
        "X-System-Key": "a3c62a5b90680ec768a39c14b366b2b3",
        accept: "application/json",
        "content-type": "application/json",
        authorization: process.env.FUBKEY,
      },
      // timeout: 15000, // only wait for 2s
    };

    axios.request(options).then((res) => {
      console.log("call #: " + counter + " of " + data.length);
      console.log(new Date());

      let callResponses = res.data.calls;

      console.log({ callResponses });

      const workBook2 = xlsx.readFile("Test2.xlsx");

      const workSheet2 = workBook2.Sheets["New Data"];

      const data2 = xlsx.utils.sheet_to_json(workSheet2);

      let newData = data2;

      callResponses.forEach((call) => {
        newData.push(call);
      });

      let newWorkBook = xlsx.utils.book_new();
      let newWorkSheet = xlsx.utils.json_to_sheet(newData);
      xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, "New Data");
      xlsx.writeFile(newWorkBook, `./Test2.xlsx`);
    });

    counter++;
    if (counter === leadsIds.length) {
      setTimeout(() => {
        console.log("counter done");
        clearInterval(i);
        res.send("done");
      }, 1000);
    }
  }, 11000);
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
      // res.send(response);
    })
    .catch(function (error) {
      res.send(error);
      console.error(error);
    });

  //   res.send(req.body.name);
});

module.exports = router;
