import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storeIds = JSON.parse(localStorage.getItem('selectedPlaces',)) || [];
const storedPlaces = storeIds.map((id)=> AVAILABLE_PLACES.find((place)=> place.id === id)
);

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  const [availablePlaces, setAvailablePlaces] = useState([]);

  // following code will be executed infinite time because after setAvailablePlaces state update, App com will re-excuted then following code will be  reexcuted again. So using useEffet we can rid of this problem . because React executed useEffect at last means after the comp fn is done excuting. But when app component is finished excuting useEffect will again excuting. So this can be rid of using 2nd parameter which known as array of dependencies. And first parameter is call back fn which have some effect code. React looks dependencies array which means it will be excuted again if the dependencies values changed.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => { // this code is provided by the browser navigator
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    // this localStorage is provided by the browser neither react nor JS , allows us to use the setItem method to store some data in the browser's storage and that data will also be avialable if we leave the website and come to later or reload the website.
    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storeIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces',JSON.stringify([id,...storeIds]));
    }
    
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces',JSON.stringify(storeIds.filter((id)=> id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          // places={AVAILABLE_PLACES} // this changed because we are using side effects
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
