# Fantasy Football for Hackers

[Fantasy Football for Hackers](https://intoli.com/blog/fantasy-football-for-hackers/) walks through the process of scraping Fantasy Football projections, calculating player and team points given custom league rules, and then simulating league dynamics to develop baseline subtracted projections.


- [points.py](points.py) - Lays out how to calculate the expected player and team points given projections.
- [scrape-projections.py](scrape-projections.py) - Defines methods for scraping weekly projections from [FantasySharks.com](https://fantasysharks.com).
- [simulation.py](simulation.py) - Develops abstractions for players, teams, and leagues that can be used in simulations to generate baselines for players.
