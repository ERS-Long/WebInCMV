define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dojo/_base/lang',
    'dojo/aspect',
    'dijit/registry',
    'dojo/text!./webMapLegend/templates/webMapLegend.html',
    'dojo/topic',
    'esri/dijit/Legend',
    'esri/dijit/LayerList',
    'dojo/ready',    
    'xstyle/css!./webMapLegend/css/webMapLegend.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, lang, aspect, registry, template, topic, Legend, LayerList, ready, css) {
    var map;
    var loaded = false;
    var legend;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: 'WebMapLegend',
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

            ready(this.createLayerLegend());
        },

        createLayerLegend: function()
        {
            legend = new Legend({
                map: this.map
                // where is layerInfo defined? 
                // commented out so that the legend picks up whatever 
                // is in the map
                //   layerInfos: legendLayers
            }, "webMapLegend");
            setTimeout(function () {
                legend.startup();
            }, 1);            

        },

        onLayoutChange: function (open) {
            if (open)
            {
                if (legend != undefined)
                {
                    if (!loaded)
                    {
                        this.createLayerLegend();
                        loaded = true;   
                    }                     
                }
                else
                {
                    this.createLayerLegend();
                }
            }            
        },


    });
});