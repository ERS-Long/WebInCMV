define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/_base/array',
    'dojo/Deferred',

    'esri/map',
    'esri/arcgis/utils',
    'esri/dijit/LayerList',
    'esri/dijit/Legend',
    'gis/dijit/LayerControl',
    'dojo/topic',

    'esri/IdentityManager'

], function (
    declare,
    lang,
    on,
    dom,
    array,
    Deferred,

    Map,
    esriUtils,
    LayerList,
    Legend,
    LayerControl,
    topic
) {
    var _map;
    var _layers;

    return declare(null, {

        initWebMapAsync: function (webMap) {
            var returnDeferred = new Deferred();
            var returnWarnings = [];

            this._createWebMap(webMap);

            return returnDeferred;
        },

        _createWebMap: function (webMap) {
            var container = dom.byId(this.config.layout.map) || 'mapCenter';

            var mapDeferred = esriUtils.createMap(webMap, container, {
                mapOptions: {
                    /*add options*/
                }
            });

            mapDeferred.then(lang.hitch(this, function(response) {
                this.clickHandler = response.clickEventHandle;
                this.clickListener = response.clickEventListener;
                this.map = response.map;

            //    window.__map = response.map;

            //    var legendLayers = esriUtils.getLegendLayers(response);    
            //    console.log(legendLayers);

                // var legend = new Legend({
                //     map: response.map
                // // where is layerInfo defined? 
                // // commented out so that the legend picks up whatever 
                // // is in the map
                // //   layerInfos: legendLayers
                // }, "myLegendList");
                // legend.startup(); 
                
/*
                var webMapLayerList = new LayerList({
                    map: response.map,
                    layers: esriUtils.getLayerList(response) 
                },"webMapLayerList");

                webMapLayerList.startup();  
*/                
                console.log(esriUtils.getLayerList(response));


                var layers = response.itemInfo.itemData.operationalLayers;

                // here i tried to use CMV LayerControl but no luck yet
                var layerInfo = [];
/*
                var index = 0;
                array.forEach(layers, function (layer){                   
                    layerInfo.push({
                        featureLayer: layer.layerObject,
                        type: 'feature',
                        options: {
                            id: 'webmaplayer' + index,
                            opacity: 1.0,
                            visible: true,
                            outFields: ['*'],
                            mode: 0
                        },
                    });
                    index++;
                });
                console.log(layerInfo);
                window.__layerinfo = layerInfo;
       

                var layerControl = new LayerControl({
                    map: response.map,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true,
                    layerInfos: layerInfo
                }, webMapLayerList);   
*/

                //using the default Layerlist
                //need to use topic to pass the info to the widget
                //_map = response.map;

                _layers = esriUtils.getLayerList(response);
                window.__layers = _layers;

                console.log('try to send topic');
                console.log(_layers);

                topic.publish('webmapLayerList/createLayerList', {
                    map: this.map,
                    layers: _layers
                });
                // Topic never fired, but why?

                //have to call the following two method here.
                this.createPanes();
                this.initWidgets();
            }));   
    
        },

        initWebMapComplete: function (warnings) {
            if (warnings && warnings.length > 0) {
                this.handleError({
                    source: 'Controller',
                    error: warnings.join(', ')
                });
            }

            this.map.on('resize', function (evt) {
                var pnt = evt.target.extent.getCenter();
                setTimeout(function () {
                    evt.target.centerAt(pnt);
                }, 100);
            });

            // in _LayoutsMixin
            this.createPanes();

            // in _WidgetsMixin
            this.initWidgets();
 
        },

        initWebMapError: function (err) {
            this.handleError({
                source: 'Controller',
                error: err
            });
        },

        resizeWebMap: function () {
            if (this.map) {
                this.map.resize();
            }
        },

        getWebMapHeight: function () {
            if (this.map) {
                return this.map.height;
            } else {
                return 0;
            }
        }
    });
});