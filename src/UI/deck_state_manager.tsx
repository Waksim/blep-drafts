import './deck_state_manager.css';
import {useState, useRef} from 'react';

import {Card, CharacterCard} from "../card_database/card";
import {DeckRenderer} from './Deck/deck_renderer';
import {CardSelector} from './card_selector';
import {generate_deck_code} from '../utility/deck_export';
import {CardDatabase} from '../card_database/card_database';
import {SocialsRenderer} from '../Socials/socials_renderer';
// import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';


const COPY_TEXT = "Copy to clipboard"
const COPIED_TEXT = "Copied!"

export function DeckStateManager() {
    const textRef = useRef<HTMLLabelElement | null>(null)
    const [characters, setCharacters] = useState<CharacterCard[]>([])
    const [cards, setCards] = useState<Card[]>([])
    const [retries, setRetries] = useState(0)
    const [copyText, setCopyText] = useState(COPY_TEXT)

    const addCard = (card: Card) => {
        if (card instanceof CharacterCard) {
            setCharacters([
                ...characters,
                card
            ])
        } else {
            let newCards = [...cards, card]
            newCards.sort((a, b) => a.id - b.id)

            setCards(newCards)
        }
    }

    const incrementRetries = () => {
        setRetries(retries + 1)
        setCopyText(COPY_TEXT)
    }

    const reset = () => {
        setCharacters([])
        setCards([])
        setCopyText(COPY_TEXT)
        setRetries(0)
    }

    // Check if we should be done drafting
    if (cards.length >= 30) {
        const copyToClipboard = async () => {
            try {
                if (textRef.current) {
                    await navigator.clipboard.writeText(textRef.current.textContent ?? "");
                    setCopyText(COPIED_TEXT)
                }
            } catch (error) {
                console.error('Error copying to clipboard:', error);
            }
        }

        return (
            <Container>
                <Row>
                    <DeckRenderer characters={characters} cards={cards} width={3}/>
                </Row>

                <div className="draft-result-box">
                    <label className="draft-result-title">Draft complete!</label>
                    <Row>
                        <label className="draft-result-code"
                               ref={textRef}>{generate_deck_code(characters, cards, retries)}</label>
                        <button className="draft-result-button" onClick={copyToClipboard}>{copyText}</button>
                    </Row>
                    <div className="draft-result-retry">
                        <label className="draft-result-body">If the deck code doesn't work, hit</label>
                        <button className="draft-result-button" onClick={incrementRetries}>Retry</button>
                        <label className="draft-result-body">for a new code</label>
                    </div>
                    <button className="draft-again-button" onClick={reset}>Draft again!</button>

                    <Row>
                        <SocialsRenderer/>
                    </Row>

                </div>
            </Container>
        )
    }

    return (
        <Container>
            <Row>
                <CardSelector deck_characters={characters} deck_cards={cards} addCard={addCard}/>
            </Row>
            <Row>
                <DeckRenderer characters={characters} cards={cards} width={3}/>
            </Row>
            <Row>
                <SocialsRenderer/>
            </Row>
        </Container>
    )
}
