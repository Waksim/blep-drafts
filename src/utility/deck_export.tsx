import {Buffer} from 'buffer';
import {Card, CharacterCard} from "../card_database/card";

let tg = window.Telegram.WebApp;

export function generate_deck_code(deck_characters: CharacterCard[], deck_cards: Card[], iterations: number = 0) {
    // Create an empty deck
    let deck: string[] = new Array(102).fill("0000")

    // Offset alternates between 1 and 3, as card parts are written to 1/4/5 then 8/9/12th bytes
    // This function flips between the offset
    let curr_offset = 3

    const get_offset = () => {
        curr_offset = 4 - curr_offset
        return curr_offset
    }

    let i = 0;
    for (var a = 0; a < deck_characters.length; a++) {
        let str = binary_encode(deck_characters[a])

        deck[i] = str.substring(0, 4)
        i += get_offset()
        deck[i] = str.substring(4, 8)
        i += get_offset()
        deck[i] = str.substring(8, 12)
        i += get_offset()
    }

    i = 17
    curr_offset = 1
    for (let card of deck_cards) { //iterate through all the action cards
        let str = binary_encode(card)

        deck[i] = str.substring(0, 4)
        i += get_offset()
        deck[i] = str.substring(4, 8)
        i += get_offset()

        if (i == 100) {
            i = 2
        }

        deck[i] = str.substring(8, 12)
        i += get_offset()
    }

    let deck_str = deck.join("");
    let array: Uint8Array = new Uint8Array(51);

    for (let i = 0; i < deck_str.length; i += 8) {
        let num = parseInt(deck_str.substring(i, i + 8), 2) + iterations;
        array[i / 8] = num;
    }

    const deckCode = Buffer.from(array).toString('base64');

    const url: string = window.location.href;
    const regexp: RegExp = /\?your_id=(\d*)&opp_id=(\d*)/;
    const result: RegExpMatchArray | null = url.match(regexp);

    const charsList: number[] = deck_characters.map(deck_characters => deck_characters.code_key);
    const cardsList: number[] = deck_cards.map(deck_cards => deck_cards.code_key);

    let yourId = ""
    let oppId = ""
    if (result) {
        yourId = result[1];
        oppId = result[2];

        const jsonData = {
            your_id: yourId,
            opp_id: oppId,
            chars_List: charsList,
            cards_List: cardsList,
        };
        tg.sendData(JSON.stringify(jsonData));

    } else {
        const jsonData = {
            chars_List: charsList,
            cards_List: cardsList,
        };
        tg.sendData(JSON.stringify(jsonData));
    }


    return deckCode;
}

function binary_encode(card: Card): string {
    let binary = card.code_key.toString(2)
    return binary.padStart(12, "0")
}