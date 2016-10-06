define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/aspect',
    'dojo/on',
    'dojo/text!./TopicsWatch/templates/TopicsWatch.html',
    'dojo/topic',
    'xstyle/css!./TopicsWatch/css/TopicsWatch.css',
    'dojo/dom-construct'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, lang, arrayUtils, dom, ready, aspect, on, template, topic, css, domConstruct) {
    var map;
    var clickmode;
    var drawToolbar;
    var theGeometry;
    var xCenter;
    var yCenter;
    var normalizedValMin;
    var normalizedValMax;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: 'CurrentExtent',
        map: true,
        widgetsInTemplate: true,
        templateString: template,
        mapClickMode: null,

        postCreate: function(){
            drawExtentOn = 0;
            this.inherited(arguments);
            map = this.map;

            if (this.parentWidget) {
                if (this.parentWidget.toggleable) {
                    this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                        this.onLayoutChange(this.parentWidget.open);
                    })));
                }
            }

 
            aspect.after(topic, 'subscribe', function (topicName) {
                // Create a map of subscribed topics
                // The map simplifies ensuring unique elements in the array
                topic.subscriptionMap = topic.subscriptionMap || {};

                if (!topic.subscriptionMap[topicName]) {
                    topic.subscriptionMap[topicName] = true;
                    // Create an array of subscribed topics
                    topic.subscriptions = topic.subscriptions || [];
                    topic.subscriptions.push(topicName);
                }
            }, true);

            // Listen to calls to topic.publish
            aspect.after(topic, 'publish', function (topicName) {
                topic.publishMap = topic.publishMap || {};

                if (!topic.publishMap[topicName]) {
                    topic.publishMap[topicName] = true;
                    topic.publications = topic.publications || [];
                    topic.publications.push(topicName);
                }
            }, true);            
        },

        onLayoutChange: function (open) {
          if (open) {
            document.getElementById('Topics').value = "";
            this.log2(topic.subscriptions, topic.publications)
            //this.ontopic.subscriptions, Open();

            console.log(this.map.getBasemap());  //basemapLayerIds
            console.log(this.map.basemapLayerIds);
      //      var lyrOpac = this.map.getLayer(this.map.basemapLayerIds[0]); //assuming your the layer is at 0 index. 
      //      lyrOpac.setOpacity(0.5); 

          } else {
            this.onClear();
          }
        },

        onSubscribedTopics: function()
        {
            this.log(topic.subscriptions);
        },

        onPublishedTopics: function()
        {
            this.log(topic.publications);
        },

        log: function (info) {
            //var node = document.createElement('div');
            //node.innerHTML = JSON.stringify(info);
            //document.body.appendChild(node);
            // console.log(JSON.stringify(info));
            var temp = JSON.stringify(info);
           // temp = temp.replace(',', '\n');
            temp = temp.split('[').join('[\n');
            temp = temp.split(']').join('\n]');
            temp = temp.split(',').join(',\n');
            document.getElementById('Topics').value = temp;
        },

        log2: function (info1, info2) {
            //var node = document.createElement('div');
            //node.innerHTML = JSON.stringify(info);
            //document.body.appendChild(node);
            // console.log(JSON.stringify(info));
            document.getElementById('Topics').value = 'Current Subscribed Topics:\n';
            var temp = JSON.stringify(info1);
           // temp = temp.replace(',', '\n');
            temp = temp.split('[').join('[\n');
            temp = temp.split(']').join('\n]');
            temp = temp.split(',').join(',\n');

            document.getElementById('Topics').value += temp;

            document.getElementById('Topics').value += '\n';
            document.getElementById('Topics').value += '\n';

            document.getElementById('Topics').value += 'Current Published Topics:\n';
            temp = JSON.stringify(info2);
           // temp = temp.replace(',', '\n');
            temp = temp.split('[').join('[\n');
            temp = temp.split(']').join('\n]');
            temp = temp.split(',').join(',\n');
            document.getElementById('Topics').value += temp;            
        },

        onClear: function()
        {
            document.getElementById('Topics').value = "";
        }

    });
});