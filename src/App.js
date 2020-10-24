import React, { Component } from 'react';
import Countries from './components/countries/Countries';
import Headers from './components/countries/header/Headers';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      allCountries: [],
      // este filtro que vai mudar com o tempo
      filteredCountries: [],
      filteredPopulation: 0,
      //filter nunca pode ser nulo ou undefined, trabalhando com input deve  ser vazio
      filter: '',
    };
  }

  async componentDidMount() {
    //O res vai receber um await do fetch da  url
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    //O json vai ser um await do res em json
    const json = await res.json();
    // dessestruturando o projeto direto e criando uma array com os elemento necessários
    const allCountries = json.map(({ name, numericCode, flag, population }) => {
      return {
        id: numericCode,
        name,
        filterName: name.toLowerCase(),
        flag,
        population,
      };
    });

    const filteredPopulation = this.calculateTotalPopulationFrom(allCountries);

    this.setState({
      //allCountris foi atribuido diretamente
      // identificar e valor reference a mesma variavel
      allCountries,
      //filtered será sempre o mesmo conteúdo de allcountries
      filteredCountries: Object.assign([], allCountries),
      filteredPopulation,
    });
    //console.log(json); mostra todos os países
  }

  calculateTotalPopulationFrom = (countries) => {
    const totalPopulation = countries.reduce((accumulator, current) => {
      return accumulator + current.population;
    }, 0);
    return totalPopulation;
  };

  handleChangeFilter = (newText) => {
    //console.log(newFilter);
    this.setState({
      filter: newText,
    });
    const filterLowerCase = newText.toLowerCase();

    const filteredCountries = this.state.allCountries.filter((country) => {
      return country.filterName.includes(filterLowerCase);
    });

    const filteredPopulation = this.calculateTotalPopulationFrom(
      filteredCountries
    );

    this.setState({
      filteredCountries,
      filteredPopulation,
    });
  };

  render() {
    const { filteredCountries, filter, filteredPopulation } = this.state;
    // O console.log mostra nossa nova lista de arrays
    // console.log(allCountries);
    return (
      <div className="container">
        <h1 style={styles.centeredTitle}>React Countries</h1>

        <Headers
          filter={filter}
          countryCount={filteredCountries.length}
          totalPopulation={filteredPopulation}
          onChangeFilter={this.handleChangeFilter}
        />
        <Countries countries={filteredCountries} />
      </div>
    );
  }
}

const styles = {
  centeredTitle: {
    textAlign: 'center',
  },
};
