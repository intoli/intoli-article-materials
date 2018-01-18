import json
from collections import Counter, defaultdict
from urllib.parse import urlparse

from tqdm import tqdm

from .rule_parser import RuleParser


def load_robots_txt(filename='robots-txt.jl'):
    with open(filename, 'r') as f:
        for line in tqdm(f, total=10**6):
            yield RulesParser(**json.loads(line))

totals = defaultdict(int)
for robots_txt in load_robots_txt():
    if robots_txt.missing:
        totals['missing'] += 1
    if robots_txt.html:
        totals['html'] += 1
    if len(robots_txt.sitemaps) > 0:
        totals['sitemaps'] += 1
    totals['all'] += 1

print('Total Counts:')
print(json.dumps(totals, indent=2))

sitemap_counter = Counter()
for robots_txt in load_robots_txt():
    sitemap_paths = map(lambda url: urlparse(url).path, robots_txt.sitemaps)
    sitemap_counter.update(sitemap_paths)

print('Most Common Sitemaps:')
print(json.dumps(sitemap_counter.most_common(10), indent=2))
