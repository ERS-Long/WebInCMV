# WebMapInCMV
Example to test WebMap in CMV

1. Used some global variables, will need to figure out how to avoid that
2. Topic in the mapDeferred.then does not get fired, dont know why (that is why i have to use the global variable to pass the value to the Layer and Legend widgets)   
3. Tried to use the CMV Legend  and Layer Control, but no luck, so created WebMap Legend and WebMap Layer widget.
4. Seems the webmaps all have basemap already, so the we can turn the CMV basemap off if using WebMap.

![alt tag](/WebMapInCMV.png)


