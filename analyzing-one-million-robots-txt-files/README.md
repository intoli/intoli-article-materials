# Analyzing One Million robots.txt Files

[Analyzing One Million robots.txt Files](https://intoli.com/blog/analyzing-one-million-robots-txt-files/) involves downloading

- [download-top-1m.sh](download-top-1m.sh) - Downloads and extracts the list of Alexa top one million websites into a CSV file called `top-1m.csv`.
- [download-robots-txt.py](download-robots-txt.py) - Reads in `top-1m.csv` and downloads the `robots.txt` file for each of them.
    The results are written out into a JSON Lines formatted file called `robots-txt.jl`.
    Note that it takes an extremely long time to download all of the `robots.txt` files (like weeks).
- [rule-parser.py](rule-parser.py) - Defines a `RuleParser` class that extends `RobotExclusionRulesParser` from the [robotexclusionrulesparser](http://nikitathespider.com/python/rerp/) Python package.
    The main addition is a `line_count` attribute that can be used to determine the size of a file.
- [summarize-data.py](summarize-data.py) - Uses `RuleParser` to analyze the `robots-txt.jl` and prints out some basic summary statistics.

The analysis in the article goes into far more depth than this and performs a t-SNE dimensional reduction of the dataset based on the Levenshtein distance between files.
That's a little out of scope for the supplementary materials, but you can [give it a read](https://intoli.com/blog/analyzing-one-million-robots-txt-files/) to learn more about those components of the analysis.
