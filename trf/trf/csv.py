import csv

from enum import IntEnum

from trf.args import RATINGS_FILE
from trf.player import Player

class Registrants(IntEnum):
    FIRST_NAME = 0
    LAST_NAME = 1
    CLUB = 2
    RATING = 3

class Ratings(IntEnum):
    LAST_NAME = 3
    FIRST_NAME = 4
    CLUB = 5
    RATING = 6

def parse_rated_players(csv_file = RATINGS_FILE) -> list[Player]:
    with open(csv_file, encoding='utf-8') as file:
        reader = csv.reader(file, delimiter=';')
        next(reader) # skip header
        result = []
        for row in reader:
            result.append(Player(
                row[Ratings.FIRST_NAME],
                row[Ratings.LAST_NAME],
                row[Ratings.RATING],
                row[Ratings.CLUB],
            ))
        return result

def parse_registrants(csv_file: str) -> list[Player]:
    with open(csv_file, encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader) # skip header
        result = []
        for row in reader:
            result.append(Player(
                row[Registrants.FIRST_NAME],
                row[Registrants.LAST_NAME],
                row[Registrants.RATING],
                row[Registrants.CLUB],
            ))
        return result
