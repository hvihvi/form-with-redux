import * as React from "react";
import "./styles.css";
import { createStore } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Action, State, TypePermis } from "./types";

/**
 * Implémentation d'un form avec redux avec le minimum d'abstration supplémentaires
 * (pas de doov, old framework field, form engine, design system, inspiration du jour...)
 * Seulement Redux qui 2way-bind un form
 */

// store.ts
const reducer = (state: State = {}, action: Action) => {
  switch (action.type) {
    case "SELECT_AGE":
      return { ...state, age: action.age };
    case "SELECT_TYPE_PERMIS":
      return { ...state, typePermis: action.typePermis };
    case "SELECT_AGE_PERMIS":
      return { ...state, agePermis: action.agePermis };
    case "RELOAD_FICHE":
      return { ...state, ...action.fiche }; // TODO shouldn't update invalid values
  }
  return state;
};

// AgeSelect.tsx
const AgeSelect = () => {
  const dispatch = useDispatch();
  const age = useSelector((state: State) => state.age);
  // update value
  const updateValue = (val: string) => {
    const newAge = val !== "--select--" ? Number(val) : undefined;
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
        <option>--select--</option>
        {[16, 17, 18, 19, 20, 21, 22].map(v => (
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
  const dispatch = useDispatch();
  const typePermis = useSelector((state: State) => state.typePermis);
  // dependance à age
  const age = useSelector((state: State) => state.age);
  // règle de reset du champ
  React.useEffect(() => {
    if (!age || (age < 18 && typePermis === ">18")) {
      dispatch({ type: "SELECT_TYPE_PERMIS", typePermis: undefined });
    }
  }); // expliciter dépendances ?

  return (
    <section>
      <label htmlFor="typePermis">Votre type permis :</label>
      <select
        name="typePermis"
        value={typePermis}
        // update value
        onChange={e =>
          dispatch({ type: "SELECT_TYPE_PERMIS", typePermis: e.target.value })
        }
      >
        <option>--select--</option>
        {[">16", ">18"] // compute values
          .filter(v => age && !(age && age < 18 && v === ">18")) // compute values
          .map(v => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
      </select>
    </section>
  );
};

const typePermisToAgeLimite = (typePermis: TypePermis) =>
  typePermis === ">16" ? 16 : 18;
// AgePermisSelect.tsx
const AgePermisSelect = () => {
  const dispatch = useDispatch();
  const agePermis = useSelector((state: State) => state.agePermis);
  // dependance age et typePermis
  const age = useSelector((state: State) => state.age);
  const typePermis = useSelector((state: State) => state.typePermis);

  // reset du champ
  React.useEffect(() => {
    if (agePermis && !age && !typePermis) {
      dispatch({ type: "SELECT_AGE_PERMIS", agePermis: undefined });
    }
  });
  const updateValue = (val: string) => {
    const newAgePermis = val !== "--select--" ? Number(val) : undefined;
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
        <option>--select--</option>
        {Array.from(
          {
            length:
              age && typePermis
                ? age - typePermisToAgeLimite(typePermis) + 1
                : 0
          },
          (_, i) => i
        ) // compute values
          .map(value => (
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
      <ReloadBadFiche />
    </Provider>
  );
}

const ReloadBadFiche = () => {
  const dispatch = useDispatch();
  const fiche = {
    age: 19,
    typePermis: ">18",
    agePermis: 10
  };
  return (
    <button onClick={() => dispatch({ type: "RELOAD_FICHE", fiche })}>
      reload bad fiche
    </button>
  );
};

// DisplayStore.tsx
const DisplayStore = () => {
  const state = useSelector((state: State) => state);
  return (
    <div>
      age: {state.age} typePermis: {state.typePermis} agePermis:{" "}
      {state.agePermis}
    </div>
  );
};
