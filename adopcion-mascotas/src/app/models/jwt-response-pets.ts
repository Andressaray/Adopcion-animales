export interface JwtResponsePets {
    dataPet: {
        id:         number,
        name:       string,
        race:       string,
        species:    string,
        gender:     string,
        age:        number,
        vaccinesO:  string,
        vaccines:   string,
        imageUrl?:   string,
        addres?:    string,
        adopted?:   string,
    }
}