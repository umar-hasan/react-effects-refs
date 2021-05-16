import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";

function Deck() {
  const [deck, setdeck] = useState(null);
  const [cards, setcards] = useState([]);
  const [autoDraw, setautoDraw] = useState(false);
  const [finish, setfinish] = useState(false)
  const timer = useRef(null);

  useEffect(() => {
    const loadCards = async () => {
      const res = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle"
      );
      setdeck(res.data);
    };
    loadCards();
    return () => {};
  }, [setdeck]);

  useEffect(() => {
    const drawCard = async () => {
      try {
        const res = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`
        );

        if (res.data.remaining === 0) {
            setfinish(true)
          throw new Error("No more cards.");
        }

        const card = res.data.cards[0];

        setcards((cards) => [
          ...cards,
          {
            image: card.image,
            id: card.code,
            value: card.value,
            suit: card.suit,
            rotate: Math.floor(Math.random() * 50),
          },
        ]);
      } catch (error) {
          setautoDraw(false)
        alert(error);
        if (timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
      }
    };

    if (!timer.current && autoDraw) {
      timer.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [autoDraw, setautoDraw, deck]);

  const addCards = () => {
    setautoDraw((autoDraw) => !autoDraw);
  };


  const drawnCards = cards.map((c) => {
    return <Card key={c.id} url={c.image} rotateDeg={c.rotate} />;
  });

  return (
    <div>
      <button id="btn" onClick={addCards} disabled={finish}>
        {autoDraw ? "Stop" : "Draw"}
      </button>
      <div id="card-deck">{drawnCards}</div>
    </div>
  );
}

export default Deck;
