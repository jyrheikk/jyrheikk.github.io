from trf.player import Player

RTFX_PLAYER_ID = '001'

def create_players(players: list[Player]) -> str:
    trf = []
    for index, p in enumerate(players):
        trf.append(create_trf(p, index + 1))
    return trf

def create_trf(player: Player, index: int) -> str:
    name = f'{player.last_name}, {player.first_name}'
    return f'{RTFX_PLAYER_ID:<7}{index:<7}{name:<34}{player.rating}'
