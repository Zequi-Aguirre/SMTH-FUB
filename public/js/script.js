document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("SMTH-FUB JS imported successfully!");
  },
  false
);

const agents = [
  "Elizabeth Ibanez",
  "Adamaria Palma",
  "Adrian Bartyczak",
  "Alain Phard",
  "Alvina Nosikovsky",
  "Charles Nguyen",
  "Chris Ovalles",
  "Daniela Reynaldo",
  "Deals SMTH",
  "Dispo Test Lender",
  "Eric Angre",
  "Hubert Mendoza",
  "Info Sellmethehouse",
  "Isabella Foster Villanueva",
  "Ivette Morillo",
  "Jairo Mercado",
  "Jenna Kuhlen",
  "Jennifer Boese",
  "Lidia Reyes",
  "Luis Javier",
  "Miguel Martinez",
  "Rocio Guzman",
  "Rosella Roque",
  "Shannon Garner",
  "Support Sellmethehouse",
  "Wilman Lopez",
  "Zequi Aguirre",
];

const stages = [
  "Buyer",
  "Lead",
  "Hot Prospect",
  "Motivated Seller",
  "Needs an agent",
  "Motivated (Low Motivation)",
  "Motivated Seller (late or weekend)",
  "Offer Sent",
  "Nurture",
  "SMTH contract completed",
  "Canceled Contract",
  "Closed",
  "Trash",
  "Not interested",
];

const agentsList = document.querySelector("#agent");
const stagesList = document.querySelector("#stage");

agents.forEach((agent) => {
  agentsList.innerHTML += `<option value='${agent}'>${agent}</option>`;
});

stages.forEach((stage) => {
  stagesList.innerHTML += `<option value='${stage}'>${stage}</option>`;
});
