let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

//Assertion style
chai.should();

chai.use(chaiHttp);

describe("-----------API CHECKS---------", () => {
  // Test the GET (By id) route
  describe("GET /getdetails/:id", () => {
    const taskId = 777;
    it("It should get PO details for the corresponding id.", (done) => {
      chai
        .request(server)
        .get("/getdetails/" + taskId)
        .end((err, response) => {
          response.should.have.status(200);
          // response.body.should.be.a("object");
          // response.body.should.have.property("ponumber");
          // response.body.should.have.property("date");
          // response.body.should.have.property("details");
          done();
        });
    });
  });
  // Test the GET API (by id)
  describe("GET /getdetails/:id", () => {
    const taskId = 0; // id that doesn't exist in database should not return anything
    it("It should not get PO details for the corresponding id.", (done) => {
      chai
        .request(server)
        .get("/getdetails/" + taskId)
        .end((err, response) => {
          response.should.have.status(404);
          //   response.body.should.be.a("object");
          //   response.body.should.have.property("ponumber");
          //   response.body.should.have.property("date");
          //   response.body.should.have.property("details");
          done();
        });
    });
  });

  //Test the POST route (by sending one po order)
  describe("POST /poDetails", () => {
    it("It should send PO details via post request.", (done) => {
      let data = {
        details: {
          po_id: "999",
          date: "2022-11-09",
          items: [
            {
              po_description: "Test Smart TV",
              amount: "999",
            },
            {
              po_description: "Test Smart Fan",
              amount: "1999",
            },
            {
              po_description: "Test Smart Cooler",
              amount: "2999",
            },
          ],
        },
      };
      chai
        .request(server)
        .post("/poDetails")
        .send(data)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          // response.body.should.have.property("po_id");
          // response.body.should.have.property('date');
          // response.body.should.have.property('details');
          done();
        });
    });
  });

  describe("UPDATE /poDetails/:id", () => {
    it("It should update the corresponding purchase order for id via PATCH.", (done) => {
      let details = [
        {
          description: "Test Smart TV",
          amount: "999",
          raisedAmount: "999",
          dmrNo: "201",
        },
        {
          description: "Test Smart Fan",
          amount: "1999",
          raisedAmount: "999",
          dmrNo: "202",
        },
        {
          description: "Test Smart Cooler",
          amount: "2999",
          raisedAmount: "999",
          dmrNo: "203",
        },
      ];

      let id = 999;
      chai
        .request(server)
        .patch("/poDetails/" + id)
        .send(details)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          //   response.body.should.have.property("po_id");
          //   response.body.should.have.property('date');
          //   response.body.should.have.property('details');
          done();
        });
    });
  });

  //Test the PATCH route

  // let username = "Code improve"
  // it("check string", () => {
  //     assert.typeOf(username, 'string');
  // })
});
