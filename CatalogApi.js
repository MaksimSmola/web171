(function () {
	"use strict";

	let express = require("express");
	let videoDatabase = require("./VideoDatabase");

	module.exports = {
		"createRouter": function createRouter() {
			let router = express.Router();

		
			router.get("/videos", function processGet(request, response) {
			
				response.header("Cache-Control", "no-cache");
				
				let videoList = [];

				videoDatabase.getAllVideos().forEach(function mapVideo(video) {
				
					videoList.push({
						"name": video.name,
						"url": video.url,
						"tags": video.tags
					});
				});				

				response.json(videoList);
			});

			return router;
		}
	};
})();