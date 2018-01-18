player_rules = {
    'pass yds': 0.04,  # Pass Yards
    'pass tds': 4,  # Pass Touchdowns
    'int': -2,  # Interceptions
    'rush yds': 0.1,  # Rush Yards
    'rush tds': 6,  # Rush Touchdowns
    'rec yds': 0.1,  # Reception Yards
    'rec tds': 6,  # Reception Touchdowns
    'fum': -2,  # Fumbles
    '10-19 fgm': 3,  # 10-19 Yard Field Goal
    '20-29 fgm': 3,  # 20-29 Yard Field Goal
    '30-39 fgm': 3,  # 30-39 Yard Field Goal
    '40-49 fgm': 3,  # 40-49 Yard Field Goal
    '50+ fgm': 5,  # 50+ Yard Field Goal
    'xpm': 1,  # Extra Point
}

def calculate_player_points(performance):
    points = 0
    for rule, value in player_rules.items():
        points += float(performance.get(rule, 0))*value
    return points


team_rules = {
    'scks': 1,  # Sacks
    'int': 2,  # Interceptions
    'fum': 2,  # Fumbles
    'deftd': 6,  # Defensive Touchdowns
    'safts': 2,  # Safeties
}

def calculate_team_points(performance):
    points = 0
    for rule, value in team_rules.items():
        points += float(performance[rule])*value

    # special brackets for "Points Against"
    points_against = float(performance['pts agn'])
    if points_against == 0:
        points += 10
    elif points_against < 7:
        points += 7
    elif points_against < 14:
        points += 2

    return points


def calculate_points(performance):
    if performance['position'] == 'D':
        return calculate_team_points(performance)
    return calculate_player_points(performance)
