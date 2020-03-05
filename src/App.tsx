import * as React from "react";
import "./styles.css";
import { createStore } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Action, State } from "./types";

// store.ts
const reducer = (state: State = {}, action: Action) => {
  switch (action.type) {
    case "SELECT_AGE":
      return { ...state, age: action.age };
    case "SELECT_TYPE_PERMIS":
      return { ...state, typePermis: action.typePermis };
    case "SELECT_AGE_PERMIS":
      return { ...state, agePermis: action.agePermis };
  }
  return state;
};

// AgeSelect.tsx
const AgeSelect = () => {
  const age = useSelector((state: State) => state.age);
  const dispatch = useDispatch();
  const updateValue = (val: string) => {
    const newAge = isNaN(Number(val)) ? undefined : Number(val);
    dispatch({ type: "SELECT_AGE", age: newAge });
  };
  return (
    <section>
      <label htmlFor="age">Votre age :</label>
      <select
        name="age"
        value={age}
        onChange={e => updateValue(e.target.value)}
      >
        <option value={undefined}>--select--</option>
        {[15, 16, 17, 18, 19, 20].map(v => (
          <option value={v} key={v}>
            {v}
          </option>
        ))}
      </select>
    </section>
  );
};

// TypePermisSelect.tsx
const TypePermisSelect = () => {
  const typePermis = useSelector((state: State) => state.typePermis);
  const dispatch = useDispatch();
  const updateValue = (val: string) => {
    const newTypePermis = val ? val : undefined;
    dispatch({ type: "SELECT_TYPE_PERMIS", typePermis: newTypePermis });
  };
  return (
    <section>
      <label htmlFor="typePermis">Votre type permis :</label>
      <select
        name="typePermis"
        value={typePermis}
        onChange={e => updateValue(e.target.value)}
      >
        <option value={undefined}>--select--</option>
        {[">16", ">18"].map(v => (
          <option value={v} key={v}>
            {v}
          </option>
        ))}
      </select>
    </section>
  );
};

// AgePermisSelect.tsx
const AgePermisSelect = () => {
  const agePermis = useSelector((state: State) => state.agePermis);
  const dispatch = useDispatch();
  const updateValue = (val: string) => {
    const newAgePermis = isNaN(Number(val)) ? undefined : Number(val);
    dispatch({ type: "SELECT_AGE_PERMIS", agePermis: newAgePermis });
  };
  return (
    <section>
      <label htmlFor="agePermis">Votre age de permis :</label>
      <select
        name="agePermis"
        value={agePermis}
        onChange={e => updateValue(e.target.value)}
      >
        <option value={undefined}>--select--</option>
        {[0, 1, 2, 3, 4, 5].map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    </section>
  );
};

// App.tsx
const store = createStore(
  reducer,
  // @ts-ignore : Enables redux devtools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default function App() {
  return (
    <Provider store={store}>
      <form>
        <DisplayStore />
        <AgeSelect />
        <TypePermisSelect />
        <AgePermisSelect />
      </form>
    </Provider>
  );
}

const DisplayStore = () => {
  const state = useSelector((state: State) => state);
  return (
    <div>
      age: {state.age} typePermis: {state.typePermis} agePermis:{" "}
      {state.agePermis}
    </div>
  );
};
