import {Card, CharacterCard} from "../card_database/card"
import {CardRenderer, CardSize} from "./card_renderer"
import './card_button.css'
import {useContext} from "react"
import {DescriptionContext} from "./Description/description_context"
import {LocalizationContext} from "../localization/localizationContext"
import Button from 'react-bootstrap/Button';
import BCard from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

export interface CardButtonProps {
    card: Card
    addCard: (card: Card) => void
}

export function CardButton({card, addCard}: CardButtonProps) {
    const size: CardSize = (card instanceof CharacterCard) ? CardSize.card_select : CardSize.card_select
    const descriptionContext = useContext(DescriptionContext)
    const localizationContext = useContext(LocalizationContext)

    const pickCard = () => {
        addCard(card)
    }

    const showCardDescription = () => {
        if (card) {
            descriptionContext.setCard(card)
        }
    }



    return (
        <Col>
            <BCard className={"p-0, m-0"} bg={"secondary"}>
                <div className={"d-grid, p-0"}>
                    <BCard.Img className={"m-0, p-0"} variant="top" src={`${process.env.PUBLIC_URL}/assets/${card.image_file}`}
                               alt={card.display_name} onClick={pickCard}/>
                </div>
                <BCard.Footer className={"d-grid, p-0"}>
                    <div onClick={showCardDescription}>
                        <p className={"text-center, align-middle, m-0"}>Description</p>
                    </div>
                    {/*<BCard.Title>{localizationContext.getString(card.display_name)}</BCard.Title>*/}
                    {/*<BCard.Text>*/}
                    {/*    Some quick example text to build on the card title and make up the*/}
                    {/*    bulk of the card's content.*/}
                    {/*</BCard.Text>*/}
                </BCard.Footer>
            </BCard>
        </Col>
    );
    // return (
    //     <div className="cardBox">
    //         <div className="cardNameBox">
    //             <label className="cardName">{localizationContext.getString(card.display_name)}</label>
    //         </div>
    //         <img className="card-image" src={`${process.env.PUBLIC_URL}/assets/${card.image_file}`} alt={card.display_name} onClick={pickCard}/>
    //         <button className="infoButton" onClick={showCardDescription}>See description</button>
    //     </div>
    // )
}
