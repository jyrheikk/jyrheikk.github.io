# Tournament Report File for a chess tournament

## Prerequisites

- Create an account in [ChessManager](https://chessmanager.com/).
- [Install `uv`](https://docs.astral.sh/uv/getting-started/installation/), used for running the scripts below.

## Creating a tournament

1. Download the latest `selolista.csv`:

```bash
uv run -m trf --download-ratings
```

2. Create the [Tournament Report File](https://tornelo.com/knowledge-base/trfx-file-format/) based on `tournament.trfx`.

3. Create the `players.csv` file that contains the participants:

- One each line.
- Format is `first-name,last-name,club`.

Example:

```csv
Jyrki,Heikkinen,2064
```

4. Generate the tournament file that includes a list of participants:

```bash
uv run -m trf --tournament tournament.trfx --players players.csv
```

5. Create a tournament:

- Log in to ChessManager.
- Select **New Tournament**.
- Select **Import From File**, and choose the generated TRFX file.
- Update tournament time control.
- Add the club for players if needed, by manually updating the players.
