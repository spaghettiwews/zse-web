import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatDistance } from 'date-fns'

const Wrapper = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800&display=swap');
display: grid;
grid-template-columns: 520px auto;
grid-gap: 22px;
background: #fff1e5;
color: #000;
font-family: 'Inter', sans-serif;
margin: 0;
min-height: 100vh;
padding:22px;
width: 100%;

& > div > header > h1, 
> div > header > time {
  font-size: 2rem;
  font-weight: 800;
}

& > div > header > h1 {
  margin: 0;
}

& > div > header > time {
  color: #8e8e92;
  display: block;
  margin-bottom: 20px;
}

& > div > header > input[type="text"] {
  background-color: #fff7ef;
  border: 1px solid #b3b3b4;
  color: #1d1d1e;
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
color: #000;
font-size: 14px;
list-style: none;
margin: 0;
padding: 0;

& > li > details > summary {
  border-bottom: 1px solid #b3b3b4;
  color: #fff;
  cursor: pointer;
  display: grid;
  grid-template-columns: [name] 3fr [graph] 1.3fr [price] 1fr;
  padding: 18px 0;
  text-decoration: none;

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
    color: #000;
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

  & .closing_price {
    color: #000;
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

const NewsList = styled.ul`
  padding: 22px;
  line-height: 22px;
  background-color: #fff7ef;

  &:empty {
    // display: none;
  }
`

const NewsLink = styled.li`
  margin-bottom: 1rem;

  & > a {
    color: #fff;
    text-decoration: none;
    color: #1e6dc0;
    font-family: Verdana,Arial,Tahoma;
    font-size: 0.8rem;
  }

  time {
    color: #828282;
    display: block;
    font-size: .6rem;
  }
`

const ListItem = (props) => {
  let temp = {}
  let articles = {}

  const handleClick = (event, query) => {
    // window.location.hash = `#${props.counter.toLowerCase()}`
    const fetchData = async () => {
      await fetch(`https://stonks.co.zw/api/news/${query}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          json["rss"].channel.item.forEach(article => {
            temp[Number.parseInt(new Date(article.pubDate).getTime() / 1000)] = article
          });
          articles[props.counter] = temp
          props.setNews(articles)
        })
        .catch((err) => {
          console.log(err)
        });
    }
    fetchData()
  }

  return (
    <li id={props.counter.toLowerCase()}>
      <details onClick={(event) => handleClick(event, props.query)}>
        {props.children}
      </details>
    </li>
  )
}

const News = (props) => {
  if (Object.keys(props.news)[0] === props.counter) {
    return Object.keys(props.news[props.counter]).sort((a, b) => b - a).map((article, index) => {
      return (
        <NewsLink key={index}>
          <a href={props.news[props.counter][article].link} target='_blank'>{props.news[props.counter][article].title}</a>
          <time>Posted {formatDistance(new Date(props.news[props.counter][article].pubDate), new Date(), { addSuffix: true })}</time>
        </NewsLink>
      )
    })
  }
  else {
    return null
  }
}

const App = () => {
  const [counters, setCounters] = useState({})
  const [today] = useState(new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric' }).format(Date.now()))
  const [history, setHistory] = useState({})
  const [news, setNews] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://api.stonks.co.zw/")
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        setCounters(json)
      })
      .catch((err) => {
        console.log(err)
      });
    }

    fetchData()
  }, [])


  useEffect(() => {

    let updatedHistory = {}
    Object.keys(counters).map((counter, index) => {

      const fetchData = async () => {
        await fetch(`https://api.stonks.co.zw/history/${counter}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          updatedHistory[counter] = json
          
          // forceUpdate()

          if (Object.keys(updatedHistory).length === Object.keys(counters).length) {
            setHistory(updatedHistory)
          }
        })
        .catch((err) => {
          console.log(err)
        }); 
      }

      fetchData()
      return null
    })
  }, [counters])


  useEffect(() => {

    let data = Object.keys(counters).map((counter, index) => {
      return {
        ticker: counter,
        percent_change: Number(counters[counter].percent_change.replace("%", ""))
      }
    });

    setTreemapData(data)

  }, [counters])

  return (
    <Wrapper>
      <div>
        <header>
      <h1>Stonks</h1>
      <time>{today}</time>
      <input type="text" placeholder="Search" />
        </header>
      <Listing>
        {Object.keys(counters).map((counter, index) => {
          const direction = (Number(counters[counter].percent_change.replace("%", "")) >= 0) ? "pos" : "neg";
          return (
              <ListItem key={index} query={counters[counter].company_name.replaceAll(' ', '+')} setNews={setNews} counter={counter}>
                <summary>
            <div className="name_symbol">
              <span className="ticker_symbol">{counter}</span>
              <span className="company_name">{counters[counter].company_name}</span>
            </div>
            <div className="graph">
              <AreaChart width={85} height={35} data={history[counter]}
              margin={{ top: 2, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="pos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(118, 214, 113, 0.65)" />
                  <stop offset="95%" stopColor="rgba(118, 214, 113, 0)" />
                </linearGradient>
                <linearGradient id="neg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(234, 78, 61, 0.65)" />
                  <stop offset="95%" stopColor="rgba(234, 78, 61, 0)" />
                </linearGradient>
              </defs>
              {direction === 'pos' ?
              <Area
                type="monotone"
                dataKey="closing_price"
                stroke="#76d671"
                strokeWidth="2"
                fillOpacity=".65"
                fill="url(#pos)"
              /> :
              <Area
                type="monotone"
                dataKey="closing_price"
                stroke="#ea4e3d"
                strokeWidth="2"
                fillOpacity=".65"
                fill="url(#neg)"
              />}
            </AreaChart>
            </div>
            <div className="price_change">
              <span className="closing_price">${counters[counter].closing_price}</span>
              <span className={`percent_change ${direction}`}>{counters[counter].percent_change}</span>
            </div>
                </summary>
                <NewsList>
                  <News news={news} counter={counter} />
                </NewsList>
              </ListItem>
            )
        })}   
      </Listing>
      </div>
      <div>
      </div>
    </Wrapper>
  )
}

export default App