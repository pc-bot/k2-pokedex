import { useState, useEffect } from "react";

export default function Pokedex() {
    const [pokemonUrl ,setPokemonUrl] = useState([])
    const [pokemon ,setPokemon] = useState([])
    const [modal, setModal] = useState(false);
    const [card, setCard] = useState(0);

    const toggleModal = (id) => {
        setModal(!modal);
        setCard(id);
    };
    const toSearch = () => {
        const searchInput = document.querySelector('input[type="text"]');
        const results = pokemon.filter(p => p
            .name
            .toLowerCase()
            .startsWith(searchInput.value.toLowerCase()));
        setPokemon(results);
    }

    const getAll = async () => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')
        .then(res => {return res.json()})
        .then(data => {
           setPokemonUrl(data.results);
           const urls = data.results.map(p => p.url);
           return Promise.all(urls
            .map(url => fetch(url)
            .then(res => res.json())));
        })
        .then(data => {
            console.log(data);
            setPokemon(data);
        })
        .catch((error) => {
            console.error("le site ne fonctionne pas");
        })
    
    }

    useEffect(() => {
        getAll();
    }, []);



   return (
        <div>
            <div className="flex flex-row justify-evenly items-center p-5 bg-blue-500">
                <div>
                    <img src="logoPokedex.png" alt="" />
                    logo</div>
                <div className="flex flex-row">
                    <div className="bg-white p-2 w-90 rounded-full shadow-lg">
                        <input type="text" className="h-5 ml-5"/>
                    <button className="ml-5 bg-gray-100 w-20 rounded-sm" onClick={toSearch}>Search</button>
                    </div>
                   <button onClick={getAll} className="ml-5 w-20 h-8 mt-1 rounded full bg-blue-200">reset</button>
                </div>
 
            </div>
            <div className="grid grid-cols-5 gap-4 mt-20">
                {pokemon.map((pokemonList, id) => (
                    <div key={id} className="">
                        <div className="">
                            <div className="">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex flex-row items-center">
                                        <div>
                                            <img src={pokemonList?.sprites?.front_default} alt="" className="items-center justify-center"/>
                                        </div>
                                        <div>
                                    <h2 className="text-center">{pokemonList?.name}</h2>
                                    <p className="text-center">Types: {pokemonList?.types.map(type => type.type.name).join(', ')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleModal(id)} className="bg-blue-500 ml-10 w-30 h-8 text-sm text-white p-2 rounded">more info</button> 
                    </div>
                </div> 
            </div>
            </div>   
       ))}

            <div className="absolute ">{pokemon
                .map((p, id) => (
                    <div key={id} className="">
                        {modal && card === id && (
                            <div className="fixed bg-white ml-18 w-300 h-110 mb-40 align-middle rounded-lg shadow-lg p-4 ">
                                <h2 className="text-center bold">{p?.name}</h2>
                                <img src={p?.sprites?.front_default} alt="" className="ml-120 h-50 " />
                                <div className="flex flex-row items-center">
                            <div>
                                <p>Height: {p?.height}</p>
                                <p>Weight: {p?.weight}</p>
                                <p>Types: {p?.types.map(type => type.type.name).join(', ')}</p>
                                 <p>Abilities: {p?.abilities.map(ability => ability.ability.name).join(', ')}</p>
                            </div>
                            <div>
                               
                        <p>Stats:</p>
                            <ul className="list-disc pl-5">
                            {p?.stats.map(stat => (
                                <li key={stat.stat.name}>
                                    {stat.stat.name}: {stat.base_stat}
                                </li>
                            ))}
                        </ul>
                            </div>
                        </div>
                        <button onClick={() => toggleModal(0)}>Close</button>
                    </div>
                )}
            </div>
       ))}</div>
       </div>
        </div> 
   )
}