
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps"

import ReactTooltip from "react-tooltip"
import { scaleLinear } from "d3-scale"
import { geoTimes } from "d3-geo-projection"
import { geoPath } from "d3-geo"
import './Map.css';



const cities = [
  { name: "India", coordinates: [78.9629,20.5937] },
  { name: "Singapore", coordinates: [103.8198,1.3521] },
  { name: "San Francisco", coordinates: [-122.4194,37.7749] },
  { name: "Sydney", coordinates: [151.2093,-33.8688] },
  { name: "Lagos", coordinates: [3.3792,6.5244] },
  { name: "Shanghai", coordinates: [121.4737,31.2304] },
  { name: "Buenos Aires", coordinates: [-58.3816,-34.6037] },
  { "name": "Mumbai", "coordinates": [72.8777,19.0760], "population": 17712000 },
  { "name": "Delhi", "coordinates": [77.1025,28.7041], "population": 24998000 },
  { "name": "Chennai", "coordinates": [80.2707,13.0827], "population": 16998000 },
  { "name": "Tokyo", "coordinates": [139.6917,35.6895], "population": 37843000 },
  { "name": "Jakarta", "coordinates": [106.8650,-6.1751], "population": 30539000 },
  { "name": "Manila", "coordinates": [120.9842,14.5995], "population": 24123000 },
  { "name": "Seoul", "coordinates": [126.9780,37.5665], "population": 23480000 },
  { "name": "Shanghai", "coordinates": [121.4737,31.2304], "population": 23416000 },
  { "name": "Karachi", "coordinates": [67.0099,24.8615], "population": 22123000 },
  { "name": "Beijing", "coordinates": [116.4074,39.9042], "population": 21009000 },
  { "name": "New York", "coordinates": [-74.0059,40.7128], "population": 20630000 },
  { "name": "Guangzhou", "coordinates": [113.2644,23.1291], "population": 20597000 },
  { "name": "Sao Paulo", "coordinates": [-46.6333,-23.5505], "population": 20365000 },
  { "name": "Mexico City", "coordinates": [-99.1332,19.4326], "population": 20063000 },
]



const cityScale = scaleLinear()
  .domain([0,37843000])
  .range([1,25])

const popScale = scaleLinear()
  .domain([0,100000000,1400000000])
  .range(["#CFD8DC","#607D8B","#37474F"])

class BasicMap extends Component {
  static defaultProps = {
    width: 1000,
    height: 450,
  }
  constructor() {
    super()
    this.state = {
      center: [0,0],
      zoom: 1,
      show:false,
      currentCountry: null,
      cities  :[
        {name:"madurai",cooridnates:[78.1198,9.9252],population:"15.6L"},
        {name:"chennai",cooridnates:[ 80.2707,13.0827],population:"70.9L"},
        {name:"trichy",cooridnates:[78.7047,10.7905],population:"9.1L"},
        {name:"coimbatore",cooridnates:[76.9558,11.0168],population:"16.0L"},
        {name:"thirunelveli",cooridnates:[77.7567,8.7139],population:"4.75L"}
      ]    
      
    }
    this.projection = this.projection.bind(this)
    this.handleGeographyClick = this.handleGeographyClick.bind(this)
  }
  projection() {
    return geoTimes()
      .translate([this.props.width/2, this.props.height/2])
      .scale(160)
  }
  handleGeographyClick(geography) {
    
    // geography looks something like this:
    // { type: "Feature",  properties: {...}, geometry: {...} }
    if (this.state.currentCountry === geography.properties.iso_a3) {
      return this.setState({
        center: [0,0],
        zoom: 1,
        currentCountry: null,
        show:!this.state.show
      });
    }

    const path = geoPath().projection(this.projection());
    const center = this.projection().invert(path.centroid(geography));

    //calculate zoom level
    const bounds = path.bounds(geography);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const zoom = 0.9 / Math.max(dx / this.props.width, dy / this.props.height);

    this.setState({ 
      center, 
      zoom , 
      currentCountry: geography.properties.iso_a3, 
      show: true
    });
  }
  componentDidMount() {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 100)
  }
  
  
  render() {
    return (
      
        <div className="total">
        <ComposableMap
          
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
         
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "100%",
          }}
          >
          
          <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
            <Geographies geography={ "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/examples/choropleth-map/static/world-50m-with-population.json" }>
              {(geographies, projection) => 
              geographies.map((geography, i) => geography.id !== "010" && (
                <Geography
                  key={ i }
                  data-tip={geography.properties.labelrank  +'.'+  geography.properties.name}
                  geography={ geography }
                  projection={ projection }
                  style={{
                    default: {
                      fill: popScale(geography.properties.pop_est),
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#263238",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                  onClick={this.handleGeographyClick} 
                /> 
              ))} 
            </Geographies>
            {
                this.state.show ?
            <Markers>
                  {cities.map((city, i) => (
                    <Marker
                      key={i}
                      marker={city}
                      >
                      <circle
                        cx={0}
                        cy={0}
                      r={cityScale(city.population)*1.7}
                      fill="#b3f0ff"
                      stroke="#007a99"
                      strokeWidth="2"
                      />
                    </Marker>
                  ))}
                </Markers>:null
                }
          </ZoomableGroup>
       
        </ComposableMap>
        
        <ReactTooltip />
        </div>
      
    )
  }
}

export default BasicMap
