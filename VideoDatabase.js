(function () {
    "use strict";

    
    let allVideos = [
        
        {
            "name": "1",
            "url": "https://media.axprod.net/VTB/DrmQuickStart/AxinomDemoVideo-SingleKey/Encrypted_Cenc/Manifest.mpd",
            "licenseToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiNjllNTQwODgtZTllMC00NTMwLThjMWEtMWViNmRjZDBkMTRlIiwibWVzc2FnZSI6eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImxpY2Vuc2UiOnsiYWxsb3dfcGVyc2lzdGVuY2UiOnRydWV9LCJjb250ZW50X2tleXNfc291cmNlIjp7ImlubGluZSI6W3siaWQiOiIyMTFhYzFkYy1jOGEyLTQ1NzUtYmFmNy1mYTRiYTU2YzM4YWMiLCJ1c2FnZV9wb2xpY3kiOiJUaGVPbmVQb2xpY3kifV19LCJjb250ZW50X2tleV91c2FnZV9wb2xpY2llcyI6W3sibmFtZSI6IlRoZU9uZVBvbGljeSIsInBsYXlyZWFkeSI6eyJwbGF5X2VuYWJsZXJzIjpbIjc4NjYyN0Q4LUMyQTYtNDRCRS04Rjg4LTA4QUUyNTVCMDFBNyJdfX1dfX0.D9FM9sbTFxBmcCOC8yMHrEtTwm0zy6ejZUCrlJbHz_U",
        },
        {
            "name": "2",
            "url": "https://media.axprod.net/VTB/DrmQuickStart/AxinomDemoVideo-MultiKey/Encrypted_Cenc/Manifest.mpd",
            "licenseToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiNjllNTQwODgtZTllMC00NTMwLThjMWEtMWViNmRjZDBkMTRlIiwibWVzc2FnZSI6eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImxpY2Vuc2UiOnsiYWxsb3dfcGVyc2lzdGVuY2UiOnRydWV9LCJjb250ZW50X2tleXNfc291cmNlIjp7ImlubGluZSI6W3siaWQiOiJmM2Q1ODhjNy1jMTdhLTQwMzMtOTAzNS04ZGIzMTczOTBiZTYiLCJ1c2FnZV9wb2xpY3kiOiJUaGVPbmVQb2xpY3kifSx7ImlkIjoiNDRiMThhMzItNmQzNi00OTlkLThiOTMtYTIwZjk0OGFjNWYyIiwidXNhZ2VfcG9saWN5IjoiVGhlT25lUG9saWN5In0seyJpZCI6ImFlNmU4N2UyLTNjM2MtNDZkMS04ZTlkLWVmNGM0NjFkNDY4MSIsInVzYWdlX3BvbGljeSI6IlRoZU9uZVBvbGljeSJ9XX0sImNvbnRlbnRfa2V5X3VzYWdlX3BvbGljaWVzIjpbeyJuYW1lIjoiVGhlT25lUG9saWN5IiwicGxheXJlYWR5Ijp7InBsYXlfZW5hYmxlcnMiOlsiNzg2NjI3RDgtQzJBNi00NEJFLThGODgtMDhBRTI1NUIwMUE3Il19fV19fQ.DpwBd1ax4Z7P0cCOZ7ZJMotqVWfLFCj2DYdH37xjGxM",
        }
        
    ];

    function verifyVideoIntegrity(video) {
        if (!video)
            throw new Error("A video was expected but was not present.");
        if (!video.name || !video.name.length)
            throw new Error("A video is missing its name.");

        console.log("Verifying integrity of video definition: " + video.name);

        if (!video.url || !video.url.length)
            throw new Error("The video is missing its URL.");

        if (video.licenseToken && video.keys)
            throw new Error("The video has both a hardcoded license token and a content key list - pick only one.");
        if (!video.licenseToken && !video.keys)
            throw new Error("The video is missing the content key list.");

        if (video.keys) {
            if (!video.keys.length)
                throw new Error("The content key list for this video is empty.");

            video.keys.forEach(function verifyKey(item) {
                if (!item.keyId)
                    throw new Error("A content key is missing the key ID.");
            });
        }
    }

    allVideos.forEach(verifyVideoIntegrity);

    module.exports = {
        "getAllVideos": function getAllVideos() {
            return allVideos;
        },
        "getVideoByName": function getVideoByName(name) {
            return allVideos.find(function filter(item) {
                return item.name === name;
            });
        }
    };
})();