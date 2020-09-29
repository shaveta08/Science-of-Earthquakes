# Science-of-Earthquakes
The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.
They collect a massive amount of data from all over the world each day.
We have used earthquake data of past 7 days to visulaize using leaflet and mapbox.

## Level- 1
### Visulaization of EarthQuakes with their depth and magnitude
* Importing the data: The USGS provides earthquake data in a number of different formats, updated every 5 minutes. You can checkout the Dataset [here](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
* Visualize the Data: 
  - Created a map using Leaflet that plots all of the earthquakes from our data set based on their longitude and latitude.
  - Our data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. 
  - Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker in color.
  - Every Marker is bounded with the popup that provide additional information about the earthquake when a marker is clicked.
  - Created a legend that would provide context our map data.
  ![alt-text]()
  
 ## Level - 2
 ### Visulaization of Tectonic plates and seismic activity
 * Importing the data: Pulled the data in a second data set for visualising it along side your original set of data. Data on tectonic plates can be found [here](https://github.com/fraxen/tectonicplates).
 * Visualize the Data: 
  - Plotting a second data set on our map.
  - Adding a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.
  - Adding layer controls to our map.
![alt-text]()

## Level - 3 
### Visulaization of Basic Earthquake Data using Clusters and HeatMap Plugins.
* Adding more overlays to the map by creating cluster of earthquake dataset.
* Also Adding Heatmap to visulaze the earthquake dataset.


