(function () {
	"use strict";

	let express = require("express");
	let videoDatabase = require("./VideoDatabase");
	let secretManagement = require("./SecretManagement");
	let jwt = require("jsonwebtoken");
	let crypto = require("crypto");
	let uuid = require("node-uuid");
	let moment = require("moment");

	const NO_SUCH_VIDEO_STATUS_CODE = 400;
	const NEED_TO_KNOW_SECRETS_STATUS_CODE = 500;

	module.exports = {
		"createRouter": function createRouter() {
			let router = express.Router();

			
			router.get("/:videoName", function processGet(request, response) {
				
				response.header("Cache-Control", "no-cache");

				let video = videoDatabase.getVideoByName(request.params.videoName);

				if (!video) {
					response.status(NO_SUCH_VIDEO_STATUS_CODE).send("No such video");
					return;
				}


				if (video.licenseToken) {
				
					response.json(video.licenseToken);
					return;
				}

				if (!secretManagement.areSecretsAvailable()) {
					console.log("ERROR: You must configure the secrets file to generate license tokens.");
					response.status(NEED_TO_KNOW_SECRETS_STATUS_CODE)
						.send("You must configure the secrets file to generate license tokens.");
					return;
				}

				let secrets = secretManagement.getSecrets();
				let communicationKeyAsBuffer = Buffer.from(secrets.communicationKey, "base64");

				
				let now = moment();
				let validFrom = now.clone().subtract(1, "days");
				let validTo = now.clone().add(1, "days");

				
				let message = {
					"type": "entitlement_message",
					"version": 2,
					"license": {
						"start_datetime": validFrom.toISOString(),
						"expiration_datetime": validTo.toISOString(),
						"allow_persistence": true
					},

				
					"content_keys_source": {
						"inline": [
						]
					},
					
					
					"content_key_usage_policies": [
						{
							"name": "Policy A",
							"playready": {
								"min_device_security_level": 150,
								"play_enablers": [
									"786627D8-C2A6-44BE-8F88-08AE255B01A7"
								]
							}
						}
					]
				};
				video.keys.forEach(function (key) {
					
					let inlineKey = {
						"id": key.keyId,
						"usage_policy": "Policy A"		
					} 

					message.content_keys_source.inline.push(inlineKey);
				});

				let envelope = {
					"version": 1,
					"com_key_id": secrets.communicationKeyId,
					"message": message,
					"begin_date": validFrom.toISOString(),
					"expiration_date": validTo.toISOString()
				};

				console.log("Creating license token with payload: " + JSON.stringify(envelope));

				let licenseToken = jwt.sign(envelope, communicationKeyAsBuffer, {
					"algorithm": "HS256",
					"noTimestamp": true
				});

				response.json(licenseToken);
			});

			return router;
		}
	};
})();