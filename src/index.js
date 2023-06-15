import React from "react";
import ReactDOM from "react-dom/client";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
    Navigation,
    Footer,
    Home,
    Posts,
    SolanaIntro,
    RandomNumbers,
    PythSeeds,
    CharityICO,
    SolanaStreamer,
    PokemonPost,
    Pokemon,
    PokeTokenLaunchPage,
    CharityAuction,
    Rewards,
    Verified,
    IntroToken2022

} from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Navigation />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/blog" element={<Posts />} />
        <Route path="/blog/solana_getting_started" element={<SolanaIntro />} />
        <Route path="/blog/random_numbers" element={<RandomNumbers />} />
        <Route path="/blog/pyth_seeds" element={<PythSeeds />} />
        <Route path="/blog/charity_token_launch" element={<CharityICO />} />
        <Route path="/blog/solana_streamer" element={<SolanaStreamer />} />
        <Route path="/blog/pokemon_guide" element={<PokemonPost />} />
        <Route path="/blog/charity_auction" element={<CharityAuction />} />
        <Route path="/pokemon/token_launch" element={<PokeTokenLaunchPage />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/blog/intro_token_2022" element={<IntroToken2022 />} />


    </Routes>
    <Footer />
  </Router>
);



serviceWorker.unregister();
