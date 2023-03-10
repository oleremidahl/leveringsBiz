import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../css/GMapStyles.css';

declare const google: any;

interface relInf {
  selectedLocation: any | null;
  formattedAdress: string;
  distancePrice: number | undefined;
  selectedOption: string;
}

function GoogleMapComponent(props: any) {
  
  const containerStyle = {
    maxWidth: '400px',
    height: '400px',
    border: 'thin solid black'
  };
  
  const center = {
    lat: 58.0243,
    lng: 7.44919
  };
  const [location, setLocation] = useState(center);
  const [map, setMap] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [relevantInfo, setRelevantInfo] = useState<relInf>({
    selectedLocation: null,
    formattedAdress: '',
    distancePrice: undefined,
    selectedOption: 'Bil'
  })

  useEffect(() => {
    if(relevantInfo.selectedLocation){
      props.onRetrievedVariables(relevantInfo.selectedLocation, relevantInfo.selectedOption, relevantInfo.formattedAdress, relevantInfo.distancePrice);

    }
  }, [relevantInfo]);

  
const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaJL0qOKJmBO_DJeYZWa-WrrDfaAqv6xo",
  });

//MAP -----------------------
  const onMapLoad = (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(location);
    setMap(map);
    map.setZoom(13);
  };
  
  useEffect(() => {
    if(relevantInfo.selectedLocation) {
      geocodeLatLng(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng);
      if(relevantInfo.selectedOption) calculateDistanceAndPrice(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng, relevantInfo.selectedOption);
    }
  }, [relevantInfo.selectedLocation]);

  // useEffect(() => {
  //   if(selectedOption && selectedLocation) {
  //     calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
  //   }
  // })

  // let autocomplete: google.maps.places.Autocomplete;
  // useEffect(() => {
  //   if (isLoaded) {
  //     // const input = document.getElementById('search-input');
  //     // if (input) {
  //   autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-input') as HTMLInputElement, {
  //       componentRestrictions: { administrativeArea: 'NO-42'}, 
  //       fields: ['name']
  //     });
    
  //   autocomplete.addListener('place_changed', onPlaceChanged);
  //   }
  // }, []);
  
  
  
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    // if (event.latLng && event.latLng && google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)){
      //       setSelectedLocation({
        //         lat: event.latLng.lat(),
        //         lng: event.latLng.lng()
        //       });
        //       console.log('Eveeeeent',event.latLng.lat())
        //     } 
        // else(console.log("Falseeeee"))
      };

//GEOCODING -----------------------
  const findPos = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(latitude, longitude), bermudaTriangle)){
          const newRelInf = {...relevantInfo, selectedLocation: { lat: latitude, lng: longitude }}
          // setSelectedLocation();
          setRelevantInfo(newRelInf);
          geocodeLatLng(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng);
        }
        else {
          alert("Du befinner deg utenfor v??rt leveringsomr??de.")
        }
      },
      (error) => {
        alert("Det ser ut til at du har deaktivert stedstjenester. Du kan enten aktivere dette eller finne din lokasjon manuelt.")
        console.error(error);
      }
      );
  };
      
  const geocoder = new google.maps.Geocoder();
  function geocodeLatLng(lat: number, lng: number) {
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), bermudaTriangle)){
      geocoder
        .geocode({ location: {lat: lat, lng: lng } })
        .then((response: { results: any[]; }) => {
          if (response.results[0]) {
            // map.setZoom(13);
            const newRelInf = {...relevantInfo, formattedAdress: response.results[0].formatted_address }
            setRelevantInfo(newRelInf);
            // setFormattedAdress(response.results[0].formatted_address);
          } else {
            alert("No results found");
          }
        })
        .catch((e: string) => alert("Geocoder failed due to: " + e));
    }
  }

  function calculateDistanceAndPrice(lat: number, lng: number, car: string) {
    const referencePoint = { lat: 58.021697654760224 * (Math.PI/180), lng: 7.455554489881608 * (Math.PI/180)};
    
    const distanceInRadians = (
      Math.acos(
        Math.sin(referencePoint.lat) * Math.sin(lat * (Math.PI/180)) +
        Math.cos(referencePoint.lat) * Math.cos(lat * (Math.PI/180)) *
        Math.cos((lng * (Math.PI/180)) - referencePoint.lng)
      )
    );
  
    var km = (distanceInRadians * 6371);
    console.log('Avstaaaaand',km);
    var mult = 3;
    if (car === 'Bil') mult = 2;

    if (km){
      var drivingTime = mult * km;
      if (drivingTime > 25) drivingTime = drivingTime * 2;
      else if (drivingTime > 20) drivingTime = drivingTime * 1.75;
      else if (drivingTime > 15) drivingTime = drivingTime * 1.5;
      const newRelInf = {...relevantInfo, distancePrice: Math.round(250 + (((drivingTime * 2)/60)*500)) }
      setRelevantInfo(newRelInf);
      // setDistancePrice(Math.round(250 + (((drivingTime * 2)/60)*500)))
    }
  }

  const handleSelectChange = (event: any) => {
    const newRelInf = {...relevantInfo, selectedOption: event.target.value }
    setRelevantInfo(newRelInf);
    // setSelectedOption(event.target.value);
    if(relevantInfo.selectedLocation){
      calculateDistanceAndPrice(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng, relevantInfo.selectedOption)
    }
  }

// PERIMETER ---------------------------
  const latLngPaths = [
    { lat: 58.013895, lng: 7.668140 },
    { lat: 58.051737, lng: 7.706315 },
    { lat: 58.127733, lng: 7.536405 },
    { lat: 58.048022, lng: 7.196158},
    { lat: 57.988490, lng: 7.341362},
    { lat: 57.965142, lng: 7.493917}
  ]

  const bermudaTriangle = new google.maps.Polygon({
    paths: latLngPaths,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0,
  });

  bermudaTriangle.setMap(map);
  bermudaTriangle.addListener('click', (event: google.maps.MapMouseEvent) => {
    if (event.latLng && event.latLng && google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)) {
      const newRelInf = {...relevantInfo, selectedLocation: { lat: event.latLng.lat(), lng: event.latLng.lng() }}
      // setSelectedLocation();
      setRelevantInfo(newRelInf);
        // if(selectedOption) calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
    } 
});

//SEARCHBAR -------------------

//   const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(event.target.value);
//   };

//  function onPlaceChanged(){
//     const place = autocomplete.getPlace();
//     if (!place.geometry) {
//      const searchBar = document.getElementById('search-bar') as HTMLInputElement;
//      if (searchBar) searchBar.placeholder = "S??k etter din adresse";
//     }
//     else {
//       if(place.formatted_address){
//         setSearchInput(place.formatted_address)
//       }
//     }
//   }
    // const { lat, lng } = place.geometry.location;
    // setSelectedLocation({ lat, lng });

  // if (loadError) return 'Error loading maps';
  // if (!isLoaded) return 'Loading Maps';
  // const MapWrapped = withScriptjs(withGoogleMap((props) =>{}
  // onChange={handleSearchInputChange} value={searchInput}
  // const handleChange = (value: any) => {
  //   setSearchInput(value)
  // }

  // const handleSelect = (value: any) => {
  //   setSearchInput(value)
  // }

  return (
    <>
    {!isLoaded || loadError ? (
      <p>Laster kart...</p>
    ):
    
      <div>
        {/* <input id="search-bar" type="text" placeholder="S??k etter din adresse" /> */}
        {/* <PlacesAutocomplete
          value={searchInput}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "S??k etter din adresse...",
                })}
              />
              <div>
                {loading && <div>Laster...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: "#a83232", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete> */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location || center}
          zoom={8}
          options={{ streetViewControl: false }}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
          {relevantInfo.selectedLocation && (
            <MarkerF
              position={relevantInfo.selectedLocation}
            />
          )}
        </GoogleMap><br/>
        <button className="submitBtn" onClick={() => findPos()}>Klikk for ?? finne min posisjon</button>
        {relevantInfo.selectedLocation && <p>{relevantInfo.formattedAdress}</p>}
        <p style={{marginBottom: '10px'}}>Destinasjonen kan n??s med: </p>
        <div className='select'>
          <select onChange={handleSelectChange}>
            <option value="Bil">Bil</option>
            <option value="B??t">B??t</option>
          </select>
          <div className="select__arrow"></div>
        </div>
        
        {/* {relevantInfo.distancePrice && <p>Pris for levering: {relevantInfo.distancePrice} kr</p>} */}
      </div>
    }</>
  );
}

export default GoogleMapComponent;
