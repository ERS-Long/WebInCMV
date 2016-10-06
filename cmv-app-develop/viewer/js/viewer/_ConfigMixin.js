define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Deferred'
], function (
    declare,
    lang,
    Deferred
) {

    return declare(null, {

        initConfigAsync: function () {
            var returnDeferred = new Deferred();
            // get the config file from the url if present
            var file = 'config/viewer',
                s = window.location.search,
                q = s.match(/config=([^&]*)/i);
            if (q && q.length > 0) {
                file = q[1];
                if (file.indexOf('/') < 0) {
                    file = 'config/' + file;
                }
            }
            require([file], function (config) {
                returnDeferred.resolve(config);
            });
            return returnDeferred;
        },

        initConfigSuccess: function (config) {
            this.config = config;

            if (config.isDebug) {
                window.app = this; //dev only
            }

            // setup the map click mode
            this.mapClickMode = {
                current: config.defaultMapClickMode,
                defaultMode: config.defaultMapClickMode
            };

            // in _LayoutMixin
            this.initLayout();

            if (config.webMap === "" || config.webMap === undefined)
            {
                // in _MapMixin                
                this.initMapAsync().then(
                    lang.hitch(this, 'initMapComplete'),
                    lang.hitch(this, 'initMapError')
                );                
            }
            else //use the Agol webmap
            {
                // in _WebMapMixin
                this.initWebMapAsync(config.webMap).then(
                    lang.hitch(this, 'initWebMapComplete'),
                    lang.hitch(this, 'initWebMapError')
                );
            }
        },

        initConfigError: function (err) {
            this.handleError({
                source: 'Controller',
                error: err
            });
        }
    });
});