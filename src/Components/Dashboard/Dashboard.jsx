"use client";

import { useState, useEffect, useRef } from "react";
import {
  Home,
  ShoppingCart,
  Wallet,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X,
  MoreVertical,
  ChevronRight,
  Bell,
} from "lucide-react";
import Loader from "../Utiles/Loader";
import { UserState } from "../Context/UserContext";
import axios from "axios";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const { logout } = UserState();
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonStats, setPokemonStats] = useState([]);
  const [recentPokemon, setRecentPokemon] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartFilter, setChartFilter] = useState("types");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=15"
        );
        const data = response.data;
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return res.data;
          })
        );
        setPokemonData(pokemonDetails);

        const typesMap = {};
        pokemonDetails.forEach((pokemon) => {
          pokemon.types.forEach((type) => {
            const typeName = type.type.name;
            if (!typesMap[typeName]) {
              typesMap[typeName] = 0;
            }
            typesMap[typeName]++;
          });
        });

        const typesData = Object.keys(typesMap).map((name) => ({
          name,
          count: typesMap[name],
          percentage: Math.round(
            (typesMap[name] / pokemonDetails.length) * 100
          ),
        }));
        setPokemonTypes(typesData);

        const statsMap = {};
        pokemonDetails.forEach((pokemon) => {
          pokemon.stats.forEach((stat) => {
            const statName = stat.stat.name;
            if (!statsMap[statName]) {
              statsMap[statName] = [];
            }
            statsMap[statName].push(stat.base_stat);
          });
        });

        const statsData = Object.keys(statsMap).map((name) => {
          const values = statsMap[name];
          const total = values.reduce((sum, val) => sum + val, 0);
          return {
            name,
            value: Math.round(total / values.length),
          };
        });

        setPokemonStats(statsData);
        setRecentPokemon(pokemonDetails.slice(0, 5));
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonData();
  }, []);

  const generateChartData = (filter) => {
    if (!pokemonData.length) return { labels: [], datasets: [] };

    let labels = [];
    let data = [];
    let backgroundColor = [];
    let borderColor = [];

    if (filter === "stats") {
      if (pokemonStats.length) {
        console.log(pokemonStats);
        labels = pokemonStats.map((stat) =>
          stat.name.replace("special-", "sp. ")
        );
        data = pokemonStats.map((stat) => stat.value);
        backgroundColor = labels.map(() => "rgba(59, 130, 246, 0.2)");
        borderColor = labels.map(() => "rgb(59, 130, 246)");
      }
    } else if (filter === "types") {
      if (pokemonTypes.length) {
        console.log(pokemonTypes);
        labels = pokemonTypes.map((type) => type.name);
        data = pokemonTypes.map((type) => type.count);
        backgroundColor = labels.map((type) => {
          const typeColors = {
            normal: "rgba(168, 168, 120, 0.2)",
            fire: "rgba(240, 128, 48, 0.2)",
            water: "rgba(104, 144, 240, 0.2)",
            electric: "rgba(248, 208, 48, 0.2)",
            grass: "rgba(120, 200, 80, 0.2)",
            ice: "rgba(152, 216, 216, 0.2)",
            fighting: "rgba(192, 48, 40, 0.2)",
            poison: "rgba(160, 64, 160, 0.2)",
            ground: "rgba(224, 192, 104, 0.2)",
            flying: "rgba(168, 144, 240, 0.2)",
            psychic: "rgba(248, 88, 136, 0.2)",
            bug: "rgba(168, 184, 32, 0.2)",
          };
          return typeColors[type] || "rgba(59, 130, 246, 0.2)";
        });
        borderColor = labels.map((type) => {
          const typeColors = {
            normal: "rgb(168, 168, 120)",
            fire: "rgb(240, 128, 48)",
            water: "rgb(104, 144, 240)",
            electric: "rgb(248, 208, 48)",
            grass: "rgb(120, 200, 80)",
            ice: "rgb(152, 216, 216)",
            fighting: "rgb(192, 48, 40)",
            poison: "rgb(160, 64, 160)",
            ground: "rgb(224, 192, 104)",
            flying: "rgb(168, 144, 240)",
            psychic: "rgb(248, 88, 136)",
            bug: "rgb(168, 184, 32)",
          };
          return typeColors[type] || "rgb(59, 130, 246)";
        });
      }
    } else if (filter === "height") {
      labels = pokemonData.map((pokemon) => pokemon.name);
      data = pokemonData.map((pokemon) => pokemon.height);
      backgroundColor = pokemonData.map((pokemon) => {
        const type = pokemon.types[0].type.name;
        const typeColors = {
          normal: "rgba(168, 168, 120, 0.2)",
          fire: "rgba(240, 128, 48, 0.2)",
          water: "rgba(104, 144, 240, 0.2)",
          electric: "rgba(248, 208, 48, 0.2)",
          grass: "rgba(120, 200, 80, 0.2)",
          ice: "rgba(152, 216, 216, 0.2)",
          fighting: "rgba(192, 48, 40, 0.2)",
          poison: "rgba(160, 64, 160, 0.2)",
          ground: "rgba(224, 192, 104, 0.2)",
          flying: "rgba(168, 144, 240, 0.2)",
          psychic: "rgba(248, 88, 136, 0.2)",
          bug: "rgba(168, 184, 32, 0.2)",
        };
        return typeColors[type] || "rgba(59, 130, 246, 0.2)";
      });
      borderColor = pokemonData.map((pokemon) => {
        const type = pokemon.types[0].type.name;
        const typeColors = {
          normal: "rgb(168, 168, 120)",
          fire: "rgb(240, 128, 48)",
          water: "rgb(104, 144, 240)",
          electric: "rgb(248, 208, 48)",
          grass: "rgb(120, 200, 80)",
          ice: "rgb(152, 216, 216)",
          fighting: "rgb(192, 48, 40)",
          poison: "rgb(160, 64, 160)",
          ground: "rgb(224, 192, 104)",
          flying: "rgb(168, 144, 240)",
          psychic: "rgb(248, 88, 136)",
          bug: "rgb(168, 184, 32)",
        };
        return typeColors[type] || "rgb(59, 130, 246)";
      });
    }

    return {
      labels,
      datasets: [
        {
          label: filter.charAt(0).toUpperCase() + filter.slice(1),
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  };

  useEffect(() => {
    if (pokemonData.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: generateChartData(chartFilter),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#1e293b",
              bodyColor: "#475569",
              borderColor: "#e2e8f0",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                title: (tooltipItems) =>
                  tooltipItems[0].label.charAt(0).toUpperCase() +
                  tooltipItems[0].label.slice(1),
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                callback: function (value) {
                  const label = this.getLabelForValue(value);
                  return (
                    label.charAt(0).toUpperCase() +
                    label.slice(1, 8) +
                    (label.length > 8 ? "..." : "")
                  );
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                display: true,
              },
              border: {
                display: false,
              },
            },
          },
        },
      });
    }
  }, [chartFilter, pokemonData, pokemonStats, pokemonTypes]);

  const getTypeColor = (type) => {
    const typeColors = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-200",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-300",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-600",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };

    return typeColors[type] || "bg-gray-400";
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen bg-gray-50">
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
            alt="Pikachu"
            className="w-8 h-8"
          />
          <h1 className="font-bold text-lg">PokéTrainer</h1>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            4
          </span>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed md:static inset-y-0 left-0 w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="text-xl font-bold">PokéTrainer</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="relative w-fit">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
              <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                alt="Profile"
                className="w-full h-full rounded-lg object-cover bg-gray-800"
              />
            </div>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-lg">
              4
            </div>
          </div>
          <h2 className="text-xl font-bold mt-4">Trainer</h2>
          <p className="text-gray-400 text-sm">trainer@pokeleague.com</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center text-white bg-gradient-to-r from-blue-600/20 to-transparent px-3 py-3 rounded-lg font-medium hover:from-blue-600/30 transition-all duration-200"
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-300 px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span>Pokemon</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-300 px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <Wallet className="w-5 h-5 mr-3" />
                <span>Bag</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-300 px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-3" />
                <span>Stats</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-300 px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Badges</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-300 px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 w-full px-3 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-auto bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="hidden md:flex justify-between items-center mb-6"></div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-8xl mx-auto">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      PokéDex
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Based on {pokemonData.length} Pokémon
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">Pokémon Data</h3>
                    <div className="flex space-x-2">
                    <button
                        className={`text-xs ${
                          chartFilter === "types"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        } px-3 py-1 rounded-md shadow-sm hover:shadow transition-shadow`}
                        onClick={() => setChartFilter("types")}
                      >
                        Types
                      </button>
                      
                      <button
                        className={`text-xs ${
                          chartFilter === "stats"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        } px-3 py-1 rounded-md shadow-sm hover:shadow transition-shadow`}
                        onClick={() => setChartFilter("stats")}
                      >
                        Stats
                      </button>
                    
                      <button
                        className={`text-xs ${
                          chartFilter === "height"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        } px-3 py-1 rounded-md shadow-sm hover:shadow transition-shadow`}
                        onClick={() => setChartFilter("height")}
                      >
                        Height
                      </button>
                    </div>
                  </div>
                  <div className="h-48 mb-2 mt-4">
                    <canvas ref={chartRef} />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-800">
                      Today's Discoveries
                    </h2>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentPokemon.slice(0, 3).map((pokemon, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-xl ${getTypeColor(
                              pokemon.types[0].type.name
                            )} bg-opacity-20 flex items-center justify-center mr-4`}
                          >
                            <img
                              src={
                                pokemon.sprites.front_default ||
                                "/placeholder.svg"
                              }
                              alt={pokemon.name}
                              className="w-10 h-10"
                            />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {pokemon.name}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              {pokemon.types.map((type, i) => (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                                    type.type.name
                                  )} text-white capitalize`}
                                >
                                  {type.type.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 mr-2">
                            CP {pokemon.base_experience}
                          </p>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-800">
                      Previous Discoveries
                    </h2>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentPokemon.slice(3, 5).map((pokemon, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-xl ${getTypeColor(
                              pokemon.types[0].type.name
                            )} bg-opacity-20 flex items-center justify-center mr-4`}
                          >
                            <img
                              src={
                                pokemon.sprites.front_default ||
                                "/placeholder.svg"
                              }
                              alt={pokemon.name}
                              className="w-10 h-10"
                            />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {pokemon.name}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              {pokemon.types.map((type, i) => (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                                    type.type.name
                                  )} text-white capitalize`}
                                >
                                  {type.type.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 mr-2">
                            CP {pokemon.base_experience}
                          </p>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Type Distribution
                  </h2>

                  <div className="space-y-4">
                    {pokemonTypes.map((type, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="capitalize font-medium">
                            {type.name}
                          </span>
                          <span className="text-gray-600">
                            {type.count} Pokémon
                          </span>
                        </div>
                        <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${getTypeColor(
                              type.name
                            )} h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${type.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                    <img
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                      alt="Bulbasaur"
                      className="h-32 relative z-10 drop-shadow-lg"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Catch More Pokémon</h3>
                  <p className="text-blue-100 text-sm mb-6">
                    Explore different regions and terrains to find rare Pokémon
                    species. Use berries to increase your chances!
                  </p>
                  <button className="w-full uppercase bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-bold shadow-lg">
                    View Pokémon
                  </button>
                </div>

                <div className="mt-6 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">Your Team</h3>
                  <div className="flex justify-between">
                    {[25, 4, 7, 1, 54, 133].map((id) => (
                      <div key={id} className="relative group">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                            alt="Team Pokémon"
                            className="w-16 h-16"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
