#!/usr/bin/env node

(function () {
    "use strict";

    const WEBSERVER_DEFAULT_PORT = 3000;
    let port = process.env.PORT || WEBSERVER_DEFAULT_PORT;

    let secretManagement = require("./SecretManagement");
    secretManagement.tryLoadSecrets();

    let express = require("express");
    let app = express();

    app.disable("etag");

    app.use(express.static(__dirname + '/Website'));

    let catalogApi = require("./CatalogApi");
    app.use("/api/catalog", catalogApi.createRouter());

    let entitlementService = require("./EntitlementService");
    app.use("/api/authorization", entitlementService.createRouter());

    app.listen(port);

    console.log("The website is now available at http://localhost:" + port);
    console.log("Press Control+C to shut down the application.");
})();