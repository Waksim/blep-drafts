import './card_selector.css'
import {Card, CharacterCard, GIResonance, GITag} from "../card_database/card";
import {CardDatabase} from "../card_database/card_database";
import {CardButton} from "./card_button";
import Row from 'react-bootstrap/Row';

export interface CardSelectorProps {
    deck_characters: CharacterCard[]
    deck_cards: Card[]
    addCard: (card: Card) => void
}

const database = new CardDatabase()


export function CardSelector({deck_characters, deck_cards, addCard}: CardSelectorProps) {
    // Check if it is the last card
    let options: Card[]
    let title = "Pick an action card:";

    if (deck_cards.length == 29) {
        options = GetArcaneCardOptions(database)
        title = "Pick your arcane:";
    } else if (deck_characters.length > Math.floor(deck_cards.length / 10)) {
        // Select action card if we have enough characters
        options = GetActionCardOptions(database, deck_characters, deck_cards)
    } else {
        // Select characters if we don't have enough
        options = GetCharacterOptions(database, deck_characters)
        title = "Pick a character card:";
    }

    return (
        <div className="selector-box">
            <label className="selector-title">{title}</label>
            {/*<label className="selector-title">{title}</label>*/}
            <label className="selector-progress">{deck_cards.length}/30 cards chosen</label>
            <div className="selector-cards">
                <Row xs={3} md={3} className="g-3">
                    <CardButton key={`sel-${options[0].id}`} card={options[0]} addCard={addCard}/>
                    <CardButton key={`sel-${options[1].id}`} card={options[1]} addCard={addCard}/>
                    <CardButton key={`sel-${options[2].id}`} card={options[2]} addCard={addCard}/>
                </Row>
            </div>
        </div>
    )
}

function GetArcaneCardOptions(database: CardDatabase): Card[] {
    let pool = [...database.GetArcaneCards()]

    // Remove down to 3
    while (pool.length > 3) {
        let num = getRandomInt(0, pool.length - 1)
        pool.splice(num, 1)
    }

    return pool
}

function GetActionCardOptions(database: CardDatabase, deck_characters: CharacterCard[], deck_cards: Card[]): Card[] {
    const initialPool = GetActionCardPool(database, deck_characters)
    const maxCards: Card[] = []

    // Check if we've reached the max for any cards
    for (let i = 0; i < deck_cards.length - 1; ++i) {
        if (deck_cards[i].id === deck_cards[i + 1].id) {
            maxCards.push(deck_cards[i])
        }
    }

    const pool = initialPool.filter((card) => !maxCards.includes(card))

    const results: Card[] = []
    for (let i = 0; i < 3; ++i) {
        let found = false
        let num = 0
        while (!found) {
            num = getRandomInt(0, pool.length - 1)
            if (results.findIndex((char) => char.id === pool[num].id) != -1) {
                continue
            }

            found = true
        }

        results.push(pool[num])
    }

    return results
}

function GetActionCardPool(database: CardDatabase, deck_characters: CharacterCard[]): Card[] {
    // Get talents of characters
    const talents = deck_characters.map((char) => database.GetTalent(char))
    const resonances = GetResonanceCards(database, deck_characters)
    const weapons = GetWeaponCards(database, deck_characters)
    const elementals = GetElementalCards(database, deck_characters)

    return [
        ...talents,
        ...talents,
        ...resonances,
        ...resonances,
        ...weapons,
        ...elementals,
        ...database.GetAllActionCards()
    ]
}

function GetResonanceCards(database: CardDatabase, deck_characters: CharacterCard[]): readonly Card[] {
    let result = GIResonance.None

    if (deck_characters.length == 1) {
        return []
    }

    // Compare char 1 & 2
    result |= (deck_characters[0].resonance & deck_characters[1].resonance)

    // Compare 3rd char if applicable
    if (deck_characters.length == 3) {
        result |= (deck_characters[0].resonance & deck_characters[2].resonance)
        result |= (deck_characters[1].resonance & deck_characters[2].resonance)
    }

    return database.GetResonanceCards(result)
}

function GetWeaponCards(database: CardDatabase, deck_characters: CharacterCard[]): readonly Card[] {
    let weapons = GITag.None

    deck_characters.forEach((char) => weapons |= char.weapon)

    return database.GetMatchingWeapons(weapons)
}

function GetElementalCards(database: CardDatabase, deck_characters: CharacterCard[]): readonly Card[] {
    let elements = GIResonance.None

    deck_characters.forEach((char) => elements |= char.element)

    return database.GetElementalCards(elements)
}

function GetCharacterOptions(database: CardDatabase, deck_characters: CharacterCard[]): Card[] {
    let pool = GetCharacterPool(database, deck_characters)

    // Remove characters already in the deck
    const usedChars = deck_characters.map((char) => char.id)
    pool = pool.filter((char) => !usedChars.includes(char.id))

    const results: Card[] = []
    for (let i = 0; i < 3; ++i) {
        const option = pool[getRandomInt(0, pool.length - 1)]

        // Add the result
        results.push(option)

        // Remove all chars of the same element
        pool = pool.filter((char) => char.element !== option.element)
    }

    return results
}

function GetCharacterPool(database: CardDatabase, deck_characters: CharacterCard[]): readonly CharacterCard[] {
    const result = database.GetAllCharacters()

    // Check if we have to characters with matching elements
    if (deck_characters.length == 2 && deck_characters[0].element === deck_characters[1].element) {
        return result.filter((card) => card.element !== deck_characters[0].element)
    } else {
        return result
    }
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
