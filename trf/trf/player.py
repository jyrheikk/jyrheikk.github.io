DEFAULT_RATING = 1525

class Player:
    def __init__(self, first_name: str, last_name: str, rating = DEFAULT_RATING, club = ''):
        self.first_name = first_name
        self.last_name = last_name
        self.rating = rating
        self.club = club

    def equals(self, a: Player) -> bool:
        return self.last_name == a.last_name and \
            self.first_name == a.first_name and \
            (self.club == a.club or not self.club or not a.club)

    def old_equals(self, a: Player) -> bool:
        return self['last_name'] == a['last_name'] and \
            self['first_name'] == a['first_name'] and \
            (self['club'] == a['club'] or not self['club'] or not a['club'])
