import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800&display=swap');
background: #000000;
color: #ffffff;
font-family: 'Inter', sans-serif;
margin: 0;
min-height: 100vh;
padding:22px;
width: 100%;

& > h1, > time {
  font-size: 2rem;
  font-weight: 800;
}

& > h1 {
  margin: 0;
}

& > time {
  color: #8e8e92;
  display: block;
  margin-bottom: 20px;
}

& > input[type="text"] {
  background-color: #1c1c1e;
  border: none;
  width: 100%;
  border-radius: 8px;
  height: 34px;
  padding: 0 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  margin-bottom: 14px;
}
`

const Listing = styled.ul`
color: #ffffff;
font-size: 14px;
list-style: none;
margin: 0;
padding: 0;

& > li {
  border-bottom: 1px solid #323235;
  display: grid;
  grid-template-columns: [name] 3fr [graph] 1fr [price] 1fr;
  padding: 18px 0;

  & > div {
    display: flex;
    flex-direction: column;

    & > span:nth-of-type(1) {
      margin-bottom: 10px;
    }
  }

  & .name_symbol {
    grid-column: name;
  }

  & .price_change {
    font-weight: 500;
    grid-column: price;
    text-align: right;
    align-items: flex-end;
  }

  & .ticker_symbol {
    font-weight: 600;
    font-size: 1.25rem;
    color: #ffffff;
  }

  & .company_name, .closing_price {
    font-weight: 500;
    font-size: 1rem;
  }

  & .company_name {
    color: #8e8e92;
    line-height: 1.2;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  & .percent_change {
    border-radius: 5px;
    padding: 0.4rem;
    font-size: 14px;
    min-width: 85px;

    &.neg {
      background: #ea4e3d;
    }

    &.pos {
      background: #65c466;
    }
  }
}
`

const App = () => {

  const [counters, setCounters] = useState({})
  const [today] = useState(new Intl.DateTimeFormat('en-GB', { /*year: 'numeric',*/ month: 'long', day: 'numeric' }).format(Date.now()))

  useEffect(() => {
    fetch("http://localhost:8000/")
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      setCounters(json)
    })
    .catch((err) => {
      console.log(err)
    });
  }, [])

  return (
    <Wrapper>
      <h1>Stocks</h1>
      <time>{today}</time>
      <input type="text" placeholder="Search" />
      <Listing>
        {Object.keys(counters).map((counter, index) => {
          const direction = (Number(counters[counter].percent_change.replace("%", "")) >= 0) ? "pos" : "neg";
          return (
          <li key={index}>
            <div className="name_symbol">
              <span className="ticker_symbol">{counter}</span>
              <span className="company_name">{counters[counter].company_name}</span>
            </div>
            <div className="graph">

            </div>
            <div className="price_change">
              <span className="closing_price">{counters[counter].closing_price}</span>
              <span className={`percent_change ${direction}`}>{counters[counter].percent_change}</span>
            </div>
          </li>)
        })}   
      </Listing>
    </Wrapper>
  )
}

export default App