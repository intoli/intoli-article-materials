#! /usr/bin/env python

import json
import sys
from urllib import request

from tqdm import tqdm

output_filename = 'robots-txt.jl' if len(sys.argv) != 2 else sys.argv[1]

with open('top-1m.csv', 'r') as f_in:
    with open(output_filename, 'a') as f_out:
        for line in tqdm(f_in, total=10**6):
            rank, domain = line.strip().split(',')
            url = f'http://{domain}/robots.txt'
            try:
                with request.urlopen(url, timeout=10) as r:
                    data = r.read()
                    text = data.decode()
                    url = r.geturl()
            except:
                text = None

            f_out.write(json.dumps({
                'rank': int(rank),
                'domain': domain,
                'url': url,
                'robots_txt': text,
            }) + '\n')
