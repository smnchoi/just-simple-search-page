import React, { useState, useEffect } from "react";
import "./App.css";
import "./Matrix.css";

const URL = "https://randomuser.me/api/?results=20";

const columns = [
  "City",
  "State",
  "Postcode",
  "Country",
  "Latitude",
  "Longitude",
];

interface ILocation {
  city: string;
  latitude: string;
  longitude: string;
  country: string;
  postcode: string;
  state: string;
  streetName: string;
  streetNumber: string;
}

function App() {
  // This state is saved initially, and never will be changed.
  const [fetchedLocations, setFetchedLocations] = useState<ILocation[]>([]);

  // This state is for rendering according to searchKeyword.
  const [locations, setLocations] = useState<ILocation[]>([]);

  // Used for search feature.
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch random location data
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Fetch then parse random location data from the URL
   */
  const loadData = async () => {
    const { results } = await fetch(URL).then((data) => data.json());

    const _fetchedLocations = results
      .map((item: any) => item.location)
      .map(
        // Flatten the original data
        (location: {
          city: string;
          coordinates: { latitude: string; longitude: string };
          country: string;
          postcode: string | number;
          state: string;
          street: { name: string; number: number };
        }) => ({
          city: location.city,
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          country: location.country,
          postcode: String(location.postcode),
          state: location.state,
          streetName: location.street.name,
          streetNumber: location.street.number,
        })
      );

    setFetchedLocations(_fetchedLocations);
    setLocations(_fetchedLocations);
  };

  /**
   * Search data according to the keyword
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    // console.log("keyword", keyword);
    setSearchKeyword(keyword);

    // Show all location data if there is no any keyword
    if (keyword === "") {
      setLocations(fetchedLocations);
      return;
    }

    // Filter locations that contains the keyword
    const filteredLocations = locations.filter(
      (location) =>
        location.city.toLowerCase().includes(keyword.toLowerCase()) ||
        location.state.toLowerCase().includes(keyword.toLowerCase()) ||
        location.postcode.toLowerCase().includes(keyword.toLowerCase()) ||
        location.country.toLowerCase().includes(keyword.toLowerCase()) ||
        location.latitude.toLowerCase().includes(keyword.toLowerCase()) ||
        location.longitude.toLowerCase().includes(keyword.toLowerCase())
    );
    setLocations(filteredLocations);
  };

  if (!locations) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <h1>Just Simple Search Page</h1>
      Created by <a href="https://github.com/smnchoi">@smnchoi</a>
      <div className="searchBox">
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          value={searchKeyword}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.map((location: ILocation, index: number) => (
            <tr key={index}>
              <td>{location.city}</td>
              <td>{location.state}</td>
              <td>{location.postcode}</td>
              <td>{location.country}</td>
              <td>{location.latitude}</td>
              <td>{location.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
