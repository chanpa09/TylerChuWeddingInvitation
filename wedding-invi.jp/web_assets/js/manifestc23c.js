var setManifestURL = function (rootUrl, startUrl) {
    var manifest = {
        "name": "楽々！ウェディング招待状",
        "background_color": "#FFFFFF",
        "short_name": "Wedding招待状",
        "orientation": "portrait",
        "display": "browser",
        "start_url": startUrl,
        "icons": [
            {
                "src": rootUrl + "/android-launchericon-72-72.png",
                "sizes": "72x72",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-96-96.png",
                "sizes": "96x96",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-128-128.png",
                "sizes": "128x128",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-144-144.png",
                "sizes": "144x144",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-192-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-384-384.png",
                "sizes": "384x384",
                "type": "image/png"
            },
            {
                "src": rootUrl + "/android-launchericon-512-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }

    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#l_manifest').setAttribute('href', manifestURL);
}