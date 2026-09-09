import argparse

RATINGS_FILE = 'selolista.csv'

def parse_args(argv = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='trf',
        description='Create Tournament Report File for a chess tournament'
    )

    download = parser.add_argument_group('download')
    download.add_argument(
        '-d', '--download-ratings',
        action='store_true',
        help=f'download the latest {RATINGS_FILE}'
    )

    create = parser.add_argument_group('create')
    create.add_argument(
        '-p', '--players',
        type=str,
        metavar='PLAYERS_CSV',
        help='name of the players CSV file'
    )
    create.add_argument(
        '-t', '--tournament',
        type=str,
        metavar='TOURNAMENT_TRFX',
        help='name of the Tournament Report File (.trfx)'
    )

    return parser.parse_args(argv)

def validate_args(args: argparse.Namespace) -> argparse.Namespace:
    return args
