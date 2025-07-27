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
        });
    }

    useEffect(() => {
        getAll();
    }, []);


   return (
        <div>
            <div>
                <input type="text" />
                <button className="bg-blue-500 h-10 text-white p-2 rounded" onClick={toSearch}>Search</button>
                <button onClick={getAll}>reset</button>
            </div>
       <div className="grid grid-cols-5 gap-4">
        {pokemon.map((pokemonList, id) => (
            <div>
           <div className="">
               <div key={id} className="">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <img src={pokemonList?.sprites?.front_default} alt="" />
                        <h2>{pokemonList?.name}</h2>
                        <p>Types: {pokemonList?.types.map(type => type.type.name).join(', ')}</p>
                        <button onClick={() => toggleModal(id)} className="bg-blue-500 h-10 text-white p-2 rounded">more info</button> 
                    </div>
                </div> 
            </div>
            </div>   
       ))}

       <div className="absolute">{pokemon
       .map((p, id) => (
           <div key={id} className="">
                {modal && card === id && (
                    <div className="fixed bg-white ml-18 mt-6 w-300 h-130 align-middle rounded-lg shadow-lg p-4 ">
                            <h2 className="text-center bold">{p?.name}</h2> 
                            <img src={p?.sprites?.front_default} alt="" className="ml-120 h-50"/> 
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