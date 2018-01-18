from robotexclusionrulesparser import RobotExclusionRulesParser, _end_of_line_regex


class RulesParser(RobotExclusionRulesParser):
    def __init__(self, domain, rank, url, robots_txt):
        super().__init__()
        self.domain = domain
        self.rank = rank
        self.url = url

        self.lines = []
        self.comments = []
        self.line_count = 0
        self.missing = False
        self.html = False

        self.parse(robots_txt)

    def parse(self, text):
        if not text:
            self.missing = True
            return
        elif '<html' in text or '<body' in text:
            self.html = True
            return

        super().parse(text)

        self.lines = _end_of_line_regex.sub('\n', text).split('\n')
        for line in self.lines:
            line = line.strip()
            self.line_count += 1
            if line.startswith('#'):
                self.comments.append(line[1:].strip())
