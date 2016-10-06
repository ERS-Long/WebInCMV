define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dojo/_base/lang',
    'dojo/aspect',
    'dijit/registry',
    'dojo/text!./webMapLayerList/templates/webMapLayerList.html',
    'dojo/topic',
    'esri/dijit/Legend',
    'esri/dijit/LayerList',
    'gis/dijit/LayerControl',
    'dojo/ready',    
    'xstyle/css!./webMapLayerList/css/webMapLayerList.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, lang, aspect, registry, template, topic, Legend, LayerList, LayerControl, ready, css) {
    var map;
    var webMapLayerList;
    var loaded = false;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: 'WebMapLayerList',
        map: true,
        widgetsInTemplate: true,
        templateString: template,

        postCreate: function(){
            this.inherited(arguments);
            map = this.map;

            if (this.parentWidget) {
                if (this.parentWidget.toggleable) {
                    this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                        this.onLayoutChange(this.parentWidget.open);
                    })));
                }
            }          

            //ready(this.createLayerList());
            this.createLayerList();
            //this.own(this.createLayerList());
            //this.own(lang.hitch(this, 'createLayerList'));
        },

        createLayerList: function()
        {
            console.log("in the receiver method");
            /*
            topic.subscribe('webmapLayerList/createLayerList', function (r)
            {
                console.log(r);
                var webMapLayerList = new LayerList({
                    map: r.map,
                    layers: r.layers 
                },"webMapLayerList");
                webMapLayerList.startup();                
            });
*/
            
            webMapLayerList = new LayerList({
                map: map,
                layers: window.__layers 
            },"webMapLayerList");

            setTimeout(function () {
                webMapLayerList.startup();
            }, 1);            

/*          does not work
            var layerControl = new LayerControl({
                map: map,
                separated: true,
                vectorReorder: true,
                overlayReorder: true,
                layerInfos: window.__layerinfo
            }, "webMapLayerList");  

*/             
        },

        onLayoutChange: function (open) {
            if (open)
            {
               // console.log(webMapLayerList);
                if (webMapLayerList != undefined)
                {
                    //webMapLayerList.startup(); 
                    if (!loaded)
                    {
                        this.createLayerList();
                        loaded = true;   
                    }                 
                }
                else
                {
                    this.createLayerList();
                }
            }
        },


    });
});