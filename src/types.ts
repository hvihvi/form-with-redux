export type Action =
  | {
      type: "SELECT_AGE";
      age: number;
    }
  | {
      type: "SELECT_AGE_PERMIS";
      agePermis: number;
    }
  | {
      type: "SELECT_TYPE_PERMIS";
      typePermis: TypePermis;
    }
  | {
      type: "RELOAD_FICHE";
      fiche: State;
    };
export type TypePermis = ">16" | ">18";

export interface State {
  age?: number;
  agePermis?: number;
  typePermis?: TypePermis;
}
