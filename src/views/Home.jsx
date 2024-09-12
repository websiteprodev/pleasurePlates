import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to the Culinary Forum</h1>
        <p>Join a vibrant community of food enthusiasts!</p>
        <button className="hero-button">Explore Recipes</button>
      </div>

      <div className="top-posts-container">
        <section className="top-posts">
          <h2>
            <Link to="/top-commented" className="top-posts-button">
              Top 10 Most Commented Posts
            </Link>
          </h2>
        </section>

        <section className="top-posts">
          <h2>
            <Link to="/top-liked" className="top-posts-button">
              Top 10 Most Liked Posts
            </Link>
          </h2>
        </section>
      </div>
    </div>
  );
}
